const Feedback = require("../models/Feedback");

const createFeedback = async (req, res) => {
  try {
    const { name, email, role, rating, message } = req.body;

    if (!name || !email || !role || !rating || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const feedback = new Feedback({
      name,
      email,
      role,
      rating,
      message,
    });

    await feedback.save();

    res.status(201).json({ success: true, message: "Feedback submitted successfully", feedback });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, feedbacks });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { createFeedback, getAllFeedback };
