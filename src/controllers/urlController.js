import * as urlService from "../services/urlService.js";

export async function createShortUrl(req, res) {
  try {
    const { url, customCode } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: "URL is required",
      });
    }

    try {
      const urlObj = new URL(url);

      const domainRegex = /^([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z0-9]([a-z0-9-]*[a-z0-9])?$/i;
      if(!domainRegex.test(urlObj.hostname)){
        throw new Error("Invalid domain");
      }
    } catch (e) {
      return res.status(400).json({
        success: false,
        error: "Invalid URL format",
      });
    }

    const shortUrl = await urlService.createShortUrl(url, customCode);

    return res.status(201).json({
      success: true,
      originalUrl: shortUrl.originalUrl,
      shortCode: shortUrl.shortCode,
      shortUrl: `${req.protocol}://${req.get("host")}/${shortUrl.shortCode}`,
      createdAt: shortUrl.createdAt,
    });
  } catch (error) {
    console.error("Error in createShortUrl: ", error);

    if (error.message === "Custom short code is already in use") {
      return res.status(409).json({
        success: false,
        error: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

export async function redirectToUrl(req, res) {
  try {
    const { shortCode } = req.params;

    if (!shortCode) {
      return res.status(400).json({
        success: false,
        error: "Short code is required",
      });
    }

    const originalUrl = await urlService.getOriginalUrl(shortCode);

    if (!originalUrl) {
      return res.status(404).json({
        success: false,
        error: "Short URL not found",
      });
    }

    return res.redirect(originalUrl);
  } catch (error) {
    console.error("Error in redirectToUrl: ", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
