const mongoose = require("mongoose");

const RedeemOfferSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    offer_id: { type: mongoose.Schema.Types.ObjectId, ref: "Offer", required: true },
    restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    status: { 
        type: String, 
        enum: ["Pending", "Approved", "Rejected", "Payment Pending", "Purchased", "Used"], 
        default: "Pending" 
    },
    requested_at: { type: Date, default: Date.now },
    payment_status: { 
        type: String, 
        enum: ["Not Required", "Pending", "Completed"], 
        default: "Not Required" 
    } // New Field for Future Payment Integration
});

module.exports = mongoose.model("RedeemOffer", RedeemOfferSchema);
