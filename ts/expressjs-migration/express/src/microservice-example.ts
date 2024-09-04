import express, { Request, Response } from "express";

const router = express.Router();

// Microservice communication
router.get("/save-post", async (req: Request, res: Response) => {
  try {
    // Calling another service using fetch
    const resp = await fetch("https://another-service/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: req.query.title,
        content: req.query.content,
      }),
    });
    res.json(await resp.json());
  } catch (e) {
    res.status(500).json({ error: "Could not save post" });
  }
});

export default router;
