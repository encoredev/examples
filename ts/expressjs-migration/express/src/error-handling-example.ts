import express, { Request, Response } from "express";

const router = express.Router();

// Default error handler
router.get("/broken", (req, res) => {
  throw new Error("BROKEN"); // This will result in a 500 error
});

// Returning specific error code
router.get("/get-user", (req: Request, res: Response) => {
  const id = req.query.id || "";
  if (id.length !== 3) {
    res.status(400).json({ error: "invalid id format" });
  }
  // TODO: Fetch something from the DB
  res.json({ user: "Simon" });
});

export default router;
