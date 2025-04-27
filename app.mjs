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
import { fetchMovieDetails } from './utils/omdb.js';
import axios from 'axios';
import User from './user.js';
import config from 'config';

const app = express();
app.use(express.urlencoded({ extended: true }));

// ✅ NEW: initialize passport + session middleware
initialize(passport);
app.use(session({
  secret: config.get('sessionSecret'),
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
await mongoose.connect(config.get('mongodbUri'), {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Serve the form page with movie list
app.get('/', async (req, res) => {
  let rawMovies;
  let pageTitle;

  if (req.user) {
    rawMovies = await Movie.find({ user: req.user._id });
    pageTitle = "Your Movies List";
  } else {
    rawMovies = await Movie.find({});
    pageTitle = "Movies List";
  }

  // ✅ Map and transform movie data
  const movies = rawMovies
  .sort((a, b) => b._id.getTimestamp() - a._id.getTimestamp()) 
  .map(movie => ({
    _id: movie._id,
    title: movie.title.toUpperCase(),
    genre: Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre,
    year: movie.year
  }));

// RIGHT HERE add:
res.render('index', { movies, errorMsg: null, pageTitle });
});


// Add a movie
app.post('/add', async (req, res) => {
  const { title, genre, year } = req.body;

  try {
    const omdbDetails = await fetchMovieDetails(title); // 🛠️ Clean fetch

    let finalTitle, finalGenre, finalYear;

    if (omdbDetails) {
      // ✅ If OMDb found, trust OMDb 100%
      finalTitle = omdbDetails.title.trim();
      finalGenre = omdbDetails.genre;
      finalYear = omdbDetails.year;
    } else {
      // ❌ If OMDb failed, fallback to user input
      finalTitle = title.trim();
      finalGenre = genre ? genre.split(",").map(g => g.trim()) : [];
      finalYear = year ? parseInt(year) : null;
    }

    // ✅ Use ES6 Class
    class MovieEntry {
      constructor(title, genre, year) {
        this.title = title;
        this.genre = genre;
        this.year = year;
      }
    }

    const newEntry = new MovieEntry(finalTitle, finalGenre, finalYear);

    const movie = new Movie({
      title: newEntry.title,
      genre: newEntry.genre,
      year: newEntry.year,
      user: req.user ? req.user._id : null
    });

    await movie.save();
    res.redirect('/');
  } catch (error) {
    console.error(error);

    const movies = req.user
      ? await Movie.find({ user: req.user._id })
      : await Movie.find({});

    res.render('index', {
      movies,
      errorMsg: "Error adding movie.",
      pageTitle: req.user ? "Your Movies List" : "Movies List"
    });
  }
});


app.get('/search-titles', async (req, res) => {
  const query = req.query.q;
  const apiKey = config.get('omdbApiKey');

  if (!query) return res.json([]);

  try {
    const url = `http://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(query)}`;
    const response = await axios.get(url);

    if (response.data.Response === "False") {
      return res.json([]);
    }

    // Only send back title and year
    const results = response.data.Search.map(item => ({
      title: item.Title,
      year: item.Year
    }));

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

// Fetch full movie details when a title is selected
app.get('/fetch-movie-details', async (req, res) => {
  const { title } = req.query;
  if (!title) return res.json({ success: false });

  try {
    const details = await fetchMovieDetails(title);
    if (!details) return res.json({ success: false });

    res.json({
      success: true,
      genre: Array.isArray(details.genre) ? details.genre.join(", ") : details.genre,
      year: details.year
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
});

// Delete a movie
app.post('/delete-movie', async (req, res) => {
  const id = req.body.movieId;
  await Movie.findByIdAndDelete(id);
  res.redirect('/');
});

// Add a movie to watchlist
// Add a movie to watchlist and show confirmation page
app.post('/watchlist/add/:movieId', async (req, res) => {
  if (!req.user) {
    return res.redirect('/auth/login');
  }

  try {
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { watchlist: req.params.movieId }
    });

    res.redirect(`/watchlist/success/${req.params.movieId}`);
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

// View user's watchlist
app.get('/watchlist', async (req, res) => {
  if (!req.user) {
    return res.redirect('/auth/login');
  }

  try {
    const user = await User.findById(req.user._id).populate('watchlist');
    const movies = user.watchlist.map(movie => ({
      _id: movie._id,
      title: movie.title.toUpperCase(),
      genre: Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre,
      year: movie.year
    }));

    res.render('watchlist', { movies, pageTitle: "Your Watchlist" });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

app.get('/watchlist/success/:movieId', async (req, res) => {
  if (!req.user) {
    return res.redirect('/auth/login');
  }

  try {
    const user = await User.findById(req.user._id).populate('watchlist');
    const addedMovie = await Movie.findById(req.params.movieId);

    const movies = user.watchlist.map(movie => ({
      _id: movie._id,
      title: movie.title.toUpperCase(),
      genre: Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre,
      year: movie.year
    }));

    res.render('watchlist-success', { addedMovie, movies, pageTitle: "Watchlist Updated!" });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});



// Start the server
const PORT = config.get('port') || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
