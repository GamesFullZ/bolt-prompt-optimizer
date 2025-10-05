import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { sharedPrompt, user } from '@/db/schema';
import { eq, like, and, or, desc, sql } from 'drizzle-orm';
import { auth } from '@/lib/auth';

async function getUserFromRequest(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  const session = await auth.api.getSession({ headers: request.headers });
  return session?.user || null;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get('pageSize') || '20')));
    const sort = searchParams.get('sort') || 'trending';

    const offset = (page - 1) * pageSize;

    // Build where conditions
    let whereCondition = eq(sharedPrompt.isActive, true);
    
    if (query && query.trim()) {
      const searchCondition = or(
        like(sharedPrompt.title, `%${query}%`),
        like(sharedPrompt.originalText, `%${query}%`)
      );
      whereCondition = and(whereCondition, searchCondition);
    }

    // Build order by based on sort parameter
    let orderByClause;
    if (sort === 'trending') {
      orderByClause = [
        desc(sql`(${sharedPrompt.avgRating} * log(${sharedPrompt.ratingsCount} + 1))`),
        desc(sharedPrompt.createdAt)
      ];
    } else if (sort === 'new') {
      orderByClause = [desc(sharedPrompt.createdAt)];
    } else if (sort === 'top') {
      orderByClause = [
        desc(sharedPrompt.avgRating),
        desc(sharedPrompt.ratingsCount)
      ];
    } else {
      // Default to trending
      orderByClause = [
        desc(sql`(${sharedPrompt.avgRating} * log(${sharedPrompt.ratingsCount} + 1))`),
        desc(sharedPrompt.createdAt)
      ];
    }

    // Get paginated results with author information
    const results = await db
      .select({
        id: sharedPrompt.id,
        title: sharedPrompt.title,
        style: sharedPrompt.style,
        tone: sharedPrompt.tone,
        responseType: sharedPrompt.responseType,
        context: sharedPrompt.context,
        avgRating: sharedPrompt.avgRating,
        ratingsCount: sharedPrompt.ratingsCount,
        commentsCount: sharedPrompt.commentsCount,
        createdAt: sharedPrompt.createdAt,
        authorId: sharedPrompt.authorId,
        authorName: user.name,
        authorImage: user.image,
      })
      .from(sharedPrompt)
      .innerJoin(user, eq(sharedPrompt.authorId, user.id))
      .where(whereCondition)
      .orderBy(...orderByClause)
      .limit(pageSize)
      .offset(offset);

    // Get total count for pagination
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(sharedPrompt)
      .where(whereCondition);
    
    const total = Number(countResult[0]?.count || 0);

    // Format response
    const items = results.map(item => ({
      id: item.id,
      title: item.title,
      style: item.style,
      tone: item.tone,
      responseType: item.responseType,
      context: item.context,
      author: {
        id: item.authorId,
        name: item.authorName,
        image: item.authorImage,
      },
      avgRating: item.avgRating || 0,
      ratingsCount: item.ratingsCount,
      commentsCount: item.commentsCount,
      createdAt: item.createdAt.toISOString(),
    }));

    return NextResponse.json({
      items,
      page,
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

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'AUTH_REQUIRED' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validation
    const { title, originalText, optimizedPrompt, options } = body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json(
        { error: 'Title is required', code: 'MISSING_TITLE' },
        { status: 400 }
      );
    }

    if (title.trim().length > 200) {
      return NextResponse.json(
        { error: 'Title must be 200 characters or less', code: 'TITLE_TOO_LONG' },
        { status: 400 }
      );
    }

    if (!originalText || typeof originalText !== 'string' || !originalText.trim()) {
      return NextResponse.json(
        { error: 'Original text is required', code: 'MISSING_ORIGINAL_TEXT' },
        { status: 400 }
      );
    }

    if (originalText.trim().length > 2000) {
      return NextResponse.json(
        { error: 'Original text must be 2000 characters or less', code: 'ORIGINAL_TEXT_TOO_LONG' },
        { status: 400 }
      );
    }

    if (!optimizedPrompt || typeof optimizedPrompt !== 'string' || !optimizedPrompt.trim()) {
      return NextResponse.json(
        { error: 'Optimized prompt is required', code: 'MISSING_OPTIMIZED_PROMPT' },
        { status: 400 }
      );
    }

    if (optimizedPrompt.trim().length > 5000) {
      return NextResponse.json(
        { error: 'Optimized prompt must be 5000 characters or less', code: 'OPTIMIZED_PROMPT_TOO_LONG' },
        { status: 400 }
      );
    }

    if (!options || typeof options !== 'object') {
      return NextResponse.json(
        { error: 'Options object is required', code: 'MISSING_OPTIONS' },
        { status: 400 }
      );
    }

    if (!options.style || typeof options.style !== 'string' || !options.style.trim()) {
      return NextResponse.json(
        { error: 'Style is required in options', code: 'MISSING_STYLE' },
        { status: 400 }
      );
    }

    if (!options.tone || typeof options.tone !== 'string' || !options.tone.trim()) {
      return NextResponse.json(
        { error: 'Tone is required in options', code: 'MISSING_TONE' },
        { status: 400 }
      );
    }

    if (!options.responseType || typeof options.responseType !== 'string' || !options.responseType.trim()) {
      return NextResponse.json(
        { error: 'Response type is required in options', code: 'MISSING_RESPONSE_TYPE' },
        { status: 400 }
      );
    }

    if (!options.context || typeof options.context !== 'string' || !options.context.trim()) {
      return NextResponse.json(
        { error: 'Context is required in options', code: 'MISSING_CONTEXT' },
        { status: 400 }
      );
    }

    // Insert new shared prompt
    const now = new Date();
    const newPrompt = await db
      .insert(sharedPrompt)
      .values({
        title: title.trim(),
        originalText: originalText.trim(),
        optimizedPrompt: optimizedPrompt.trim(),
        style: options.style.trim(),
        tone: options.tone.trim(),
        responseType: options.responseType.trim(),
        context: options.context.trim(),
        authorId: user.id,
        createdAt: now,
        updatedAt: now,
        avgRating: 0,
        ratingsCount: 0,
        commentsCount: 0,
        isActive: true,
      })
      .returning();

    return NextResponse.json(
      { id: newPrompt[0].id },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}