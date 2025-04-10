const express = require("express");
const router = express.Router();
const { saveSubscription, getAllSubscribers, getSubscriptionByUser, getUserSubscription } = require("../controllers/SubscriptionController");

router.post("/save", saveSubscription);
router.get("/all", getAllSubscribers);
router.get('/user/:userId', getSubscriptionByUser);


module.exports = router;