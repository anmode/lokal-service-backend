// seedServices.js
require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('./models/Service'); // Ensure the path is correct

const sampleServices = [
  {
    _id: "SV001",
    userId: "U001",
    serviceType: "Plumbing",
    tags: ["60d0fe4f5311236168a109ca"], // Example Tag ObjectId for "plumbing"
    description: "Residential and commercial plumbing services, including leak repair and pipe installation.",
    address: "123 Main Street, Locality, City",
    location: {
      type: "Point",
      coordinates: [78.0495, 27.6305], // [longitude, latitude]
    },
    contactNumber: "+91-9876543210",
    rating: 4.5,
    category: "Home Services",
    reviews: [],
    isVerified: true,
  },
  {
    _id: "SV002",
    userId: "U002",
    serviceType: "Plumbing",
    tags: ["60d0fe4f5311236168a109ca"], // "plumbing"
    description: "Expert plumbing services with 10+ years of experience. We handle emergency repairs, installations, and maintenance.",
    address: "456 Secondary Road, Locality, City",
    location: {
      type: "Point",
      coordinates: [78.0510, 27.6280],
    },
    contactNumber: "+91-9123456789",
    rating: 4.2,
    category: "Home Services",
    reviews: [
      {
        userId: "U003",
        comment: "Very prompt service!",
        rating: 5,
        createdAt: new Date(),
      },
    ],
    isVerified: true,
  },
  {
    _id: "SV003",
    userId: "U004",
    serviceType: "Plumbing",
    tags: ["60d0fe4f5311236168a109ca"], // "plumbing"
    description: "Affordable plumbing solutions for small repairs and installations.",
    address: "789 Tertiary Ave, Locality, City",
    location: {
      type: "Point",
      coordinates: [78.0525, 27.6310],
    },
    contactNumber: "+91-9988776655",
    rating: 3.9,
    category: "Home Services",
    reviews: [],
    isVerified: false,
  },
];

const seedServices = async () => {

    const MONGO_URI = 'mongodb+srv://Anmol:yash2002@cluster0.i3wzsv5.mongodb.net/lokalService?retryWrites=true&w=majority';
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');

    // Clear the collection (optional)
    await Service.deleteMany({});
    console.log('Old services removed');

    // Insert the sample data
    await Service.insertMany(sampleServices);
    console.log('Sample services inserted successfully');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding services:', error);
    mongoose.connection.close();
  }
};

seedServices();
