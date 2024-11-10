// app/api/getPlaiceholder/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getPlaiceholder } from "plaiceholder";

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('imageUrl');

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }
    console.log(imageUrl)

    // Fetch the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate placeholder
    const { base64, metadata } = await getPlaiceholder(buffer, { size: 10 });

    return NextResponse.json({ base64, metadata });
  } catch (error) {
    console.error("Error generating placeholder:", error);
    return NextResponse.json(
      { error: "Error generating placeholder" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: "Use POST method instead" }, { status: 405 });
}