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
    return NextResponse.json(
      { error: "Paste non trouvé." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    id: paste.id,
    slug: paste.slug,
    title: paste.title,
    content: paste.content,
    createdAt: paste.createdAt,
  });
}
