import Account from "../models/Account.js";

export const createAccount = async (req, res) => {
  const { accountNumber, sortCode } = req.body;

  const accountExists = await Account.findOne({ accountNumber });

  if (accountExists) {
    res.status(400).json({ message: "Account already exists." });
    return;
  }

  const account = await Account.create({
    business: req.business._id,
    accountNumber,
    sortCode,
  });

  if (account) {
    res.status(201).json(account);
  } else {
    res.status(400).json({ message: "Invalid account data." });
  }
};

export const getAccounts = async (req, res) => {
  const accounts = await Account.find({ business: req.business._id });
  res.json(accounts);
};
