const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const PORT = process.env.AUTH_PORT ?? 7002;

app.use(express.json());

const refreshTokens = []

function getAuthToken(user){
    return jwt.sign(user, process.env.AUTH_TOKEN, { expiresIn : '60s'});
}

function getRefreshToken(user){
    return jwt.sign(user, process.env.REFRESH_TOKEN);
}

app.post('/token', (req, res) => {
    const refreshToken = req.body.token;
    if(!refreshToken) return res.sendStatus(401);
    if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user) => {
        if(err) return res.sendStatus(403);
        const auth = getAuthToken({ name  : user.name});
        res.json({ authToken : auth });
    })
})

app.post('/login', (req, res) => {
    //Execute Password Authentication
    username = req.body.username;
    user = { name : username};
    const authToken =  getAuthToken(user);
    const refreshToken = getRefreshToken(user);
    refreshTokens.push(refreshToken);
    const token = { authToken, refreshToken}
    res.json(token);
})

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});