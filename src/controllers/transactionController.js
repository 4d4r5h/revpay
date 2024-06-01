import Transaction from "../models/Transaction.js";
import Account from "../models/Account.js";

export const createTransaction = async (req, res) => {
  const { accountNumber, type, amount } = req.body;

  const account = await Account.findOne({ accountNumber });

  if (!account) {
    res.status(404).json({ message: "Account not found." });
    return;
  }

  if (account.status === "INACTIVE") {
    res.status(403).json({ message: "Account is inactive." });
    return;
  }

  if (type === "DEBIT" && !account.allowDebit) {
    res.status(403).json({ message: "Debit transactions not allowed." });
    return;
  }

  if (type === "CREDIT" && !account.allowCredit) {
    res.status(403).json({ message: "Credit transactions not allowed." });
    return;
  }

  if (type === "DEBIT" && amount > account.dailyWithdrawalLimit) {
    res.status(403).json({ message: "Withdrawal amount exceeds daily limit." });
    return;
  }

  const transaction = await Transaction.create({
    account: account._id,
    type,
    amount,
  });

  account.balance += type === "CREDIT" ? amount : -amount;
  await account.save();

  res.status(201).json(transaction);
};

export const getBalance = async (req, res) => {
  const { accountNumber } = req.params;

  const account = await Account.findOne({ accountNumber });

  if (!account) {
    res.status(404).json({ message: "Account not found." });
    return;
  }

  res.json({ balance: account.balance });
};
