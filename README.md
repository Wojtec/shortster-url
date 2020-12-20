# shortster

## Specifications:

- A user can submit a URL and receive a unique shortcode in response.
- A user can submit a URL and shortcode and will receive the chosen shortcode if it is available.
- A user can access a /<shortcode> endpoint and be redirected to the URL associated with that shortcode, if it exists.
- All shortcodes can contain digits, upper case letters, and lowercase letters. It is case sensitive.
- Automatically generated shortcodes are exactly 6 characters long.
- User submitted shortcodes must be at least 4 characters long.
- A user can access a /<shortcode>/stats endpoint in order to see when the shortcode was registered, when it was last accessed, and how many times it was accessed.

## Technology

- TypeScript
- Node.js
- Express.js
- MongoDB
- Jest
- Docker

# Installation

To use application you will need some API testing tool for example `Postman` Available on [Postman](https://docs.api.getpostman.com/)

To get started with shortster you need to clone project from git repository.

In your terminal:

```
git clone https://github.com/Wojtec/shortster-url.git

```

## Run the application using a local server

Open project in your code editor and install all dependencies

Make sure that you are in correct path `/shortster-url$` in your terminal and write :

```
npm install
```

Set up your mongoDB path URI and other environment variables.

```
npm start
```

Server should be listening on `http://localhost:3000`

## Run the application using Docker, Docker-Compose

- Docker:

Build the image:

```
sudo docker build -t shortster .
```

Run the image on port 3000:

```
sudo docker run -t -i -p 3000:3000 shortster
```

- Docker compose:

Build compose:

```
sudo docker-compose build
```

Run the compose:

```
sudo docker-compose up
```

# File system

{

}

## Endpoints

### /shorturl

- A user can submit a URL and receive a unique shortcode in response.
- A user can submit a URL and shortcode and will receive the chosen shortcode if it is available.
- User submitted shortcodes must be at least 4 characters long.

```
POST /api/v1/shorturl
```

Response:

```
{
    "shortURL": "http://localhost:3000/api/v1/r925B5"
}
```

In folder `/src/controllers/index.ts` you can find methods to this endpoint.

```csharp
export const shortUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    // Try catch block.
  try {
    // Set number of short code characters.
    const clientShortCodeMin = 4;
    // Set variables from request body.
    const { url, clientShortCode } = req.body;
    // Check if long url was in request.
    if (!url) return res.status(400).json({ message: "Url is required" });
    // Check if client short code contains 4 characters.
    if (clientShortCode && clientShortCode.length < clientShortCodeMin) {
      return res.status(400).json({
        message: "Short code should have a minimum 4 characters.",
      });
    }
    // If the request contains long url and short code from client.
    if (url && clientShortCode) {
      // Create new short url model
      const shortUrl: ImodelUrl = new ShortUrl({
        url: url,
        shortUrl: clientShortCode,
        createDate: new Date(),
        lastAccess: "-",
        timesAccess: 0,
      });
      // Check if short code from the client does not exist in the database.
      const checkShortCode = await ShortUrl.findOne({
        shortUrl: shortUrl.shortUrl,
      });
      // If short code exist response 400,"This short code is already exists."
      if (checkShortCode) {
        return res.status(400).json({
          message: "This short code is already exists.",
          shortCode: checkShortCode.shortUrl,
        });
      } else {
        // Save a model in database.
        const saveShortUrl = await shortUrl.save();
        // Create full http addres with short code.
        const fullShortUrl =
          req.protocol +
          "://" +
          req.get("host") +
          req.baseUrl +
          "/" +
          saveShortUrl.shortUrl;
        // Response 200 with short url address.
        return res.status(200).json({ shortURL: fullShortUrl });
      }
    }
    // If the request contain only long url.
    if (url) {
      // Call a helper function from /utils to generate short code.
      const generateShortCode = shortCodeGenerator();
      // Create new short url model with short code.
      const shortUrl: ImodelUrl = new ShortUrl({
        url: url,
        shortUrl: generateShortCode,
        createDate: new Date(),
        lastAccess: "-",
        timesAccess: 0,
      });
      // Save a short url in database.
      const saveShortUrl = await shortUrl.save();
      // Create full http addres with short code.
      const fullShortUrl =
        req.protocol +
        "://" +
        req.get("host") +
        req.baseUrl +
        "/" +
        saveShortUrl.shortUrl;
      // Response 200 with short url address.
      return res.status(200).json({ shortURL: fullShortUrl });
    }
    // If is error catch and call global error handler.
  } catch (err) {
    next(err);
  }
};
```

### /:shorturl

- A user can access a /<shortcode> endpoint and be redirected to the URL associated with that shortcode, if it exists.

```
GET /api/v1/:shorturl
```

Response:

As a response user will be automatically redirected to url what is assigned to short code.

In folder `/src/controllers/index.ts` you can find methods to this endpoint.

```csharp
export const redirectUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Try catch block.
  try {
    // Set variable from request params.
    const { shorturl } = req.params;
    // Get new date.
    const getDate = new Date();
    // Find by short code, url in database.
    const findUrl = await ShortUrl.findOne({
      shortUrl: shorturl,
    });
    // If short code does not exist in the database response 404 not found.
    if (!findUrl)
      return res.status(404).json({ message: "Short URL not found." });
    else {
      // Update times access in url model.
      findUrl.timesAccess += 1;
      // Update last access date in url model.
      findUrl.lastAccess = getDate.toString();
      // Update new url model in database.
      await ShortUrl.updateOne({ _id: findUrl._id }, findUrl);
      // Redirect user to long url address.
      return res.redirect(302, req.protocol + "://" + findUrl.url);
    }
  // If is error catch and call global error handler.
  } catch (err) {
    next(err);
  }
};
```

### /:shorturl/stats

- A user can access a /:shortcode/stats endpoint in order to see when the shortcode was registered, when it was last accessed, and how many times it was accessed.

```
GET /api/v1/:shorturl/stats
```

Response:

```
{
    "registeredDate": "Sun Dec 20 2020 13:53:58 GMT+0000 (Coordinated Universal Time)",
    "lastAccess": "Sun Dec 20 2020 13:54:48 GMT+0000 (Coordinated Universal Time)",
    "timesAccess": 10
}
```

In folder `/src/controllers/index.ts` you can find methods to this endpoint.

```csharp
export const shortCodeStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Try catch block.
  try {
    // Set variable from request params.
    const { shorturl } = req.params;
    // Find by short code, url in database.
    const findUrl = await ShortUrl.findOne({
      shortUrl: shorturl,
    });
    // If short code does not exist in the database response 404 not found.
    if (!findUrl)
      return res.status(404).json({ message: "Short URL not found." });
    // Else response status 200 with data object.
    else {
      return res.status(200).json({
        registeredDate: findUrl.createDate.toString(),
        lastAccess: findUrl.lastAccess,
        timesAccess: findUrl.timesAccess,
      });
    }
  // If is error catch and call global error handler.
  } catch (err) {
    next(err);
  }
};
```
