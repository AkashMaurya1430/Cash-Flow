var express = require("express");
var router = express.Router();
const mainController = require("../controller/index");

/* GET home page. */
router.get("/", mainController.dashboard);

router.get("/transactions", mainController.getTransactions);

router.post("/register", mainController.register);

router.post("/cash-in", mainController.cashIn);

router.post("/cash-out", mainController.cashOut);

router.post("/set-alert-value", mainController.setAlertValue);

router.post('/delete-transaction',mainController.deleteTransaction)

module.exports = router;
