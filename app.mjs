import './config.mjs'
import express from 'express';
import mongoose from 'mongoose';
import Movie from './movie.js';
import 'dotenv/config'

const app = express();
app.use(express.urlencoded({ extended: true }));

// Setup view engine BEFORE routes
app.set('view engine', 'ejs');
app.set('views', './views');

// Connect to MongoDB
await mongoose.connect(process.env.DSN);

// Serve the form page with movie list
app.get('/', async (req, res) => {
  const movies = await Movie.find({});
  res.render('index', { movies });
});

// Add a movie
app.post('/add', async (req, res) => {
  const { title, genre, year } = req.body;
  try {
    const movie = new Movie({ title, genre, year });
    await movie.save();
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding movie');
  }
});

// Delete a movie
app.post('/delete-movie', async (req, res) => {
  const id = req.body.movieId;
  await Movie.findByIdAndDelete(id);
  res.redirect('/');
});

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}`);
});
