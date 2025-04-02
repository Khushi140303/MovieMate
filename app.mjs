
import './config.mjs'
import express from 'express';
import mongoose from 'mongoose';
import Movie from './movie.js';
import 'dotenv/config'
const app = express();
app.use(express.urlencoded({ extended: true }));

// PORT = process.env.PORT
// DSN= process.env.DSN
// Connect to MongoDB
await mongoose.connect(process.env.DSN);

// Serve the form page
app.get('/', (req, res) => {
  res.sendFile('views/index.html', { root: '.' });
});


app.post('/add', async (req, res) => {
  const { title, genre, year } = req.body;
  try {
    const movie = new Movie({ title, genre, year });
    await movie.save();

    res.send(`
      <h1>Movie Added!</h1>
      <p>Title: ${title}</p>
      <p>Genre: ${genre}</p>
      <p>Year: ${year}</p>
    `);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding movie');
  }
});

// Start the server
app.listen(process.env.PORT, () => {
  console.log('Server running at http://localhost:3000');
});
