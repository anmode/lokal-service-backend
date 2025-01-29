const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const User = require('./models/User');
const Tag = require('./models/Tag');
const Service = require('./models/Service');

const generateServiceId = require('./utils/generateServiceId');

// Replace with your actual MongoDB connection string
const MONGO_URI = 'mongodb+srv://Anmol:yash2002@cluster0.i3wzsv5.mongodb.net/lokalService?retryWrites=true&w=majority';

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const insertUsers = async () => {
  try {
    const users = [
      {
        _id: uuidv4(),
        email: 'john.doe@example.com',
        name: 'John Doe',
        profilePicture: 'https://example.com/profiles/john.jpg',
        googleId: uuidv4(),
      },
      {
        _id: uuidv4(),
        email: 'jane.smith@example.com',
        name: 'Jane Smith',
        profilePicture: 'https://example.com/profiles/jane.jpg',
        googleId: uuidv4(),
      },
      {
        _id: uuidv4(),
        email: 'michael.brown@example.com',
        name: 'Michael Brown',
        profilePicture: 'https://example.com/profiles/michael.jpg',
        googleId: uuidv4(),
      },
      {
        _id: uuidv4(),
        email: 'sarah.connor@example.com',
        name: 'Sarah Connor',
        profilePicture: 'https://example.com/profiles/sarah.jpg',
        googleId: uuidv4(),
      },
      {
        _id: uuidv4(),
        email: 'david.jones@example.com',
        name: 'David Jones',
        profilePicture: 'https://example.com/profiles/david.jpg',
        googleId: uuidv4(),
      },
      {
        _id: uuidv4(),
        email: 'emily.wilson@example.com',
        name: 'Emily Wilson',
        profilePicture: 'https://example.com/profiles/emily.jpg',
        googleId: uuidv4(),
      },
      {
        _id: uuidv4(),
        email: 'robert.taylor@example.com',
        name: 'Robert Taylor',
        profilePicture: 'https://example.com/profiles/robert.jpg',
        googleId: uuidv4(),
      },
      {
        _id: uuidv4(),
        email: 'linda.martin@example.com',
        name: 'Linda Martin',
        profilePicture: 'https://example.com/profiles/linda.jpg',
        googleId: uuidv4(),
      },
      {
        _id: uuidv4(),
        email: 'kevin.thomas@example.com',
        name: 'Kevin Thomas',
        profilePicture: 'https://example.com/profiles/kevin.jpg',
        googleId: uuidv4(),
      },
      {
        _id: uuidv4(),
        email: 'karen.jackson@example.com',
        name: 'Karen Jackson',
        profilePicture: 'https://example.com/profiles/karen.jpg',
        googleId: uuidv4(),
      },
      // Add more users as needed
    ];

    const createdUsers = await User.insertMany(users);
    console.log(`✅ Inserted ${createdUsers.length} users`);
    return createdUsers;
  } catch (error) {
    console.error('❌ Error inserting users:', error);
    throw error;
  }
};

const insertTags = async () => {
  try {
    const tagNames = [
      'plumbing',
      'electrician',
      'carpentry',
      'cleaning',
      'painting',
      'gardening',
      'roofing',
      'flooring',
      'tiling',
      'handyman',
      'moving',
      'locksmith',
      'hvac',
      'pest control',
      'window installation',
      'deck building',
      'driveway paving',
      'fencing',
      'kitchen remodeling',
      'bathroom remodeling',
      // Add more tags as needed
    ];

    const tagDocs = tagNames.map((name) => ({
      name: name.trim().toLowerCase(),
    }));

    const createdTags = await Tag.insertMany(tagDocs, { ordered: false });
    console.log(`✅ Inserted ${createdTags.length} tags`);
    return createdTags;
  } catch (error) {
    if (error.code === 11000) {
      console.warn('⚠️ Some tags already exist and were skipped.');
      const existingTags = await Tag.find({ name: { $in: tagNames.map(name => name.trim().toLowerCase()) } });
      return existingTags;
    } else {
      console.error('❌ Error inserting tags:', error);
      throw error;
    }
  }
};

