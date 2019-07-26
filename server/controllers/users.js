const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const secret = require('../../secret');
const verify = require('./verify');

function create(req, res) {
    const db = req.app.get('db');
    const { email, password } = req.body;
    argon2
        .hash(password)
        .then(hash => {
            return db.users.insert(
                {
                    email,
                    password: hash,
                    user_profiles: [
                        {
                            userId: undefined,
                            about: null,
                            thumbnail: null
                        },
                    ],
                },
                {
                    fields: ['id', 'email'],
                    deepInsert: true,
                }
            );
        })
        .then(user => {
            const token = jwt.sign({ userId: user.id }, secret); // adding token generation
            res.status(201).json({ ...user, token });
        })
        .catch(err => {
            console.error(err);
            res.status(500).end();
        });
}

function login(req, res) {
    const db = req.app.get('db');
    const { email, password } = req.body;

    db.users
        .findOne(
            {
                email,
            },
            {
                fields: ['id', 'email', 'password'],
            }
        )
        .then(user => {
            if (!user) {
                throw new Error('Invalid email');
            }

            return argon2.verify(user.password, password).then(valid => {
                if (!valid) {
                    throw new Error('Incorrect password');
                }

                const token = jwt.sign({ userId: user.id }, secret);
                delete user.password;
                res.status(200).json({ ...user, token });
            });
        })
        .catch(err => {
            if (
                ['Invalid email', 'Incorrect password'].includes(err.message)
            ) {
                res.status(400).json({ error: err.message });
            } else {
                console.error(err);
                res.status(500).end();
            }
        });
}

function list(req, res) {
    const auth = verify.verifyUser(req, res);
    if (auth) {
        const db = req.app.get('db');
        db.users
            .find()
            .then(users => {
                users.forEach(user => {
                delete user.password;
                })
                res.status(200).json({ ...users });
            })
            .catch(err => {
                console.error(err);
                res.status(500).end();
            });
    }
    else res.status(401).end();
}

function findById(req, res){
    const auth = verify.verifyUser(req, res);
    if (auth) {
        const db = req.app.get('db');
        db.users
            .findOne(req.params.id)
            .then(user => {
                delete user.password;
                res.status(200).json({ ...user });
            })
            .catch(err => {
                console.error(err);
                res.status(500).end();
            });
    }
    else res.status(401).end();
}

function viewProfile(req, res) {
    const auth = verify.verifyUser(req, res);
    if (auth) {
        const db = req.app.get('db');
        db.user_profiles
            .findOne({ userId: req.params.id })
            .then(profile => res.status(200).json(profile))
            .catch(err => {
                console.error(err);
                res.status(500).end();
            });
    }
    else res.status(401).end();
}

module.exports = {
    create,
    login,
    list,
    findById,
    viewProfile
};