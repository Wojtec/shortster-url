import { NextFunction, Request, Response } from "express";
import { shortCodeGenerator } from "../utils";
import ShortUrl from "../models";

import { shortCodeStats, redirectUrl, shortUrl } from "../controllers";

describe("Test error handler for each controller ", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
    };
  });
  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  test("shortUrl controller mocking database findOne function to test error handler next(err)", async (done) => {
    const mockDB = jest.fn().mockImplementation(() => {
      throw new Error("error");
    });

    ShortUrl.findOne = mockDB;

    await shortUrl(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction as NextFunction
    );
    expect(nextFunction).toBeCalledTimes(1);
    done();
  });

  test("redirectUrl controller mocking database findOne function to test error handler next(err)", async (done) => {
    const mockDB = jest.fn().mockImplementation(() => {
      throw new Error("error");
    });

    ShortUrl.findOne = mockDB;

    await redirectUrl(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction as NextFunction
    );
    expect(nextFunction).toBeCalledTimes(1);
    done();
  });

  test("shortCodeStats controller mocking database findOne function to test error handler next(err)", async (done) => {
    const mockDB = jest.fn().mockImplementation(() => {
      throw new Error("error");
    });

    ShortUrl.findOne = mockDB;

    await shortCodeStats(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction as NextFunction
    );
    expect(nextFunction).toBeCalledTimes(1);
    done();
  });
});

describe("Test short code generator function.", () => {
  test("Expect to get string.", () => {
    expect(shortCodeGenerator()).toEqual(expect.any(String));
  });

  test("Expect to get string with 6 charactes leter.", () => {
    expect(shortCodeGenerator().length).toBe(6);
  });
});
