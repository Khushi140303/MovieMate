import mongoose from 'mongoose';

const MovieSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  genre:    [{ type: String }],
  year:     { type: Number },
  reviews:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
});

export default mongoose.model('Movie', MovieSchema);
