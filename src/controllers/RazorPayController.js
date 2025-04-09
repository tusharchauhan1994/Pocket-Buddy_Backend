const Razorpay = require("razorpay");
const crypto = require("crypto");

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Plan pricing map
const subscriptionPlans = {
  "Monthly Pass": { amount: 200, duration: "1 month" },
  "Half-Year": { amount: 1000, duration: "6 months" },
  "Yearly Saver": { amount: 1500, duration: "12 months" },
};

// Create order API
const create_order = async (req, res) => {
  const { planName } = req.body;

  if (!subscriptionPlans[planName]) {
    return res.status(400).json({ message: "Invalid plan selected" });
  }

  const { amount } = subscriptionPlans[planName];

  const options = {
    amount: amount * 100, // in paise
    currency: "INR",
    receipt: `receipt_${Math.random().toString(36).substring(2, 10)}`,
    notes: {
      planName,
    },
  };

  try {
    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error("Order creation failed:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Verify order API
const verify_order = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generated_signature === razorpay_signature) {
    res.status(200).json({ status: "success" });
  } else {
    res.status(400).json({ status: "failure", message: "Signature mismatch" });
  }
};

console.log("🔑 Razorpay ENV:", process.env.RAZORPAY_KEY_ID, process.env.RAZORPAY_KEY_SECRET);


module.exports = {
  create_order,
  verify_order,
};
