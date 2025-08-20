import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get("term");

  if (!searchTerm) {
    return NextResponse.json({ error: "Search term is required" }, { status: 400 });
  }

  try {
    const itunesApiUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&media=music&entity=song&limit=10`;
    const response = await fetch(itunesApiUrl);

    if (!response.ok) {
      throw new Error(`iTunes API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Map iTunes API results to a simpler format
    const searchResults = data.results.map((item: any) => ({
      trackName: item.trackName,
      artistName: item.artistName,
      artworkUrl100: item.artworkUrl100,
      previewUrl: item.previewUrl, // MP3 preview
      trackViewUrl: item.trackViewUrl, // Link to iTunes store
    }));

    return NextResponse.json(searchResults);
  } catch (error: any) {
    console.error("Error fetching from iTunes API:", error.message);
    return NextResponse.json(
      { error: "Failed to search for songs" },
      { status: 500 }
    );
  }
}