import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { sharedPrompt, promptComment, user } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';
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
    const id = params.id;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const promptId = parseInt(id);

    // Fetch the prompt with author info
    const promptResult = await db
      .select({
        id: sharedPrompt.id,
        title: sharedPrompt.title,
        originalText: sharedPrompt.originalText,
        optimizedPrompt: sharedPrompt.optimizedPrompt,
        style: sharedPrompt.style,
        tone: sharedPrompt.tone,
        responseType: sharedPrompt.responseType,
        context: sharedPrompt.context,
        avgRating: sharedPrompt.avgRating,
        ratingsCount: sharedPrompt.ratingsCount,
        commentsCount: sharedPrompt.commentsCount,
        createdAt: sharedPrompt.createdAt,
        isActive: sharedPrompt.isActive,
        authorId: user.id,
        authorName: user.name,
        authorImage: user.image,
      })
      .from(sharedPrompt)
      .leftJoin(user, eq(sharedPrompt.authorId, user.id))
      .where(and(eq(sharedPrompt.id, promptId), eq(sharedPrompt.isActive, true)))
      .limit(1);

    if (promptResult.length === 0) {
      return NextResponse.json(
        { error: 'Prompt not found', code: 'PROMPT_NOT_FOUND' },
        { status: 404 }
      );
    }

    const prompt = promptResult[0];

    // Fetch latest 20 comments with user info
    const commentsResult = await db
      .select({
        id: promptComment.id,
        content: promptComment.content,
        createdAt: promptComment.createdAt,
        userId: user.id,
        userName: user.name,
        userImage: user.image,
      })
      .from(promptComment)
      .leftJoin(user, eq(promptComment.userId, user.id))
      .where(eq(promptComment.promptId, promptId))
      .orderBy(desc(promptComment.createdAt))
      .limit(20);

    // Format the response
    const response = {
      id: prompt.id,
      title: prompt.title,
      originalText: prompt.originalText,
      optimizedPrompt: prompt.optimizedPrompt,
      style: prompt.style,
      tone: prompt.tone,
      responseType: prompt.responseType,
      context: prompt.context,
      author: {
        id: prompt.authorId,
        name: prompt.authorName,
        image: prompt.authorImage,
      },
      avgRating: prompt.avgRating,
      ratingsCount: prompt.ratingsCount,
      commentsCount: prompt.commentsCount,
      createdAt: prompt.createdAt?.toISOString(),
      comments: commentsResult.map((comment) => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt?.toISOString(),
        user: {
          id: comment.userId,
          name: comment.userName,
          image: comment.userImage,
        },
      })),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const promptId = parseInt(id);

    // Get authenticated user
    const authenticatedUser = await getUserFromRequest(request);
    if (!authenticatedUser) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    // Check if prompt exists and get author info
    const existingPrompt = await db
      .select()
      .from(sharedPrompt)
      .where(eq(sharedPrompt.id, promptId))
      .limit(1);

    if (existingPrompt.length === 0) {
      return NextResponse.json(
        { error: 'Prompt not found', code: 'PROMPT_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Check if user is the author
    if (existingPrompt[0].authorId !== authenticatedUser.id) {
      return NextResponse.json(
        {
          error: 'You are not authorized to delete this prompt',
          code: 'FORBIDDEN',
        },
        { status: 403 }
      );
    }

    // Soft delete: set isActive to false
    await db
      .update(sharedPrompt)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(sharedPrompt.id, promptId));

    return NextResponse.json(
      {
        success: true,
        message: 'Prompt deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}