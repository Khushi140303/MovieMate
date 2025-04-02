import express from 'express';
import mongoose from 'mongoose';
import Movie from './movie.js';

const app = express();
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
await mongoose.connect('mongodb://127.0.0.1:27017/moviemate');

// Serve the form page
app.get('/', (req, res) => {
  res.sendFile('views/index.html', { root: '.' });
});

// ✅ Handle form submission
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
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
