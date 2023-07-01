const fs = require('fs');
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3001;
//const resources = require('./public/assets/js/index');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/notes', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
});

app.get('/api/notes', (req,res) => {
    //todo read database db file and return all saved notes as json
});

app.post('/notes', (req,res) => {
    //todo should receive a new note to save on the request body, add it to the
    // `db.json` file, and then return the new note to the client. You'll need to find a way to 
    // give each note a unique id when it's saved (look into npm packages that could do this for you).
});

app.listen(PORT, () => console.log(`http://localhost:${PORT} 🚀`));