import { Request, Response } from "express";
import { createUserLoader } from "./createUserLoader";

interface MyContext {
  res: Response;
  req: Request;
  userLoader: ReturnType<typeof createUserLoader>;
}

export default MyContext;
