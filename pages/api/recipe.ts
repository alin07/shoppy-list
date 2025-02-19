import type { NextApiRequest, NextApiResponse } from 'next';
// import {chromium as playwright} from 'playwright-core';
// import chromium from "@sparticuz/chromium";
import * as cheerio from "cheerio"
export const config = {
  maxDuration: 60,
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;
  
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ message: 'URL is required' });
  }

  try {
    const jsonStringified = fetch(url).then(resp => resp.text()).then(text => {
      const $ = cheerio.load(text);
      const ldJson = $(`script[type="application/ld+json"]`).html();
      return ldJson;
    })
    const json = JSON.parse(await jsonStringified || '{}')
    console.log(json)
    let recipeObj = json;
    if (json["@graph"] && json["@graph"]?.length > 1) {
      recipeObj = json["@graph"].filter((obj: { [x: string]: string; }) => obj["@type"] === "Recipe")[0]
    
    console.log("======", recipeObj);

      return res.status(200).json(recipeObj);
    } else {
      return res.status(404).json({ message: 'No ld+json found on the page' });
    }
  } catch (err) {
    console.error('Error fetching recipe:', err);
    return res.status(500).json({ message: 'Error fetching recipe ' + err });
  }
}