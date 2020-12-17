import { Request, Response, NextFunction } from "express";

export const shortUrl = (req: Request, res: Response, next: NextFunction) => {
  console.log(req);

  res.status(200).json("ok");
};
