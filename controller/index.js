const User = require("../models/User");
const Transaction = require("../models/Transaction");
const sendMail = require("../config/mailHelper");

module.exports.register = async (req, res) => {
  const { name, initialValue } = req.body;
  const user = new User({
    name,
    initialValue,
  });

  await user
    .save()
    .then((result) => {
      console.log(result);
      res.status(200).send("User Saved Successfully");
    })
    .catch((e) => {
      res.status(500).send(e);
    });
};

module.exports.dashboard = async (req, res) => {
  let { startDate, endDate } = req.query;
  let formStartDate = startDate;
  let formEndDate = endDate;
  if (startDate == "" || startDate == null) startDate = new Date("1972-01-01");
  if (endDate == "" || endDate == null) endDate = new Date("2099-01-01");
  startDate = new Date(startDate);
  endDate = new Date(endDate);
  console.log(startDate, endDate);
  const userData = await User.findById({ _id: "61e2602f27ae5e5a49a14d05" }).populate({
    path: "transactions",
    options: { sort: "date" },
  });

  // console.log(userData);

  userData.transactions = userData.transactions.filter((transaction) => {
    if (transaction.date >= startDate && transaction.date <= endDate) {
      return transaction;
    }
  });

  // Calcualte Total Balance
  let balance = userData.initialValue;
  let totalCashIn = 0;
  let totalCashOut = 0;
  let categories = [];
  let balanceWarningObj = {
    status: 0,
    message: "",
  };
  userData.transactions.forEach((transaction) => {
    if (transaction.flow === "in") {
      balance += transaction.amount;
      totalCashIn += transaction.amount;
    } else {
      totalCashOut += transaction.amount;
      balance -= transaction.amount;
    }
    if (!categories.includes(transaction.type)) categories.push(transaction.type);
  });

  if (balance < userData.alertAmount) {
    mailObj = {
      from: process.env.ID,
      to: "akashmaurya1430@gmail.com",
      subject: "Cash Flow",
      html: "<h3>Your Min Balance has been crossed</h3>",
    };
    sendMail(mailObj);
    balanceWarningObj.status = 1;
    balanceWarningObj.message = "Min Balance Crossed";
  } else if (balance - 1000 < userData.alertAmount) {
    balanceWarningObj.status = 2;
    balanceWarningObj.message = "Min Balance About to be Crossed";
  }
  // console.log(balanceWarningObj);
  if (startDate == "1972-01-01") formStartDate = "";
  if (endDate == "2099-01-01") formEndDate = "";
  res.render("index", {
    userData,
    balance,
    totalCashIn,
    totalCashOut,
    categories,
    balanceWarningObj,
    startDate: formStartDate,
    endDate: formEndDate,
  });
};

module.exports.getTransactions = async (req, res) => {
  const userData = await User.findById({ _id: "61e2602f27ae5e5a49a14d05" }).populate({
    path: "transactions",
    options: { sort: "date" },
  });

  res.send(userData);
};

module.exports.cashIn = async (req, res) => {
  const { name, type, date, amount, UPIID } = req.body;
  const newTransaction = Transaction({
    vendorName: name,
    type,
    date,
    amount,
    UPITransactionID: UPIID,
    flow: "in",
  });

  await newTransaction
    .save()
    .then(async (result) => {
      console.log(result);
      await User.findByIdAndUpdate({ _id: "61e2602f27ae5e5a49a14d05" }, { $push: { transactions: result._id } });
      //   res.status(200).send("Transaction Saved Successfully");
      res.redirect("/");
    })
    .catch((e) => {
      res.status(500).send(e);
    });
};

module.exports.cashOut = async (req, res) => {
  const { name, type, date, amount, UPIID } = req.body;

  const newTransaction = Transaction({
    vendorName: name,
    type,
    date,
    UPITransactionID: UPIID,
    amount,
    flow: "out",
  });

  await newTransaction
    .save()
    .then(async (result) => {
      console.log(result);
      await User.findByIdAndUpdate({ _id: "61e2602f27ae5e5a49a14d05" }, { $push: { transactions: result._id } });
      //   res.status(200).send("Transaction Saved Successfully");
      res.redirect("/");
    })
    .catch((e) => {
      res.status(500).send(e);
    });
};

module.exports.setAlertValue = async (req, res) => {
  const { alertAmount } = req.body;
  await User.findByIdAndUpdate({ _id: "61e2602f27ae5e5a49a14d05" }, { $set: { alertAmount } })
    .then((result) => {
      console.log(result);
      res.redirect("/");
    })
    .catch((e) => {
      console.log(e);
      res.redirect("/");
    });
};

module.exports.deleteTransaction = async (req, res) => {
  console.log(req.body);
  await Transaction.findByIdAndDelete({ _id: req.body.id })
    .then(async (result) => {
      if (result) {
        console.log("Deleted Successfully");
        await User.findByIdAndUpdate({ _id: "61e2602f27ae5e5a49a14d05" }, { $pull: { transactions: result._id } });
        res.redirect("/");
      } else {
        console.log("Not Found");
        res.redirect("/");
      }
    })
    .catch((e) => {
      console.log(e);
      res.redirect("/");
    });
};
