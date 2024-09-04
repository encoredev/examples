import express, {Request, Response} from "express";

const router = express.Router()

// Dynamic path parameter :name
router.get("/hello/:name", (req: Request, res: Response) => {
  const msg = `Hello ${req.params.name}!`;
  res.json({message: msg});
})

// Query string parameter
router.get("/hello", (req: Request, res: Response) => {
  const msg = `Hello ${req.query.name}!`;
  res.json({message: msg});
});

export default router;
