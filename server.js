const fs = require('fs');
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3001;
const genID = require('./helper/uuid');

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
          console.error(err);
          return res.status(500).json({ error: 'Failed to read notes from the database.' });
        }
    
        try {
          const notes = JSON.parse(data);
    
          // Generate a unique ID for the new note
          const newNoteId = genID();
    
          // Create a new note object with the received data and generated ID
          const newNote = {
            id: newNoteId,
            title: req.body.title,
            text: req.body.text
          };
    
          // Add the new note to the notes array
          notes.push(newNote);
    
          // Write the updated notes array back to the db.json file
          fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ error: 'Failed to save the note to the database.' });
            }
    
            // Send the new note as the response
            res.json(newNote);
          });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Failed to parse notes data.' });
        }
      });
});

app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
});

app.listen(PORT, () => console.log(`http://localhost:${PORT} 🚀`));