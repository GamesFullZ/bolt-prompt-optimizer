import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { promptRating, sharedPrompt } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { auth } from '@/lib/auth';

async function getUserFromRequest(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  const session = await auth.api.getSession({ headers: request.headers });
  return session?.user || null;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authentication check
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    // Validate prompt ID
    const promptId = parseInt(params.id);
    if (!promptId || isNaN(promptId)) {
      return NextResponse.json(
        { error: 'Valid prompt ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { value } = body;

    // Validate rating value
    if (value === undefined || value === null) {
      return NextResponse.json(
        { error: 'Rating value is required', code: 'MISSING_VALUE' },
        { status: 400 }
      );
    }

    if (!Number.isInteger(value) || value < 1 || value > 5) {
      return NextResponse.json(
        { error: 'Rating value must be an integer between 1 and 5', code: 'INVALID_VALUE' },
        { status: 400 }
      );
    }

    // Check if prompt exists and is active
    const prompt = await db
      .select()
      .from(sharedPrompt)
      .where(and(eq(sharedPrompt.id, promptId), eq(sharedPrompt.isActive, true)))
      .limit(1);

    if (prompt.length === 0) {
      return NextResponse.json(
        { error: 'Prompt not found or inactive', code: 'PROMPT_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Check if user already rated this prompt
    const existingRating = await db
      .select()
      .from(promptRating)
      .where(
        and(
          eq(promptRating.promptId, promptId),
          eq(promptRating.userId, user.id)
        )
      )
      .limit(1);

    // Upsert rating
    if (existingRating.length > 0) {
      // Update existing rating
      await db
        .update(promptRating)
        .set({
          value,
          createdAt: new Date(),
        })
        .where(
          and(
            eq(promptRating.promptId, promptId),
            eq(promptRating.userId, user.id)
          )
        );
    } else {
      // Insert new rating
      await db.insert(promptRating).values({
        promptId,
        userId: user.id,
        value,
        createdAt: new Date(),
      });
    }

    // Recalculate aggregate statistics
    const stats = await db
      .select({
        avg: sql<number>`AVG(${promptRating.value})`,
        count: sql<number>`COUNT(*)`,
      })
      .from(promptRating)
      .where(eq(promptRating.promptId, promptId));

    const avgRating = stats[0]?.avg ? Math.round(stats[0].avg * 10) / 10 : 0;
    const ratingsCount = stats[0]?.count || 0;

    // Update shared_prompt with new statistics
    await db
      .update(sharedPrompt)
      .set({
        avgRating,
        ratingsCount,
        updatedAt: new Date(),
      })
      .where(eq(sharedPrompt.id, promptId));

    // Return response
    return NextResponse.json(
      {
        avgRating,
        ratingsCount,
        myRating: value,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('POST rating error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}