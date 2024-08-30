import express, { NextFunction, Request, Response } from "express";

const router = express.Router();

// Auth middleware
function authMiddleware(req: Request, res: Response, next: NextFunction) {
  // TODO: Validate up auth token and verify that this is an authenticated user
  const isInvalidUser = req.headers["authorization"] === undefined;

  if (isInvalidUser) {
    res.status(401).json({ error: "invalid request" });
  } else {
    next();
  }
}

// Endpoint that requires auth
router.get("/dashboard", authMiddleware, (_, res: Response) => {
  res.json({ message: "Secret dashboard message" });
});

export default router;
