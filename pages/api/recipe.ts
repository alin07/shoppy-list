import type { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium-min';

async function setup() {
  const executablePath = await chromium.executablePath(
    `https://github.com/Sparticuz/chromium/releases/download/v131.0.0/chromium-v131.0.0-pack.tar`
  );

  return await puppeteer.launch({
    args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
    defaultViewport: chromium.defaultViewport,
    executablePath,
    headless: chromium.headless,
  });
}
const browserPromise = setup();

export const config = {
  maxDuration: 5,
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const browser = await browserPromise;
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ message: 'URL is required' });
  }

  try {
    const page = await browser.newPage();

    // Increase the timeout for page.goto
    await page.goto(url as string, { waitUntil: 'networkidle0', timeout: 60000 });

    // Extract the content of the ld+json script tag
    const jsonLdContent = await page.evaluate(() => {
      const scriptTag = document.querySelector('script[type="application/ld+json"]');
      return scriptTag ? scriptTag.innerHTML : null;
    });

    await browser.close();

    if (jsonLdContent) {
      const jsonData = JSON.parse(jsonLdContent);
      return res.status(200).json(jsonData);
    } else {
      return res.status(404).json({ message: 'No ld+json found on the page' });
    }
  } catch (err) {
    console.error('Error fetching recipe:', err);
    return res.status(500).json({ message: 'Error fetching recipe ' + err });
  }
}