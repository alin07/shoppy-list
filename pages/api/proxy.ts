import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ message: 'URL is required' });
  }

  try {
    const response = await fetch(url);
    const data = await response.text(); // Fetching as text to get the source code
    res.status(200).send(data);
  } catch (err) {
    console.error('Error fetching recipe:', err);
    res.status(500).json({ message: 'Error fetching recipe. ' + err });
  }
}
