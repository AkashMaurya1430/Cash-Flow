const mongoose = require("mongoose");

const TransactionSchema = mongoose.Schema(
  {
    vendorName: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    UPITransactionID:{
      type: Number,
      required: true,
    },
    flow: {
      type: String,
      enum: ["in", "out"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
