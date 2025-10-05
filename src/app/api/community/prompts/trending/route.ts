import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { sharedPrompt, user } from '@/db/schema';
import { eq, desc, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const pageSize = 20;
    const offset = 0;

    // Calculate trending score: avgRating * log(ratingsCount + 1)
    const trendingScore = sql`${sharedPrompt.avgRating} * log(${sharedPrompt.ratingsCount} + 1)`;

    // Query with trending sort
    const items = await db
      .select({
        id: sharedPrompt.id,
        title: sharedPrompt.title,
        originalText: sharedPrompt.originalText,
        optimizedPrompt: sharedPrompt.optimizedPrompt,
        style: sharedPrompt.style,
        tone: sharedPrompt.tone,
        responseType: sharedPrompt.responseType,
        context: sharedPrompt.context,
        authorId: sharedPrompt.authorId,
        createdAt: sharedPrompt.createdAt,
        updatedAt: sharedPrompt.updatedAt,
        avgRating: sharedPrompt.avgRating,
        ratingsCount: sharedPrompt.ratingsCount,
        commentsCount: sharedPrompt.commentsCount,
        isActive: sharedPrompt.isActive,
        author: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
      })
      .from(sharedPrompt)
      .leftJoin(user, eq(sharedPrompt.authorId, user.id))
      .where(eq(sharedPrompt.isActive, true))
      .orderBy(desc(trendingScore), desc(sharedPrompt.createdAt))
      .limit(pageSize)
      .offset(offset);

    // Get total count for pagination
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(sharedPrompt)
      .where(eq(sharedPrompt.isActive, true));

    const total = totalResult[0]?.count || 0;

    return NextResponse.json({
      items,
      page: 1,
      pageSize,
      total,
    });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}