import type { NextApiRequest, NextApiResponse } from "next";
import * as cheerio from "cheerio";

const isValidUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol) &&
      !['localhost', '127.0.0.1'].includes(parsed.hostname);
  } catch {
    return false;
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { url } = req.query;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ message: "URL is required" });
  }

  try {
    if (!isValidUrl(url)) {
      return res.status(400).json({ message: "url is invalid" });
    }
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 10000);
    const jsonStringified = fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'ShoppyList/1.0' }
    })
    .then((resp) => resp.text())
    .then((text) => {
      const $ = cheerio.load(text);
      const ldJson = $(`script[type="application/ld+json"]`).html();
      return ldJson;
    });
    if (jsonStringified) {
      const json = JSON.parse((await jsonStringified) || "{}");
      let recipeObj = json;

      if (Array.isArray(recipeObj)) {
        recipeObj = recipeObj[0];
      }
      if (json["@graph"]?.length > 1 && Array.isArray(json["@graph"])) {
        recipeObj = json["@graph"].filter(
          (obj: { [x: string]: string }) => obj["@type"] === "Recipe"
        )[0];
      }
      return res.status(200).json(recipeObj);
    } else {
      return res.status(404).json({ message: "No ld+json found on the page" });
    }
  } catch (err) {
    console.error("Error fetching recipe:", err);
    return res.status(500).json({ message: "Error fetching recipe " + err });
  }
}
