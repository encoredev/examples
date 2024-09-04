import express, { Request, Response } from "express";

const router = express.Router();

// Template engine example. This will render the index.pug file in the views directory
router.get("/html", (_, res) => {
  res.render("index", { title: "Hey", message: "Hello there!" });
});

export default router;
