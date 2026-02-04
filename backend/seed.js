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

    console.log("Seeding Shops...");
    const shops = await Shop.insertMany([
      {
        name: "City Supplies Shop",
        location: "123 Main St, City",
        owner: "City Supplies Shop Owner",
      },
      {
        name: "School Supplies Store",
        location: "456 Education Ave, Town",
        owner: "School Supplies Store Owner",
      },
    ]);

    console.log("Seeding Institute Requests...");
    // Mapping from mockRequests and mockDonationRequests
    const institutes = await Institute.insertMany([
      // Data from institute_dashboard/data/mockData.ts
      {
        email: "institute@kindhearts.com",
        itemName: 'Science Textbooks',
        category: 'Books',
        quantity: 50,
        urgency: 'High',
        status: 'Completed',
        specifications: 'Class 10 NCERT Science Textbooks',
        requesterName: 'Institute Admin',
        contactNumber: '1234567890',
        deliveryAddress: '123 Institute Way',
        expectedDeliveryDate: new Date('2024-02-20'),
        createdAt: new Date('2024-02-15'),
        image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      {
        email: "institute@kindhearts.com",
        itemName: 'Sports Equipment',
        category: 'Sports',
        quantity: 20,
        urgency: 'Medium',
        status: 'Processing',
        specifications: 'Basketball and Volleyball sets',
        requesterName: 'Institute Admin',
        contactNumber: '1234567890',
        deliveryAddress: '123 Institute Way',
        createdAt: new Date(),
        image: 'https://images.unsplash.com/photo-1531263060782-b024de9b9793?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      {
        email: "institute@kindhearts.com",
        itemName: 'Medical Supplies Kit',
        category: 'Medical Supplies',
        quantity: 30,
        urgency: 'Critical',
        status: 'Processing',
        specifications: 'First aid supplies and basic medical equipment',
        requesterName: 'Institute Admin',
        contactNumber: '1234567890',
        deliveryAddress: '123 Institute Way',
        createdAt: new Date('2024-02-20'),
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      {
        email: "institute@kindhearts.com",
        itemName: 'Food Packages',
        category: 'Food',
        quantity: 100,
        urgency: 'High',
        status: 'Pending',
        specifications: 'Rice, Wheat, and Pulses',
        requesterName: 'Institute Admin',
        contactNumber: '1234567890',
        deliveryAddress: '123 Institute Way',
        createdAt: new Date(),
        image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      // Existing seeds
      {
        name: "St. Mary School",
        email: "admin@stmary.edu",
        category: "Education Material",
        itemName: "Notebooks",
        quantity: 100,
        urgency: "Medium",
        description: "Need notebooks for Grade 5 students.",
        specifications: "Single line, 200 pages",
        requesterName: "Principal Skinner",
        contactNumber: "1234567890",
        city: "Springfield",
        state: "IL",
      },
      {
        name: "St. Mary School",
        email: "admin@stmary.edu",
        category: "Education Material",
        itemName: "Pencils",
        quantity: 200,
        urgency: "Low",
        description: "HB Pencils for exams.",
      },
      {
        name: "Hope Foundation",
        email: "contact@hopefoundation.org",
        category: "Sports",
        itemName: "Art Supplies",
        quantity: 30,
        urgency: "High",
        description: "Art kits for summer camp.",
      },
      {
        name: "Children First NGO",
        email: "info@childrenfirst.org",
        category: "Medical Supplies",
        itemName: "First Aid Kits",
        quantity: 10,
        urgency: "Critical",
        description: "Basic first aid kits for field workers.",
      },
      // New Institutes from BrowseDonate.tsx
      {
        name: "City Children's Hospital",
        email: "contact@citychildrenshospital.org",
        category: "healthcare",
        description: "Supporting pediatric care and medical research for children.",
        image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        itemName: "Medical Supplies",
        quantity: 150,
        type: "monetary",
        urgency: "High",
      },
      {
        name: "City Children's Hospital",
        email: "contact@citychildrenshospital.org",
        category: "healthcare",
        description: "Supporting pediatric care and medical research for children.",
        image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        itemName: "Children's Books",
        quantity: 75,
        type: "resource",
        urgency: "Low",
      },
      {
        name: "City Children's Hospital",
        email: "contact@citychildrenshospital.org",
        category: "healthcare",
        description: "Supporting pediatric care and medical research for children.",
        image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        itemName: "Toys for Patients",
        quantity: 100,
        urgency: "Medium",
      },
      {
        name: "Local Food Bank",
        email: "contact@localfoodbank.org",
        category: "community",
        description: "Providing meals and groceries to families in need throughout the community.",
        image: "https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        itemName: "Canned Goods",
        quantity: 50,
        urgency: "Medium",
      },
      {
        name: "Local Food Bank",
        email: "contact@localfoodbank.org",
        category: "community",
        description: "Providing meals and groceries to families in need throughout the community.",
        image: "https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        itemName: "Fresh Produce Fund",
        quantity: 200,
        urgency: "High",
      },
      {
        name: "Local Food Bank",
        email: "contact@localfoodbank.org",
        category: "community",
        description: "Providing meals and groceries to families in need throughout the community.",
        image: "https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        itemName: "Volunteer Equipment",
        quantity: 120,
        type: "monetary",
        urgency: "Low",
      },
      {
        name: "Greenville Animal Shelter",
        email: "contact@greenvilleanimalshelter.org",
        category: "animals",
        description: "Rescuing and rehoming abandoned pets and providing veterinary care.",
        image: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        itemName: "Pet Food",
        quantity: 85,
        type: "resource",
        urgency: "Medium",
      },
      {
        name: "Greenville Animal Shelter",
        email: "contact@greenvilleanimalshelter.org",
        category: "animals",
        description: "Rescuing and rehoming abandoned pets and providing veterinary care.",
        image: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        itemName: "Medical Care Fund",
        quantity: 250,
        type: "monetary",
        urgency: "High",
      },
      {
        name: "Greenville Animal Shelter",
        email: "contact@greenvilleanimalshelter.org",
        category: "animals",
        description: "Rescuing and rehoming abandoned pets and providing veterinary care.",
        image: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        itemName: "Shelter Supplies",
        quantity: 120,
        type: "resource",
        urgency: "Low",
      },
      {
        name: "Westside Elementary School",
        email: "contact@westsideelementary.edu",
        category: "education",
        description: "Supporting educational programs and resources for underprivileged students.",
        image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        itemName: "School Supplies",
        quantity: 60,
        type: "resource",
        urgency: "Medium",
      },
      {
        name: "Westside Elementary School",
        email: "contact@westsideelementary.edu",
        category: "education",
        description: "Supporting educational programs and resources for underprivileged students.",
        image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        itemName: "Library Books",
        quantity: 150,
        type: "monetary",
        urgency: "Low",
      },
      {
        name: "Westside Elementary School",
        email: "contact@westsideelementary.edu",
        category: "education",
        description: "Supporting educational programs and resources for underprivileged students.",
        image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        itemName: "Technology Fund",
        quantity: 300,
        type: "monetary",
        urgency: "High",
      },
      {
        name: "Forest Conservation Trust",
        email: "contact@foresttrust.org",
        category: "environment",
        description: "Protecting local forests and promoting sustainable environmental practices.",
        image: "https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        itemName: "Tree Planting",
        quantity: 100,
        type: "monetary",
        urgency: "Medium",
      },
      {
        name: "Forest Conservation Trust",
        email: "contact@foresttrust.org",
        category: "environment",
        description: "Protecting local forests and promoting sustainable environmental practices.",
        image: "https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        itemName: "Conservation Equipment",
        quantity: 175,
        type: "resource",
        urgency: "Low",
      },
      {
        name: "Forest Conservation Trust",
        email: "contact@foresttrust.org",
        category: "environment",
        description: "Protecting local forests and promoting sustainable environmental practices.",
        image: "https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        itemName: "Educational Materials",
        quantity: 80,
        type: "monetary",
        urgency: "Low",
      },
    ]);

    console.log("Seeding Campaigns...");
    const campaigns = await Campaign.insertMany([
      {
        title: "Back to School Drive",
        description: "Help students get ready for the new school year.",
        goal: "₹50,000",
        current: "₹12,450",
        progress: 25,
        donors: 48,
        daysLeft: 12,
        category: "Education",
        image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        title: "Healthcare for All",
        description: "Providing healthcare access to underserved communities.",
        goal: "₹100,000",
        current: "₹45,000",
        progress: 45,
        donors: 122,
        daysLeft: 20,
        category: "Healthcare",
        image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      }
    ]);

    console.log("Seeding Impact Stories...");
    const stories = await ImpactStory.insertMany([
      {
        title: "Medical Supplies",
        description: "Your donations helped provide essential medical supplies to 3 local hospitals.",
        image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        category: "healthcare"
      },
      {
        title: "Education Support",
        description: "Funded 12 scholarships for underprivileged students in the community.",
        image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        category: "education"
      },
      {
        title: "Disaster Relief",
        description: "Provided emergency supplies to 45 families affected by recent floods.",
        image: "https://images.unsplash.com/photo-1469571486292-b53601010b89?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        category: "emergency"
      }
    ]);

    console.log("Seeding Donations (Transactions)...");
    const donations = await Donation.insertMany([
      {
        donorName: "John Doe",
        amount: 1000,
        donationItem: "General Donation",
        message: "Keep up the good work!",
        type: "donation",
        status: "completed",
        createdAt: new Date('2025-02-27')
      },
      {
        donorName: "Jane Smith",
        amount: 500,
        type: "withdrawal",
        status: "pending",
        createdAt: new Date('2025-02-26')
      },
      {
        donorName: "Alice Johnson",
        amount: 2500,
        donationItem: "Education Fund",
        type: "donation",
        status: "completed",
        createdAt: new Date('2025-02-25')
      },
      {
        donorName: "Bob Wilson",
        amount: 750,
        type: "withdrawal",
        status: "failed",
        createdAt: new Date('2025-02-24')
      },
      {
        donorName: "Emma Davis",
        amount: 3000,
        donationItem: "Health Camp",
        type: "donation",
        status: "completed",
        createdAt: new Date('2025-02-23')
      },
      {
        donorName: "Michael Brown",
        amount: 1500,
        donationItem: "Sports Kit",
        type: "donation",
        status: "pending",
        createdAt: new Date('2025-02-22')
      },
      {
        donorName: "Sarah Miller",
        amount: 1000,
        type: "withdrawal",
        status: "completed",
        createdAt: new Date('2025-02-21')
      },
      {
        donorName: "David Clark",
        amount: 5000,
        donationItem: "Library Books",
        type: "donation",
        status: "completed",
        createdAt: new Date('2025-02-20')
      }
    ]);

    console.log("Seeding Orders...");
    const orders = await Order.insertMany([
      {
        shop: shops[0]._id,
        items: [
          { name: "Mathematics Textbooks", quantity: 50, price: 25 },
          { name: "Science Lab Manuals", quantity: 50, price: 15 }
        ],
        totalAmount: 2000,
        deliveryAddress: "123 School St, Education District",
        contactPerson: "John Doe",
        contactNumber: "555-0123",
        paymentStatus: "pending",
        status: "pending"
      },
      {
        shop: shops[0]._id,
        items: [
          { name: "Sports Equipment Set", quantity: 5, price: 500 },
          { name: "Art Supplies Bundle", quantity: 50, price: 30 }
        ],
        totalAmount: 4000,
        deliveryAddress: "456 Public Ave, Downtown",
        contactPerson: "Jane Smith",
        contactNumber: "555-0456",
        paymentStatus: "pending",
        status: "accepted"
      },
      {
        shop: shops[1]._id,
        items: [
          { name: "Computer Parts", quantity: 15, price: 300 },
          { name: "Programming Books", quantity: 40, price: 45 }
        ],
        totalAmount: 6300,
        deliveryAddress: "303 Tech Park",
        contactPerson: "Lisa Chen",
        contactNumber: "555-3333",
        paymentStatus: "pending",
        status: "packaging"
      },
      {
        shop: shops[1]._id,
        items: [
          { name: "Children's Books", quantity: 200, price: 8 },
          { name: "Educational Toys", quantity: 30, price: 20 }
        ],
        totalAmount: 2200,
        deliveryAddress: "202 Sunshine Blvd",
        contactPerson: "Mark Brown",
        contactNumber: "555-2222",
        paymentStatus: "pending",
        status: "ready"
      },
      {
        shop: shops[0]._id,
        items: [
          { name: "School Stationery Kit", quantity: 100, price: 10 }
        ],
        totalAmount: 1000,
        deliveryAddress: "123 School St, Education District",
        contactPerson: "John Doe",
        contactNumber: "555-0123",
        paymentStatus: "completed",
        status: "completed"
      }
    ]);

    console.log("Data Seeding Completed Successfully!");
    process.exit();
  } catch (error) {
    console.error("Error with seeding data:", error);
    process.exit(1);
  }
};

seedData();
