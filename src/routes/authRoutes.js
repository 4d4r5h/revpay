import express from "express";
import {
  registerBusiness,
  loginBusiness,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerBusiness);
router.post("/login", loginBusiness);

export default router;
