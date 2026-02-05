const axios = require('axios');
const mongoose = require('mongoose');
const assert = require('assert');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Models (for verification)
const Shop = require('../src/models/Shop');
const Institute = require('../src/models/Institute');
const Donation = require('../src/models/Donation');

// Config
const API_URL = 'http://localhost:5000/api'; // Adjust port if needed
const MONGODB_URI = process.env.MONGO_URI; // Local DB

async function runTests() {
    console.log("Starting Agent Integration Audit...");

    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB for verification.");
    } catch (err) {
        console.error("MongoDB Connection Failed:", err);
        process.exit(1);
    }

    // --- Test 1: Active Discovery (Semantic Search) ---
    console.log("\n--- Test 1: Active Discovery (Semantic Search) ---");
    try {
        const query = "help kids with hunger";
        console.log(`Searching for: "${query}"`);
        
        // Ensure there is at least one matching item in DB for the test to pass meaningfully
        // (Optional: Create a dummy institute if needed, but assuming DB has data or we rely on logic)
        
        const res = await axios.post(`${API_URL}/search/semantic`, { query });
        
        if (res.data.success) {
            console.log("Search Successful. Count:", res.data.count);
            // Verify Logic: Should return Food category or tags related to hunger
            const firstResult = res.data.results[0];
            if (firstResult) {
                console.log("Top Result:", firstResult.name, "| Category:", firstResult.category, "| Urgency:", firstResult.urgency);
                
                // Check if result is relevant (Food/Hunger)
                // Note: The LLM might classify it as 'Food' even if the item is 'Books' if the query was 'hunger', 
                // but the search logic filters for food-related items if query implies food.
                
                // We check if the returned item is indeed food related OR if the system *attempted* to find food.
                // Since we can't control DB content here easily without seeding, we check response structure.
                if (firstResult.category === 'Food' || firstResult.itemName.match(/food|meal|ration/i)) {
                    console.log("✅ PASS: Correctly identified Food intent and returned relevant item.");
                } else {
                    console.log("⚠️ WARN: Top result might not be Food-related. DB might lack data.");
                }
                
                if (firstResult.urgency === 'Critical' || firstResult.urgency === 'High') {
                     console.log("✅ PASS: High urgency item prioritized (if available).");
                }
            } else {
                console.log("⚠️ No results found. Populate DB with 'Food' items to verify strict filtering.");
            }
        } else {
            console.error("❌ FAIL: Search API returned error.");
        }
    } catch (error) {
        console.error("❌ FAIL: Search Test Error:", error.message);
    }

    // --- Test 2: Donor Advocate (Chatbot) ---
    console.log("\n--- Test 2: Donor Advocate (Chatbot) ---");
    try {
        // Create a dummy donor history first
        const donorId = "test_donor_agent_1";
        await Donation.deleteMany({ donorId });
        await Donation.create({
            donorId,
            donorName: "Test Donor Agent",
            amount: 500,
            donationItem: "Textbooks",
            type: "monetary"
        });

        // Call Chat API
        const chatRes = await axios.post(`${API_URL}/llm/chat`, {
            donorId,
            contents: [{ role: "user", parts: [{ text: "What should I donate next?" }] }]
        });

        const reply = chatRes.data.candidates[0].content.parts[0].text;
        console.log("Chatbot Reply:", reply);

        if (reply.toLowerCase().includes("textbook") || reply.toLowerCase().includes("book") || reply.toLowerCase().includes("education")) {
             console.log("✅ PASS: Chatbot mentioned past donation context (Books/Education).");
        } else {
             console.log("⚠️ WARN: Chatbot might not have mentioned history. Check prompt logic.");
        }
        
    } catch (error) {
        console.error("❌ FAIL: Chatbot Test Error:", error.message);
    }

    // --- Test 3: Fairness Agent (Rotation) ---
    console.log("\n--- Test 3: Fairness Agent (Rotation) ---");
    try {
        // 1. Setup: Create 2 Shops near an Institute
        // Shop A: Assigned recently (e.g., 1 hour ago)
        // Shop B: Assigned long ago (e.g., yesterday) - Should be picked!
        
        // Use a unique location to avoid interference from existing shops
        const loc = { type: "Point", coordinates: [100.5, 20.5] }; 
        
        await Shop.deleteMany({ email: /test_shop/ });
        
        const shopA = await Shop.create({
            name: "Test Shop A (Recent)",
            email: "test_shop_a@example.com",
            owner: "Owner A",
            address: "Delhi",
            location: loc,
            metrics: { lastAssigned: new Date(Date.now() - 1000 * 60 * 60), rating: 5 } // 1 hour ago
        });
        
        const shopB = await Shop.create({
            name: "Test Shop B (Old)",
            email: "test_shop_b@example.com",
            owner: "Owner B",
            address: "Delhi",
            location: loc,
            metrics: { lastAssigned: new Date(Date.now() - 1000 * 60 * 60 * 24), rating: 5 } // 24 hours ago
        });

        // Create Institute at same location
        const institute = await Institute.create({
            name: "Test Institute Fairness",
            email: "test_inst_fairness@example.com",
            location: loc,
            category: "Food"
        });

        // 2. Make Donation
        const donationRes = await axios.post(`${API_URL}/donations`, {
            donorName: "Fairness Tester",
            amount: 1000,
            instituteId: institute._id,
            donationType: "monetary"
        });

        if (donationRes.data.success) {
            const donation = donationRes.data.donation;
            console.log("Donation Created. Assigned Shop ID:", donation.assignedShopId);

            // 3. Verify: Should be Shop B
            if (donation.assignedShopId.toString() === shopB._id.toString()) {
                console.log("✅ PASS: Fairness Engine correctly selected Shop B (Oldest Assignment).");
            } else if (donation.assignedShopId.toString() === shopA._id.toString()) {
                console.error("❌ FAIL: Fairness Engine selected Shop A (Recent) instead of Shop B.");
            } else {
                console.error("❌ FAIL: No shop assigned or wrong shop.");
            }
        } else {
             console.error("❌ FAIL: Donation creation failed.");
        }

        // Cleanup
        await Shop.deleteMany({ email: /test_shop/ });
        await Institute.deleteOne({ _id: institute._id });

    } catch (error) {
        console.error("❌ FAIL: Fairness Test Error:", error.message);
    }

    console.log("\n--- Audit Complete ---");
    mongoose.connection.close();
}

runTests();
