import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { pastes } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const [paste] = await db
    .select()
    .from(pastes)
    .where(eq(pastes.slug, slug))
    .limit(1);

  if (!paste) {
    return new NextResponse("Paste non trouvé.", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const header = paste.title ? `Title: ${paste.title}\n\n` : "";
  const fullText = `${header}${paste.content}`;

  return new NextResponse(fullText, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "X-Robots-Tag": "index, follow",
    },
  });
}
