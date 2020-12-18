import { Router } from "express";

const router: Router = Router();

import { shortUrl, redirectUrl, shortCodeStats } from "../controllers";

// POST URL and short code opcional
router.post("/shorturl", shortUrl);

// GET URL and redirect
router.get("/:shorturl", redirectUrl);

// GET statistics about short code
router.get("/:shorturl/stats", shortCodeStats);

export default router;
