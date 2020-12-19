import { Request, Response, NextFunction } from "express";
import ShortUrl, { ImodelUrl } from "../models";
import { shortCodeGenerator } from "../utils";

/**
 * CONTROLLERS
 *
 * shortUrl controller will receive url, and short code if it exists from client.
 * Will allow for the client to assign his own short code and will check if the short code contains a minimum 4 characters.
 * Will assign data to database model will save in database and return short url code.
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
    if (!url) return res.status(400).json({ message: "Url is required" });
    if (clientShortCode && clientShortCode.length < clientShortCodeMin) {
      return res.status(400).json({
        message: "Short code should have a minimum 4 characters.",
      });
    }
    if (url && clientShortCode) {
      const shortUrl: ImodelUrl = new ShortUrl({
        url: url,
        shortUrl: clientShortCode,
        createDate: new Date(),
        lastAccess: "-",
        timesAccess: 0,
      });
      const checkShortCode = await ShortUrl.findOne({
        shortUrl: shortUrl.shortUrl,
      });
      if (checkShortCode) {
        return res.status(400).json({
          message: "This short code is already exists.",
          shortCode: checkShortCode.shortUrl,
        });
      } else {
        const saveShortUrl = await shortUrl.save();
        const fullShortUrl =
          req.protocol +
          "://" +
          req.get("host") +
          req.baseUrl +
          "/" +
          saveShortUrl.shortUrl;
        return res.status(200).json({ shortURL: fullShortUrl });
      }
    }
    if (url) {
      const generateShortCode = shortCodeGenerator();
      const shortUrl: ImodelUrl = new ShortUrl({
        url: url,
        shortUrl: generateShortCode,
        createDate: new Date(),
        lastAccess: "-",
        timesAccess: 0,
      });
      const saveShortUrl = await shortUrl.save();
      const fullShortUrl =
        req.protocol +
        "://" +
        req.get("host") +
        req.baseUrl +
        "/" +
        saveShortUrl.shortUrl;
      return res.status(200).json({ shortURL: fullShortUrl });
    }
  } catch (err) {
    next(err);
  }
};

/**
 *
 * redirectUrl controller will receive short code from client,
 * next will find in database data related to short code,
 * will update access date, times visit and redirect to long address url.
 *
 **/
export const redirectUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { shorturl } = req.params;
    const getDate = new Date();
    const findUrl = await ShortUrl.findOne({
      shortUrl: shorturl,
    });
    if (!findUrl)
      return res.status(404).json({ message: "Short URL not found." });
    if (findUrl) {
      findUrl.timesAccess += 1;
      findUrl.lastAccess = getDate.toString();
      await ShortUrl.updateOne({ _id: findUrl._id }, findUrl);
      return res.redirect(302, req.protocol + "://" + findUrl.url);
    }
  } catch (err) {
    next(err);
  }
};

/**
 *
 * shortCodeStats controller will receive short code from client,
 * next will find in database data related to short code,
 * if data exists, will send a response json object with required information.
 *
 **/
export const shortCodeStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { shorturl } = req.params;
    const findUrl = await ShortUrl.findOne({
      shortUrl: shorturl,
    });
    if (!findUrl)
      return res.status(404).json({ message: "Short URL not found." });
    if (findUrl) {
      return res.status(200).json({
        registeredDate: findUrl.createDate.toString(),
        lastAccess: findUrl.lastAccess,
        timesAccess: findUrl.timesAccess,
      });
    }
  } catch (err) {
    next(err);
  }
};
