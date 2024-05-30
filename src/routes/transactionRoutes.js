import express from "express";
import {
  createTransaction,
  getBalance,
} from "../controllers/transactionController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createTransaction);
router.get("/balance/:accountNumber", authMiddleware, getBalance);

export default router;
