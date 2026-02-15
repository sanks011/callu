import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const videoId = req.nextUrl.searchParams.get("v");
  if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
    return NextResponse.json({ error: "Invalid video ID" }, { status: 400 });
  }

  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

  // Try noembed first (reliable, no auth needed)
  try {
    const res = await fetch(
      `https://noembed.com/embed?url=${encodeURIComponent(youtubeUrl)}`,
      { next: { revalidate: 3600 } }
    );
    if (res.ok) {
      const data = await res.json();
      if (data.title) {
        return NextResponse.json({
          title: data.title,
          thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        });
      }
    }
  } catch {}

  // Fallback: YouTube oEmbed (server-side, no CORS issue)
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(youtubeUrl)}&format=json`
    );
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({
        title: data.title || "Unknown Title",
        thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      });
    }
  } catch {}

  // Last resort: use video ID as title
  return NextResponse.json({
    title: `YouTube Video (${videoId})`,
    thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
  });
}
