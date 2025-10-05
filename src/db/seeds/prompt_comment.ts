import { db } from '@/db';
import { promptComment } from '@/db/schema';

async function main() {
    const baseDate = new Date('2024-01-15T10:00:00Z').getTime();
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    const sampleComments = [
        // Prompt 1: 8 comments (React Dashboard)
        {
            promptId: 1,
            userId: 'rating_user_3',
            content: 'This prompt worked perfectly! Generated exactly what I needed for my admin dashboard project.',
            createdAt: new Date(baseDate + oneDayMs * 1 + 3 * 60 * 60 * 1000),
        },
        {
            promptId: 1,
            userId: 'rating_user_7',
            content: 'Great structure, the optimized version is so much better than my original attempt.',
            createdAt: new Date(baseDate + oneDayMs * 1 + 8 * 60 * 60 * 1000),
        },
        {
            promptId: 1,
            userId: 'rating_user_12',
            content: 'Can this be adapted for a mobile app instead of web? Would love to use similar structure.',
            createdAt: new Date(baseDate + oneDayMs * 2 + 5 * 60 * 60 * 1000),
        },
        {
            promptId: 1,
            userId: 'demo_user_1',
            content: 'Works well but I had to adjust the responsive design section for my tablet layout.',
            createdAt: new Date(baseDate + oneDayMs * 2 + 14 * 60 * 60 * 1000),
        },
        {
            promptId: 1,
            userId: 'rating_user_5',
            content: 'Has anyone tried this with TypeScript? Wondering if the types would need adjustment.',
            createdAt: new Date(baseDate + oneDayMs * 3 + 9 * 60 * 60 * 1000),
        },
        {
            promptId: 1,
            userId: 'rating_user_15',
            content: 'Love this! Used it for my project and saved hours of work. Thank you!',
            createdAt: new Date(baseDate + oneDayMs * 4 + 6 * 60 * 60 * 1000),
        },
        {
            promptId: 1,
            userId: 'rating_user_9',
            content: 'Would be even better with dark mode examples included in the prompt.',
            createdAt: new Date(baseDate + oneDayMs * 5 + 11 * 60 * 60 * 1000),
        },
        {
            promptId: 1,
            userId: 'rating_user_18',
            content: 'Consider adding accessibility requirements to the prompt. WCAG compliance is important.',
            createdAt: new Date(baseDate + oneDayMs * 6 + 7 * 60 * 60 * 1000),
        },

        // Prompt 2: 5 comments (API Documentation)
        {
            promptId: 2,
            userId: 'rating_user_4',
            content: 'Exactly what I was looking for! The structure helped me document my REST API perfectly.',
            createdAt: new Date(baseDate + oneDayMs * 1 + 4 * 60 * 60 * 1000),
        },
        {
            promptId: 2,
            userId: 'rating_user_11',
            content: 'Good start but could use more details on authentication methods and security examples.',
            createdAt: new Date(baseDate + oneDayMs * 2 + 10 * 60 * 60 * 1000),
        },
        {
            promptId: 2,
            userId: 'rating_user_8',
            content: 'What format does this work best with? OpenAPI/Swagger or plain markdown?',
            createdAt: new Date(baseDate + oneDayMs * 3 + 7 * 60 * 60 * 1000),
        },
        {
            promptId: 2,
            userId: 'rating_user_16',
            content: 'Thanks for sharing! Very helpful for documenting GraphQL endpoints too.',
            createdAt: new Date(baseDate + oneDayMs * 4 + 13 * 60 * 60 * 1000),
        },
        {
            promptId: 2,
            userId: 'rating_user_2',
            content: 'Maybe include rate limiting and pagination examples in the optimized version?',
            createdAt: new Date(baseDate + oneDayMs * 5 + 8 * 60 * 60 * 1000),
        },

        // Prompt 3: 12 comments (E-commerce Landing Page)
        {
            promptId: 3,
            userId: 'rating_user_6',
            content: 'This is gold! Used it for my Shopify store and the conversion rate improved significantly.',
            createdAt: new Date(baseDate + oneDayMs * 1 + 2 * 60 * 60 * 1000),
        },
        {
            promptId: 3,
            userId: 'rating_user_13',
            content: 'Love the focus on conversion optimization. Really thoughtful prompt structure.',
            createdAt: new Date(baseDate + oneDayMs * 1 + 9 * 60 * 60 * 1000),
        },
        {
            promptId: 3,
            userId: 'rating_user_1',
            content: 'Can this be modified for a SaaS landing page instead of e-commerce?',
            createdAt: new Date(baseDate + oneDayMs * 2 + 6 * 60 * 60 * 1000),
        },
        {
            promptId: 3,
            userId: 'demo_user_1',
            content: 'Helpful prompt, though I needed to add more context about my target audience and brand voice.',
            createdAt: new Date(baseDate + oneDayMs * 2 + 15 * 60 * 60 * 1000),
        },
        {
            promptId: 3,
            userId: 'rating_user_10',
            content: 'Great work! The SEO optimization suggestions in the response were spot on.',
            createdAt: new Date(baseDate + oneDayMs * 3 + 4 * 60 * 60 * 1000),
        },
        {
            promptId: 3,
            userId: 'rating_user_17',
            content: 'Would love to see mobile-first design considerations emphasized more in the prompt.',
            createdAt: new Date(baseDate + oneDayMs * 3 + 12 * 60 * 60 * 1000),
        },
        {
            promptId: 3,
            userId: 'rating_user_14',
            content: 'Has anyone tested this with Next.js? Wondering about the performance implications.',
            createdAt: new Date(baseDate + oneDayMs * 4 + 8 * 60 * 60 * 1000),
        },
        {
            promptId: 3,
            userId: 'rating_user_19',
            content: 'This helped me create a landing page that actually converts. Thank you so much!',
            createdAt: new Date(baseDate + oneDayMs * 4 + 16 * 60 * 60 * 1000),
        },
        {
            promptId: 3,
            userId: 'rating_user_5',
            content: 'Maybe include A/B testing recommendations in the optimized prompt?',
            createdAt: new Date(baseDate + oneDayMs * 5 + 5 * 60 * 60 * 1000),
        },
        {
            promptId: 3,
            userId: 'rating_user_20',
            content: 'Consider adding payment gateway integration guidance to make it more complete.',
            createdAt: new Date(baseDate + oneDayMs * 5 + 14 * 60 * 60 * 1000),
        },
        {
            promptId: 3,
            userId: 'rating_user_8',
            content: 'Perfect timing! Just starting my online store project. This is incredibly helpful.',
            createdAt: new Date(baseDate + oneDayMs * 6 + 10 * 60 * 60 * 1000),
        },
        {
            promptId: 3,
            userId: 'rating_user_12',
            content: 'The image optimization tips in the generated response saved me so much loading time.',
            createdAt: new Date(baseDate + oneDayMs * 6 + 18 * 60 * 60 * 1000),
        },

        // Prompt 4: 4 comments (Database Schema)
        {
            promptId: 4,
            userId: 'rating_user_7',
            content: 'Excellent for designing normalized database schemas. The relationship handling is clear.',
            createdAt: new Date(baseDate + oneDayMs * 1 + 5 * 60 * 60 * 1000),
        },
        {
            promptId: 4,
            userId: 'rating_user_11',
            content: 'What database system does this work best with? PostgreSQL, MySQL, or MongoDB?',
            createdAt: new Date(baseDate + oneDayMs * 2 + 11 * 60 * 60 * 1000),
        },
        {
            promptId: 4,
            userId: 'rating_user_15',
            content: 'Good foundation but needs more emphasis on indexing strategies and query optimization.',
            createdAt: new Date(baseDate + oneDayMs * 3 + 8 * 60 * 60 * 1000),
        },
        {
            promptId: 4,
            userId: 'rating_user_3',
            content: 'Thanks for this! Really helped me think through my data relationships properly.',
            createdAt: new Date(baseDate + oneDayMs * 4 + 15 * 60 * 60 * 1000),
        },

        // Prompt 5: 6 comments (Testing Strategy)
        {
            promptId: 5,
            userId: 'rating_user_9',
            content: 'This prompt helped me create a comprehensive testing plan. Much appreciated!',
            createdAt: new Date(baseDate + oneDayMs * 1 + 6 * 60 * 60 * 1000),
        },
        {
            promptId: 5,
            userId: 'rating_user_16',
            content: 'Works great with Jest and React Testing Library. The coverage suggestions are practical.',
            createdAt: new Date(baseDate + oneDayMs * 2 + 9 * 60 * 60 * 1000),
        },
        {
            promptId: 5,
            userId: 'demo_user_1',
            content: 'Maybe add E2E testing frameworks like Playwright or Cypress to the recommendations?',
            createdAt: new Date(baseDate + oneDayMs * 3 + 13 * 60 * 60 * 1000),
        },
        {
            promptId: 5,
            userId: 'rating_user_4',
            content: 'Has anyone applied this to a CI/CD pipeline? Looking for integration tips.',
            createdAt: new Date(baseDate + oneDayMs * 4 + 7 * 60 * 60 * 1000),
        },
        {
            promptId: 5,
            userId: 'rating_user_18',
            content: 'Exactly what our team needed for standardizing our testing approach. Thank you!',
            createdAt: new Date(baseDate + oneDayMs * 5 + 12 * 60 * 60 * 1000),
        },
        {
            promptId: 5,
            userId: 'rating_user_10',
            content: 'Consider including performance testing and load testing strategies in the optimized version.',
            createdAt: new Date(baseDate + oneDayMs * 6 + 9 * 60 * 60 * 1000),
        },
    ];

    await db.insert(promptComment).values(sampleComments);
    
    console.log('✅ Comments seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});