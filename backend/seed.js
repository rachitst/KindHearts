const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./src/models/User");
const Institute = require("./src/models/Institute");
const Shop = require("./src/models/Shop");
const Donation = require("./src/models/Donation");
const Order = require("./src/models/Order");
const Campaign = require("./src/models/Campaign");
const ImpactStory = require("./src/models/ImpactStory");
const connectDB = require("./src/config/db");

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Institute.deleteMany({});
    await Shop.deleteMany({});
    await Donation.deleteMany({});
    await Order.deleteMany({});
    await Campaign.deleteMany({});
    await ImpactStory.deleteMany({});

    console.log("Seeding Users...");
    const users = await User.insertMany([
      {
        name: "St. Mary School Admin",
        email: "admin@stmary.edu",
        password: "password123", // In a real app, hash this!
        role: "institute",
      },
      {
        name: "John Donor",
        email: "john@example.com",
        password: "password123",
        role: "donor",
      },
      {
        name: "City Supplies Shop Owner",
        email: "citysupplies@example.com",
        password: "password123",
        role: "shopkeeper",
      },
      {
        name: "Hope Foundation Rep",
        email: "contact@hopefoundation.org",
        password: "password123",
        role: "institute",
      },
      {
        name: "Sarah Smith",
        email: "sarah@example.com",
        password: "password123",
        role: "donor",
      },
      {
        name: "School Supplies Store Owner",
        email: "schoolsupplies@example.com",
        password: "password123",
        role: "shopkeeper",
      },
      {
        name: "System Admin",
        email: "admin@kindhearts.com",
        password: "adminpassword",
        role: "admin",
      },
    ]);
    
    // Helper to find user ID by email
    const getUserId = (email) => users.find(u => u.email === email)._id;

    console.log("Seeding Shops with GeoJSON and Metrics...");
    const shops = await Shop.insertMany([
      {
        name: "City Supplies Shop",
        address: "123 Main St, City",
        location: {
          type: "Point",
          coordinates: [77.2090, 28.6139], // Example: New Delhi
        },
        owner: "City Supplies Shop Owner",
        email: "citysupplies@example.com",
        metrics: {
            rating: 4.8,
            ordersCompleted: 150,
            lastAssigned: new Date(Date.now() - 86400000) // 1 day ago
        }
      },
      {
        name: "School Supplies Store",
        address: "456 Education Ave, Town",
        location: {
            type: "Point",
            coordinates: [77.2150, 28.6200], // Nearby
        },
        owner: "School Supplies Store Owner",
        email: "schoolsupplies@example.com",
        metrics: {
            rating: 4.5,
            ordersCompleted: 80,
            lastAssigned: new Date(Date.now() - 172800000) // 2 days ago
        }
      },
    ]);

    console.log("Seeding Institute Requests with Tags and Amounts...");
    const institutes = await Institute.insertMany([
      {
        email: "institute@kindhearts.com",
        itemName: 'Science Textbooks',
        category: 'Books',
        quantity: 50,
        amountNeeded: 5000,
        amountRaised: 1000,
        tags: ["education", "books", "science", "school"],
        urgency: 'High',
        status: 'Pending',
        specifications: 'Class 10 NCERT Science Textbooks',
        requesterName: 'Institute Admin',
        contactNumber: '1234567890',
        description: "Urgently need science books for class 10 students.",
        instituteType: "Public",
        address: "St. Mary School, City",
        institutionId: "STMARY001"
      },
      {
        email: "contact@hopefoundation.org",
        itemName: 'Rice Bags',
        category: 'Food',
        quantity: 100,
        amountNeeded: 10000,
        amountRaised: 0,
        tags: ["food", "essentials", "grains", "hunger"],
        urgency: 'Critical',
        status: 'Pending',
        specifications: '25kg Rice Bags',
        requesterName: 'Hope Foundation Rep',
        contactNumber: '9876543210',
        description: "Food supplies for orphanage.",
        instituteType: "NGO",
        address: "Hope Foundation, Town",
        institutionId: "HOPE001"
      }
    ]);

    console.log("Seeding Donations with Donor IDs...");
    await Donation.insertMany([
        {
            donorName: "John Donor",
            donorId: getUserId("john@example.com"),
            amount: 1000,
            donationItem: "Science Textbooks",
            message: "Happy to help!",
            type: "donation",
            status: "completed"
        },
        {
            donorName: "Sarah Smith",
            donorId: getUserId("sarah@example.com"),
            amount: 5000,
            donationItem: "Rice Bags",
            message: "God bless.",
            type: "donation",
            status: "completed"
        }
    ]);

    console.log("Seeding completed!");
    process.exit();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
