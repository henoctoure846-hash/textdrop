import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { pastes } from "@/db/schema";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content } = body as { title?: string; content?: string };

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Le contenu est requis." },
        { status: 400 }
      );
    }

    const slug = nanoid(10);

    const [paste] = await db
      .insert(pastes)
      .values({
        slug,
        title: title?.trim() || null,
        content: content,
      })
      .returning();

    // 🔥 Récupère la vraie URL publique (Render, Vercel, etc.)
    const host =
      req.headers.get("x-forwarded-host") ||
      req.headers.get("host") ||
      req.nextUrl.host;

    const protocol =
      req.headers.get("x-forwarded-proto") ||
      (host?.includes("localhost") ? "http" : "https");

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;

    return NextResponse.json({
      id: paste.id,
      slug: paste.slug,
      url: `${baseUrl}/p/${paste.slug}`,
      rawUrl: `${baseUrl}/api/pastes/${paste.slug}/raw`,
      createdAt: paste.createdAt,
    });
  } catch (error) {
    console.error("Error creating paste:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du paste." },
      { status: 500 }
    );
  }
}