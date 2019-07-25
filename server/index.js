const express = require('express');
const massive = require('massive');

//CONTROLLERS
const users = require('./controllers/users');
const posts = require('./controllers/posts');
const comments = require('./controllers/comments');

massive({
    host: 'localhost',
    port: 5432,
    database: 'node3',
    user: 'postgres',
    password: 'node3db',
}).then(db => {
    const app = express();

    app.set('db', db);

    app.use(express.json());

    //USERS ENDPOINTS
    app.post('/api/users', users.create);
    app.get('/api/users', users.list);
    app.get('/api/users/:id', users.findById)
    app.get('/api/users/:id/profile', users.viewProfile)

    //POSTS ENDPOINTS
    app.post('/api/posts', posts.create)
    app.get('/api/posts/:postId', posts.viewPostByPostId)
    app.get('/api/users/:userId/posts', posts.viewPostsByUserId)
    app.patch('/api/posts/:postId', posts.updatePost)

    //COMMENTS ENDPOINTS
    app.post('/api/comments', comments.create)
    app.patch('/api/comments/:id', comments.updateComment)

    const PORT = 3001;
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
});