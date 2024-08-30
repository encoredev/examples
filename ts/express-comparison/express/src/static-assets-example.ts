import express from "express";

const router = express.Router();

router.use("/assets", express.static("assets")); // Serve static files from the assets directory

export default router;
