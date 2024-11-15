import type { NextApiRequest, NextApiResponse } from 'next';
import chromium from '@sparticuz/chromium-min';
import puppeteer from 'puppeteer-core';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ message: 'URL is required' });
  }

  try {
    const browser = await puppeteer.launch({
      args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(
        `https://github.com/Sparticuz/chromium/releases/download/v131.0.0/chromium-v131.0.0-pack.tar`
      ),
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    // Navigate to the provided URL
    await page.goto(url as string, { waitUntil: 'networkidle0' });

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