import type { NextApiRequest, NextApiResponse } from "next";

export default async function POST(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    console.log("server is running")
    const data = req.query

    res.status(200).json({ data });
  }