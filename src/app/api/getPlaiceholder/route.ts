import type { NextApiRequest, NextApiResponse } from "next";
import { getPlaiceholder } from "plaiceholder";

type ResponseData = {
  base64?: string;
  metadata?: any;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const imageUrl = Array.isArray(req.query.imageUrl)
    ? req.query.imageUrl[0]
    : req.query.imageUrl;

  if (!imageUrl) {
    return res.status(400).json({ error: "Image URL is required" });
  }

  try {
    // Fetch the image and convert it to a Buffer
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Get the placeholder using the Buffer
    const { metadata, base64 } = await getPlaiceholder(buffer, { size: 10 });

    res.status(200).json({ base64, metadata });
  } catch (error) {
    res.status(500).json({ error: "Error generating placeholder" });
  }
}
