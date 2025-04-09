const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  planName: String,
  amount: Number,
  paymentId: String,
  orderId: String,
  startDate: { type: Date, default: Date.now },
  endDate: Date,
  status: { type: String, default: "active" }, // active, expired, etc.
});

module.exports = mongoose.model("Subscription", subscriptionSchema);
