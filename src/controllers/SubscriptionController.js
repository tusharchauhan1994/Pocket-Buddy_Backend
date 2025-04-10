const mongoose = require("mongoose");
const Subscription = require("../models/SubscriptionModel");

const saveSubscription = async (req, res) => {
  try {
    const { 
      userId, 
      planName, 
      price, 
      duration, 
      razorpay_order_id, 
      razorpay_payment_id 
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const subscription = new Subscription({
      userId,
      planName,
      amount: price,
      duration,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      status: "active",
      startDate: new Date(),
    });

    await subscription.save();
    res.status(201).json({ 
      message: "Subscription saved successfully", 
      subscription 
    });
  } catch (error) {
    console.error("Failed to save subscription:", error);
    res.status(500).json({ 
      message: "Failed to save subscription", 
      error: error.message 
    });
  }
};


const getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscription.find().populate("userId", "name email");
    res.status(200).json(subscribers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch subscribers" });
  }
};

module.exports = {
  saveSubscription,
  getAllSubscribers,
};
