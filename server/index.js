const express = require('express');
const massive = require('massive');
const users = require('./controllers/users')

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


    app.post('/api/users', users.create);
    app.get('/api/users', users.list);
    app.get('/api/users/:id', users.findById)
    app.get('/api/users/:id/profile', users.viewProfile)

    const PORT = 3001;
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
});