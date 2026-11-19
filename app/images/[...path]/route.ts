import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathSegments } = await params;
  const fileName = pathSegments.join("/");

  // Check root /images folder first, then /public/images folder
  const rootImagePath = path.join(process.cwd(), "images", fileName);
  const publicImagePath = path.join(process.cwd(), "public", "images", fileName);

  let targetPath: string | null = null;
  if (fs.existsSync(rootImagePath)) {
    targetPath = rootImagePath;
  } else if (fs.existsSync(publicImagePath)) {
    targetPath = publicImagePath;
  }

  if (!targetPath) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const ext = path.extname(targetPath).toLowerCase();
  const mimeTypes: Record<string, string> = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".gif": "image/gif",
    ".ico": "image/x-icon",
  };

  const buffer = fs.readFileSync(targetPath);
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": mimeTypes[ext] || "application/octet-stream",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}

