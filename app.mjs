import './config.mjs'
import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';
import { initialize } from './routes/passport-config.js';
import authRoutes from './routes/auth.js'; 
import Movie from './movie.js';
import 'dotenv/config'
import reviewRoutes from './routes/reviews.js'; 



const app = express();
app.use(express.urlencoded({ extended: true }));

// ✅ NEW: initialize passport + session middleware
initialize(passport);
app.use(session({
  secret: 'supersecret',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// ✅ Expose user to all views
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// Setup view engine BEFORE routes
app.set('view engine', 'ejs');
app.set('views', './views');

// ✅ NEW: Use auth routes
app.use('/auth', authRoutes);
app.use('/reviews', reviewRoutes);
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
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});