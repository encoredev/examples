import express, {Request, Response} from "express";

const router = express.Router()

// POST request example
router.post("/order", (req: Request, res: Response) => {
  const price = req.body.price;
  const orderId = req.body.orderId;
  // Handle order logic
  res.json({message: "Order has been placed"});
});

export default router;
