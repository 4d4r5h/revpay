import express from "express";
import {
  createAccount,
  getAccounts,
} from "../controllers/accountController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(authMiddleware, createAccount)
  .get(authMiddleware, getAccounts);

export default router;
