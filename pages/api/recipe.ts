import type { NextApiRequest, NextApiResponse } from 'next';
import {chromium as playwright} from 'playwright-core';
import chromium from "@sparticuz/chromium";

export const config = {
  maxDuration: 60,
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;
  
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ message: 'URL is required' });
  }

  try {
    const executablePath = await chromium.executablePath();
    console.log(executablePath)
    const browser = await playwright.launch({
      executablePath,
      headless: true,
      args: chromium.args
    });

    const page = await browser.newPage();
    await page.goto(url);
    // Extract the content of the ld+json script tag
    const jsonLdContent = await page.evaluate(() => {
      const scriptTag = document.querySelector('script[type="application/ld+json"]');
      return scriptTag ? scriptTag.innerHTML : null;
    });

    await browser.close();
    if (jsonLdContent) {
      const parsedContent = JSON.parse(jsonLdContent);
      let recipeObj = parsedContent;

      if (parsedContent["@graph"] && parsedContent["@graph"]?.length > 1) {
        recipeObj = parsedContent["@graph"];
        console.log(recipeObj)
        recipeObj = recipeObj.filter((obj:
          { [x: string]: string; }
        ) => obj["@type"] === "Recipe")[0];
      }

      return res.status(200).json(recipeObj);
    } else {
      return res.status(404).json({ message: 'No ld+json found on the page' });
    }
  } catch (err) {
    console.error('Error fetching recipe:', err);
    return res.status(500).json({ message: 'Error fetching recipe ' + err });
  }
}