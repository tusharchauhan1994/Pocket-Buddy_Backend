const express = require("express");
const router = express.Router();
const { saveSubscription, getAllSubscribers } = require("../controllers/SubscriptionController");

router.post("/save", saveSubscription);
router.get("/all", getAllSubscribers);

module.exports = router;