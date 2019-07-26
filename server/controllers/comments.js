const verify = require('./verify');

function create(req, res) {
    const auth = verify.verifyUser(req, res);
    if (auth) {
        const db = req.app.get('db');
        const { userId, postId, comment } = req.body

        db.comments
            .insert({
                userId,
                postId,
                comment,
            })
            .then(comment => res.status(201).json(comment))
            .catch(err => {
                console.error(err);
            });
    }
    else res.status(401).end();
}

function updateComment(req, res) {
    const auth = verify.verifyUser(req, res);
    if (auth) {
        const db = req.app.get('db');
        const { id } = req.params;
        const { comment } = req.body;
        db.comments
            .save({ id, comment })
            .then(comment => res.status(200).json(comment))
            .catch(err => {
                console.error(err);
                res.status(500).end();
            });
    }
    else res.status(401).end();
}

module.exports = {
    create,
    updateComment
};