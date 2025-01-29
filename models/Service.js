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
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag',
  }],
  description: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  contactNumber: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
  },
  reviews: [
    {
      userId: { type: String, ref: 'User' },
      comment: String,
      rating: Number,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  isVerified: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

ServiceSchema.index({ serviceType: 'text' });
ServiceSchema.index({ address: 'text' });
ServiceSchema.index({ tags: 1 });
ServiceSchema.index({ location: '2dsphere' });
ServiceSchema.index({ tags: 1, location: '2dsphere' });

ServiceSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Service', ServiceSchema);
