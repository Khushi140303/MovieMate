import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movie:    { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  rating:   { type: Number, required: true, min: 0, max: 5 },
  comment:  { type: String },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Review', ReviewSchema);