// Predefined locations with their coordinates
const predefinedLocations = [
  {
    name: 'New York',
    address: 'New York, NY, USA',
    coordinates: [-74.0060, 40.7128],
  },
  {
    name: 'Los Angeles',
    address: 'Los Angeles, CA, USA',
    coordinates: [-118.2437, 34.0522],
  },
  {
    name: 'Chicago',
    address: 'Chicago, IL, USA',
    coordinates: [-87.6298, 41.8781],
  },
  {
    name: 'Houston',
    address: 'Houston, TX, USA',
    coordinates: [-95.3698, 29.7604],
  },
  {
    name: 'Phoenix',
    address: 'Phoenix, AZ, USA',
    coordinates: [-112.0740, 33.4484],
  },
  {
    name: 'Philadelphia',
    address: 'Philadelphia, PA, USA',
    coordinates: [-75.1652, 39.9526],
  },
  {
    name: 'San Antonio',
    address: 'San Antonio, TX, USA',
    coordinates: [-98.4936, 29.4241],
  },
  {
    name: 'San Diego',
    address: 'San Diego, CA, USA',
    coordinates: [-117.1611, 32.7157],
  },
  {
    name: 'Dallas',
    address: 'Dallas, TX, USA',
    coordinates: [-96.7969, 32.7767],
  },
  {
    name: 'San Jose',
    address: 'San Jose, CA, USA',
    coordinates: [-121.8863, 37.3382],
  },
  {
    name: 'Austin',
    address: 'Austin, TX, USA',
    coordinates: [-97.7431, 30.2672],
  },
  {
    name: 'Jacksonville',
    address: 'Jacksonville, FL, USA',
    coordinates: [-81.6557, 30.3322],
  },
  {
    name: 'Fort Worth',
    address: 'Fort Worth, TX, USA',
    coordinates: [-97.3308, 32.7555],
  },
  {
    name: 'Columbus',
    address: 'Columbus, OH, USA',
    coordinates: [-82.9988, 39.9612],
  },
  {
    name: 'Charlotte',
    address: 'Charlotte, NC, USA',
    coordinates: [-80.8431, 35.2271],
  },
  {
    name: 'San Francisco',
    address: 'San Francisco, CA, USA',
    coordinates: [-122.4194, 37.7749],
  },
  {
    name: 'Indianapolis',
    address: 'Indianapolis, IN, USA',
    coordinates: [-86.1581, 39.7684],
  },
  {
    name: 'Seattle',
    address: 'Seattle, WA, USA',
    coordinates: [-122.3321, 47.6062],
  },
  // Add more locations as needed
];

const services = [
  {
    serviceType: 'Plumber',
    tags: ['plumbing', 'emergency'],
    description: 'Experienced plumber available 24/7 for all your plumbing needs.',
    locationName: 'New York',
    contactNumber: '123-456-7890',
    category: 'Home Repair',
    isVerified: true,
  },
  {
    serviceType: 'Electrician',
    tags: ['electrician', 'hvac'],
    description: 'Certified electrician for residential and commercial projects.',
    locationName: 'Los Angeles',
    contactNumber: '234-567-8901',
    category: 'Home Repair',
    isVerified: false,
  },
  {
    serviceType: 'Carpenter',
    tags: ['carpentry', 'deck building'],
    description: 'Skilled carpenter for custom furniture and cabinetry.',
    locationName: 'Chicago',
    contactNumber: '345-678-9012',
    category: 'Home Improvement',
    isVerified: true,
  },
  {
    serviceType: 'Cleaner',
    tags: ['cleaning'],
    description: 'Professional cleaning services for homes and offices.',
    locationName: 'Houston',
    contactNumber: '456-789-0123',
    category: 'Maintenance',
    isVerified: false,
  },
  {
    serviceType: 'Painter',
    tags: ['painting', 'kitchen remodeling'],
    description: 'Expert painting services for interior and exterior projects.',
    locationName: 'Phoenix',
    contactNumber: '567-890-1234',
    category: 'Home Improvement',
    isVerified: true,
  },
  {
    serviceType: 'Gardener',
    tags: ['gardening', 'fencing'],
    description: 'Professional gardening services to keep your lawn and garden in top shape.',
    locationName: 'Philadelphia',
    contactNumber: '678-901-2345',
    category: 'Outdoor Maintenance',
    isVerified: true,
  },
  {
    serviceType: 'Roofing Specialist',
    tags: ['roofing'],
    description: 'Experienced roofing specialists for repairs and installations.',
    locationName: 'San Antonio',
    contactNumber: '789-012-3456',
    category: 'Home Repair',
    isVerified: false,
  },
  {
    serviceType: 'Flooring Expert',
    tags: ['flooring', 'tiling'],
    description: 'Quality flooring and tiling services for your home or business.',
    locationName: 'San Diego',
    contactNumber: '890-123-4567',
    category: 'Home Improvement',
    isVerified: true,
  },
  {
    serviceType: 'Handyman',
    tags: ['handyman', 'moving'],
    description: 'Versatile handyman services for all your household needs.',
    locationName: 'Dallas',
    contactNumber: '901-234-5678',
    category: 'Maintenance',
    isVerified: false,
  },
  {
    serviceType: 'Locksmith',
    tags: ['locksmith', 'pest control'],
    description: 'Reliable locksmith services for residential and commercial properties.',
    locationName: 'San Jose',
    contactNumber: '012-345-6789',
    category: 'Security',
    isVerified: true,
  },
  {
    serviceType: 'HVAC Technician',
    tags: ['hvac'],
    description: 'Professional HVAC installation and repair services.',
    locationName: 'Austin',
    contactNumber: '123-456-7891',
    category: 'Home Repair',
    isVerified: true,
  },
  {
    serviceType: 'Pest Control Specialist',
    tags: ['pest control'],
    description: 'Effective pest control solutions for homes and businesses.',
    locationName: 'Jacksonville',
    contactNumber: '234-567-8902',
    category: 'Maintenance',
    isVerified: false,
  },
  {
    serviceType: 'Window Installer',
    tags: ['window installation'],
    description: 'Expert window installation and replacement services.',
    locationName: 'Fort Worth',
    contactNumber: '345-678-9013',
    category: 'Home Improvement',
    isVerified: true,
  },
  {
    serviceType: 'Deck Builder',
    tags: ['deck building'],
    description: 'Custom deck building services to enhance your outdoor living space.',
    locationName: 'Columbus',
    contactNumber: '456-789-0124',
    category: 'Outdoor Construction',
    isVerified: false,
  },
  {
    serviceType: 'Driveway Paving',
    tags: ['driveway paving'],
    description: 'Professional driveway paving services for durable and attractive driveways.',
    locationName: 'Charlotte',
    contactNumber: '567-890-1235',
    category: 'Construction',
    isVerified: true,
  },
  {
    serviceType: 'Fencing Contractor',
    tags: ['fencing'],
    description: 'Reliable fencing installation and repair services.',
    locationName: 'San Francisco',
    contactNumber: '678-901-2346',
    category: 'Outdoor Construction',
    isVerified: true,
  },
  {
    serviceType: 'Kitchen Remodeler',
    tags: ['kitchen remodeling'],
    description: 'Complete kitchen remodeling services to transform your kitchen.',
    locationName: 'Indianapolis',
    contactNumber: '789-012-3457',
    category: 'Home Improvement',
    isVerified: false,
  },
  {
    serviceType: 'Bathroom Remodeler',
    tags: ['bathroom remodeling'],
    description: 'Professional bathroom remodeling services for modern and functional spaces.',
    locationName: 'Seattle',
    contactNumber: '890-123-4568',
    category: 'Home Improvement',
    isVerified: true,
  },
  // Add more services as needed
];

