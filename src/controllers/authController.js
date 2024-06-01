import Business from "../models/Business.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30m",
  });
};

export const registerBusiness = async (req, res) => {
  const { username, password } = req.body;
  const businessExists = await Business.findOne({ username });

  if (businessExists) {
    res.status(400).json({ message: "Business already exists." });
    return;
  }

  const business = await Business.create({ username, password });

  if (business) {
    res.status(201).json({
      _id: business._id,
      username: business.username,
      token: generateToken(business._id),
    });
  } else {
    res.status(400).json({ message: "Invalid business data." });
  }
};

export const loginBusiness = async (req, res) => {
  const { username, password } = req.body;
  const business = await Business.findOne({ username });

  if (business && (await business.matchPassword(password))) {
    res.json({
      _id: business._id,
      username: business.username,
      token: generateToken(business._id),
    });
  } else {
    res.status(401).json({ message: "Invalid username or password." });
  }
};
