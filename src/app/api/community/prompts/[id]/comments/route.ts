import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { promptComment, sharedPrompt, user } from '@/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import { auth } from '@/lib/auth';

async function getUserFromRequest(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  const session = await auth.api.getSession({ headers: request.headers });
  return session?.user || null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);

    // Validate prompt ID
    const promptId = parseInt(id);
    if (!promptId || isNaN(promptId)) {
      return NextResponse.json(
        { error: 'Valid prompt ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Validate pagination parameters
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const pageSize = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get('pageSize') || '20'))
    );

    if (isNaN(page) || isNaN(pageSize)) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters', code: 'INVALID_PAGINATION' },
        { status: 400 }
      );
    }

    // Check if prompt exists
    const prompt = await db
      .select()
      .from(sharedPrompt)
      .where(eq(sharedPrompt.id, promptId))
      .limit(1);

    if (prompt.length === 0) {
      return NextResponse.json(
        { error: 'Prompt not found', code: 'PROMPT_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Calculate offset
    const offset = (page - 1) * pageSize;

    // Fetch comments with user info
    const comments = await db
      .select({
        id: promptComment.id,
        content: promptComment.content,
        createdAt: promptComment.createdAt,
        user: {
          id: user.id,
          name: user.name,
          image: user.image,
        },
      })
      .from(promptComment)
      .innerJoin(user, eq(promptComment.userId, user.id))
      .where(eq(promptComment.promptId, promptId))
      .orderBy(desc(promptComment.createdAt))
      .limit(pageSize)
      .offset(offset);

    // Get total count
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(promptComment)
      .where(eq(promptComment.promptId, promptId));

    const total = totalResult[0]?.count || 0;

    // Format response
    const items = comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
      user: comment.user,
    }));

    return NextResponse.json({
      items,
      page,
      pageSize,
      total,
    });
  } catch (error) {
    console.error('GET comments error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Validate prompt ID
    const promptId = parseInt(id);
    if (!promptId || isNaN(promptId)) {
      return NextResponse.json(
        { error: 'Valid prompt ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Authenticate user
    const authenticatedUser = await getUserFromRequest(request);
    if (!authenticatedUser) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const { content } = body;

    // Validate content
    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required', code: 'MISSING_CONTENT' },
        { status: 400 }
      );
    }

    const trimmedContent = content.trim();
    if (trimmedContent.length === 0) {
      return NextResponse.json(
        { error: 'Content cannot be empty', code: 'EMPTY_CONTENT' },
        { status: 400 }
      );
    }

    if (trimmedContent.length > 1000) {
      return NextResponse.json(
        {
          error: 'Content must not exceed 1000 characters',
          code: 'CONTENT_TOO_LONG',
        },
        { status: 400 }
      );
    }

    // Check if prompt exists and is active
    const prompt = await db
      .select()
      .from(sharedPrompt)
      .where(eq(sharedPrompt.id, promptId))
      .limit(1);

    if (prompt.length === 0) {
      return NextResponse.json(
        { error: 'Prompt not found', code: 'PROMPT_NOT_FOUND' },
        { status: 404 }
      );
    }

    if (!prompt[0].isActive) {
      return NextResponse.json(
        { error: 'Prompt is not active', code: 'PROMPT_INACTIVE' },
        { status: 400 }
      );
    }

    // Insert comment
    const newComment = await db
      .insert(promptComment)
      .values({
        promptId,
        userId: authenticatedUser.id,
        content: trimmedContent,
        createdAt: new Date(),
      })
      .returning();

    // Increment comments count on shared_prompt
    await db
      .update(sharedPrompt)
      .set({
        commentsCount: sql`${sharedPrompt.commentsCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(sharedPrompt.id, promptId));

    // Fetch user info for response
    const commentWithUser = await db
      .select({
        id: promptComment.id,
        content: promptComment.content,
        createdAt: promptComment.createdAt,
        user: {
          id: user.id,
          name: user.name,
          image: user.image,
        },
      })
      .from(promptComment)
      .innerJoin(user, eq(promptComment.userId, user.id))
      .where(eq(promptComment.id, newComment[0].id))
      .limit(1);

    const responseData = {
      id: commentWithUser[0].id,
      content: commentWithUser[0].content,
      createdAt: commentWithUser[0].createdAt.toISOString(),
      user: commentWithUser[0].user,
    };

    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    console.error('POST comment error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}