const fs = require('fs'); // File system module for reading and writing files
const express = require('express'); // Express module for building the server
const path = require('path'); // Path module for working with file paths
const PORT = process.env.PORT || 3001; // Port number for the server
const genID = require('./helper/uuid'); // Custom helper module for generating unique IDs

const app = express(); // Create an instance of the Express application
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded request bodies

app.use(express.static('public')); // Serve static files from the 'public' directory

// Route to serve the notes.html file
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// Route to retrieve the notes from the database
app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read notes from the database.' });
    }

    try {
      const notes = JSON.parse(data); // Parse the file data as JSON
      res.json(notes); // Send the parsed notes as the response
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to parse notes data.' });
    }
  });
});

app.delete('/api/notes/:id', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to read notes from the database.' });
      }
  
      try {
        const notes = JSON.parse(data);
        const noteId = req.params.id;
  
        const updatedNotes = notes.filter(note => note.id !== noteId);
  
        fs.writeFile('./db/db.json', JSON.stringify(updatedNotes), (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to delete the note from the database.' });
          }
  
          res.json({ message: 'Note deleted successfully.' });
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to parse notes data.' });
      }
    });
  });
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  });

// Route to create a new note
app.post('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read notes from the database.' });
    }

    try {
      const notes = JSON.parse(data); // Parse the file data as JSON

      // Generate a unique ID for the new note
      const newNoteId = genID();

      // Create a new note object with the received data and generated ID
      const newNote = {
        id: newNoteId,
        title: req.body.title,
        text: req.body.text,
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

// Route to serve the index.html file for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start the server and listen on the specified port
app.listen(PORT, () => console.log(`http://localhost:${PORT} 🚀`));
