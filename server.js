const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const PORT = process.env.SERVER_PORT ?? 7001;

app.use(express.json());

const posts = [
    {
        name : "Anmol",
        title : "Post1"
    },
    {
        name : "Suyash",
        title : "Post2"
    }
];

function authorize(req, res, next){
    const authHead = req.headers['authorization']
    const token = authHead?.split(' ')[1];
    if(!token) return res.sendStatus(401);
    
    jwt.verify(token, process.env.AUTH_TOKEN, (err, user) => {
        if(err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

app.get('/posts', authorize ,(req, res) => {
    res.json(posts.filter((post) => post.name === req.user.name));
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});