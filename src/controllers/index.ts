import { Request, Response, NextFunction } from "express";
import ShortUrl, { ImodelUrl } from "../models";
import { shortCodeGenerator } from "../utils";

/**
 *
 * shortUrl controller will receive url, and short code if it exists from client.
 *
 **/
export const shortUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const clientShortCodeMin = 4;
    const { url, clientShortCode } = req.body;
    if (clientShortCode.length < clientShortCodeMin) {
      return res.status(400).send({
        message: "Short code should have a minimum 4 characters.",
      });
    }
    console.log(clientShortCode.length);
    const findUrl = await ShortUrl.findOne({ url: url });
    if (!findUrl) {
      const short = shortCodeGenerator();

      return res.status(500).json(short);
    }
    res.status(200).json("ok");
  } catch (err) {
    next(err);
  }
};
