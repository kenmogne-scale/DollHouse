import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") as File;

    if (!imageFile) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    const apiKey = process.env.REMOVE_BG_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Remove.bg API key not configured" },
        { status: 500 }
      );
    }

    // Prepare form data for Remove.bg API
    const removeBgFormData = new FormData();
    removeBgFormData.append("image_file", imageFile);
    removeBgFormData.append("size", "auto");

    // Call Remove.bg API
    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
      },
      body: removeBgFormData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Remove.bg API error:", errorData);
      return NextResponse.json(
        { error: errorData.errors?.[0]?.title || "Failed to remove background" },
        { status: response.status }
      );
    }

    // Get the processed image as a blob
    const imageBlob = await response.blob();
    
    // Return the processed image
    return new NextResponse(imageBlob, {
      headers: {
        "Content-Type": "image/png",
      },
    });
  } catch (error) {
    console.error("Error removing background:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

