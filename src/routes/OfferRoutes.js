const express = require("express");
const router = express.Router();
const offerController = require("../controllers/OfferController");

router.post("/add", offerController.addOffer); // Add Offer
router.get("/", offerController.getAllOffers); // Get All Offers
router.get("/:id", offerController.getOfferById); // Get Offer by ID

router.get("/by-restaurant/:restaurantId", offerController.getOffersByRestaurant); // Get Offers by Restaurant

router.post("/redeem", offerController.redeemOffer); // Redeem Offer Request
router.post("/redeem/update-status", offerController.updateRedeemStatus); // Approve/Reject Offer
router.get("/redeem/user/:user_id", offerController.getUserRedeems); // Get User Redeemed Offers
router.post("/redeem/use", offerController.useOffer); // Use Offer
router.delete("/delete/:id", offerController.deleteOffer);
router.put("/update/:id", offerController.updateOffer);

module.exports = router;
