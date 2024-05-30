import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
      unique: true,
      maxlength: 10,
    },
    sortCode: {
      type: String,
      required: true,
      maxlength: 8,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
    allowCredit: {
      type: Boolean,
      default: true,
    },
    allowDebit: {
      type: Boolean,
      default: true,
    },
    dailyWithdrawalLimit: {
      type: Number,
      default: 1000, // example default limit
    },
    balance: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Account = mongoose.model("Account", accountSchema);

export default Account;
