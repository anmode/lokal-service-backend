const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  _id: {
    type: String,
  },
  userId: {
    type: String,
    ref: 'User',
    required: true,
  },
  serviceType: {
    type: String,
    required: true,
    enum: ['plumber', 'electrician', 'carpenter', 'cleaner', 'other'],
  },
  tags: [String],
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      userId: { type: String, ref: 'User' },
      comment: String,
      rating: Number,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

ServiceSchema.index({ tags: 'text', serviceType: 'text' });

ServiceSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Service', ServiceSchema);
