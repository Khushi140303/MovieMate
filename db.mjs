// db.mjs

// Sample User Schema
// Stores user credentials and their watchlist
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String, // Hashed
    watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
  });
  
  // Sample Movie Schema
  // Stores movie data and references to reviews
  const movieSchema = new mongoose.Schema({
    title: String,
    genre: [String],
    year: Number,
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
  });
  
  // Sample Review Schema
  // Stores review info and references to movie/user
  const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
    rating: Number,
    comment: String,
    timestamp: Date
  });
  