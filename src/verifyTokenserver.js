const express = require('express');
const cors = require('cors');
const { verifyIdToken } = require('./verifyGoogleToken'); 

const app = express();
app.use(cors());
app.use(express.json());

app.post('/verify-token', async (req, res) => {
  const { token } = req.body;
  const payload = await verifyIdToken(token);

    //calling the function from verifyGoogleToken.js
    if (!payload) {
        return res.status(401).json({ error: 'Invalid token' });
    }
    
    const userId = payload.sub;  //unique google userID
    // Optionally: look up / create user here
    
    res.send({ message: 'User verified', userId });
});