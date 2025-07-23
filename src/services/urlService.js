import { customAlphabet } from "nanoid";
import * as urlDB from "../models/urldb.js";

const generateId = customAlphabet(
  "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789",
  6
);

export function generateShortCode() {
  return generateId();
}

export async function createShortUrl(originalUrl, customCode = null) {
  if (customCode) {
    const exists = await urlDB.shortCodeExists(customCode);
    if (exists) {
      throw new Error("Custom short code is already in use");
    }
  }

  const shortCode = customCode || generateShortCode();

  try {
    const savedUrl = await urlDB.saveUrl(shortCode, originalUrl);

    return {
      originalUrl,
      shortCode: savedUrl.short_code,
      createdAt: savedUrl.created_at,
    };
  } catch (error) {
    if (
      !customCode &&
      (error.message.includes("duplicate key") ||
        error.message.includes("unique constraint"))
    ) {
      return createShortUrl(originalUrl);
    }
    throw error;
  }
}

export async function getOriginalUrl(shortCode) {
  const originalUrl = await urlDB.getUrlByShortCode(shortCode);

  if (originalUrl) {
    try {
      await urlDB.incrementClicks(shortCode);
    } catch (error) {
      console.error("Failed to increment click count: ", error);
    }
  }
  return originalUrl;
}
