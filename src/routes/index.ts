import { Router } from "express";

const router: Router = Router();

import { shortUrl } from "../controllers";

// POST URL
router.post("/shorturl", shortUrl);

export default router;
