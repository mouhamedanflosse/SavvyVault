import type { NextApiRequest, NextApiResponse  } from "next";
import { getPlaiceholder } from "plaiceholder";

type ResponseData = {
  base64?: string;
  metadata?: any;
  error?: string;
};

export async function POST(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  // console.log(req);
  console.log(req.body.docURL);
//   console.log(JSON.parse(req.body));
  console.log(req.query.imageUrl);
  const imageUrl = Array.isArray(req.query.imageUrl)
    ? req.query.imageUrl[0]
    : req.query.imageUrl;

  console.log(req.query.imageUrl);
  console.log(imageUrl);

  if (!imageUrl) {
    return res.status(400).json({ error: "Image URL is required" });
  }

  try {
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { metadata, base64 } = await getPlaiceholder(buffer, { size: 10 });
    res.status(200).json({ base64, metadata });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error generating placeholder" });
  }
}
