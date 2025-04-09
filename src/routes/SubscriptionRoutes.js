const router = require("express").Router();
const controller = require("../controllers/SubscriptionController");

router.post("/save", controller.saveSubscription);
router.get("/all", controller.getAllSubscribers); // For admin

module.exports = router;