const sampleReviews = [
  {
    comment: 'Great service! Fixed my leak quickly.',
    rating: 5,
  },
  {
    comment: 'Professional and efficient.',
    rating: 4,
  },
  {
    comment: 'Good quality work, but a bit slow.',
    rating: 3,
  },
  {
    comment: 'Not satisfied with the service.',
    rating: 2,
  },
  {
    comment: 'Excellent workmanship and friendly staff.',
    rating: 5,
  },
  {
    comment: 'Very reliable and did a fantastic job.',
    rating: 5,
  },
  {
    comment: 'Affordable prices and quality service.',
    rating: 4,
  },
  {
    comment: 'Could have been better organized.',
    rating: 3,
  },
  {
    comment: 'The team was punctual and courteous.',
    rating: 4,
  },
  {
    comment: 'Exceeded my expectations!',
    rating: 5,
  },
  // Add more reviews as needed
];

const insertServices = async (users, tags) => {
  try {
    const createdServices = [];
    for (const serviceData of services) {
      const randomUser = users[Math.floor(Math.random() * users.length)];

      const tagIds = serviceData.tags.map((tagName) => {
        const tag = tags.find((t) => t.name === tagName.toLowerCase());
        return tag ? tag._id : null;
      }).filter(Boolean);

      const serviceId = await generateServiceId(randomUser._id);

      // Find the location details
      const locationDetails = predefinedLocations.find(loc => loc.name === serviceData.locationName);
      if (!locationDetails) {
        console.warn(`Location "${serviceData.locationName}" not found. Skipping service "${serviceData.serviceType}".`);
        continue;
      }

      const service = new Service({
        _id: serviceId,
        userId: randomUser._id,
        serviceType: serviceData.serviceType,
        tags: tagIds,
        description: serviceData.description,
        address: locationDetails.address,
        location: {
          type: 'Point',
          coordinates: locationDetails.coordinates, // [longitude, latitude]
        },
        contactNumber: serviceData.contactNumber,
        category: serviceData.category,
        isVerified: serviceData.isVerified,
        reviews: [],
      });

      const numberOfReviews = Math.floor(Math.random() * 3) + 1; // 1 to 3 reviews
      for (let i = 0; i < numberOfReviews; i++) {
        let reviewer = users[Math.floor(Math.random() * users.length)];
        while (reviewer._id === randomUser._id && users.length > 1) {
          reviewer = users[Math.floor(Math.random() * users.length)];
        }
        const review = sampleReviews[Math.floor(Math.random() * sampleReviews.length)];
        service.reviews.push({
          userId: reviewer._id,
          comment: review.comment,
          rating: review.rating,
        });
      }

      await service.save();
      createdServices.push(service);
    }
    console.log(`✅ Inserted ${createdServices.length} services`);
  } catch (error) {
    console.error('❌ Error inserting services:', error);
    throw error;
  }
};

const main = async () => {
  await connectToMongoDB();
  try {
    const users = await insertUsers();
    const tags = await insertTags();
    await insertServices(users, tags);
    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

main();
