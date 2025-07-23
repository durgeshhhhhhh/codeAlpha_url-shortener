import express from "express";
import { redirectToUrl } from "../controllers/urlController.js";

const router = express.Router();

router.get("/:shortCode", redirectToUrl);

export default router;
