import type { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { getPlaiceholder } from "plaiceholder";

type ResponseData = {
  base64?: string;
  metadata?: any;
  error?: string;
};

export default async function POST(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  console.log(req.method);
  console.log(req.query);

  console.log("well recieved");

  // if (req.method !== "GET") {
  //   return res.status(405).json({ error: "Method Not Allowed" });
  // }

  const imageUrl = Array.isArray(req.query.imageUrl)
    ? req.query.imageUrl[0]
    : req.query.imageUrl;

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
    console.error("Error generating placeholder:", error);
    res.status(500).json({ error: "Error generating placeholder" });
  }
}

export async function GET(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log("well recieved for GET");
  // const data = request.json()

  console.log(req);

  // console.log(data)
  // const result = await res.json()
  return res.json({ data: NextRequest, message: "mal had l9lawi" });
}
