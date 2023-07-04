const fs = require('fs');
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/notes', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

app.get('/api/notes', (req,res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          // Handle the error
          console.error(err);
          return res.status(500).json({ error: 'Failed to read notes from the database.' });
        }
    
        try {
          // Process the file data
          const notes = JSON.parse(data);
          res.json(notes);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Failed to parse notes data.' });
        }
      });   
});

app.post('/notes', (req,res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          // Handle the error
          console.error(err);
          return res.status(500).json({ error: 'Failed to read notes from the database.' });
        }
    
        try {
          // Process the file data
          const notes = JSON.parse(data);
          res.json(notes);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Failed to parse notes data.' });
        }
      });
});
    //todo should receive a new note to save on the request body, add it to the
    // `db.json` file, and then return the new note to the client. You'll need to find a way to 
    // give each note a unique id when it's saved (look into npm packages that could do this for you)

app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
});

app.listen(PORT, () => console.log(`http://localhost:${PORT} 🚀`));