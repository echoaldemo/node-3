const verify = require('./verify');

function create(req, res) {
    const auth = verify.verifyUser(req, res);
    if (auth){
        const db = req.app.get('db');
        const { userId, content } = req.body;
        db.posts
            .insert({
                userId,
                content,
            })
            .then(post => res.status(201).json(post))
            .catch(err => {
                console.error(err);
            });
    }
    else res.status(401).end();
}

function viewPostByPostId(req, res) {
    const auth = verify.verifyUser(req, res);
    if (auth) {
        const db = req.app.get('db');
        const { comments } = req.query;
        const { postId } = req.params;
        let result = [];
        db.posts.findOne({ id: postId })    
            .then(post => post)
            .catch(err => {
                console.error(err);
                res.status(500).end();
            })
            .then(post => {
                result.push(post)
                if (comments){            
                    db.comments.find({ postId })
                    .then(postComments => {
                        result.push(postComments)
                        res.status(200).json(result)
                    })
                }
                else {
                    res.status(200).json(post)
                }
            })
            .catch(err => {
                console.error(err);
                res.status(500).end();
            });
    }
    else res.status(401).end();
}

function viewPostsByUserId(req, res) {
    const auth = verify.verifyUser(req, res);
    if (auth){
        const db = req.app.get('db');
        const { userId } = req.params;
        
        db.posts
            .find({ userId })
            .then(posts => res.status(200).json(posts))
            .catch(err => {
                console.error(err);
                res.status(500).end();
            });
    }
    else res.status(401).end();
}

function updatePost(req, res) {
    const auth = verify.verifyUser(req, res);
    if (auth) {
        const db = req.app.get('db');
        const { postId } = req.params;
        const { content } = req.body;
        db.posts
            .save({ id: postId, content })
            .then(post => res.status(200).json(post))
            .catch(err => {
                console.error(err);
                res.status(500).end();
            });
    }
    else res.status(401).end();
}

module.exports = {
    create,
    viewPostByPostId,
    viewPostsByUserId,
    updatePost
};