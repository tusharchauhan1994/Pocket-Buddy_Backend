const Subscription = require("../models/SubscriptionModel");

const saveSubscription = async (req, res) => {
  try {
    const { userId, planId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const subscription = new SubscriptionModel({
      userId, // now a valid ObjectId
      planId,
      paymentId: razorpayPaymentId,
      orderId: razorpayOrderId,
      signature: razorpaySignature,
      status: "active",
      startDate: new Date(),
    });

    await subscription.save();
    res.status(201).json({ message: "Subscription saved successfully", subscription });
  } catch (error) {
    console.error("Failed to save subscription:", error);
    res.status(500).json({ message: "Failed to save subscription", error });
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
