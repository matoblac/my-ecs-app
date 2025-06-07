import express, { Request, Response } from "express";
const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World from Backend!");
});

app.listen(3000, () => console.log("Backend running on port 3000"));
