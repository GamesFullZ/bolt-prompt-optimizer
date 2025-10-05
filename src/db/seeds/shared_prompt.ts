import { db } from '@/db';
import { user, sharedPrompt } from '@/db/schema';

async function main() {
    // First, create demo user if not exists
    const demoUser = {
        id: 'demo_user_1',
        name: 'Demo User',
        email: 'demo@example.com',
        emailVerified: false,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    await db.insert(user).values(demoUser).onConflictDoNothing();

    // Generate timestamps for the past 7 days
    const now = Date.now();
    const dayInMs = 24 * 60 * 60 * 1000;

    const samplePrompts = [
        {
            title: 'Modern SaaS Landing Page',
            originalText: 'create a landing page for my saas app with hero section and pricing',
            optimizedPrompt: 'Create a modern, responsive landing page for a SaaS application with the following sections: 1) Hero section with compelling headline, subheadline, and CTA button using gradient background, 2) Features section highlighting 3-4 key benefits with animated icons, 3) Pricing table with 3 tiers (Starter, Pro, Enterprise) including feature comparison, 4) Social proof section with customer testimonials and company logos, 5) Footer with links and contact info. Use a clean color scheme with primary brand color #3B82F6. Include smooth scroll animations, hover effects, and mobile-responsive design with Tailwind CSS.',
            style: 'professional',
            tone: 'friendly',
            responseType: 'detailed',
            context: 'landing page',
            authorId: 'demo_user_1',
            createdAt: new Date(now - 1 * dayInMs),
            updatedAt: new Date(now - 1 * dayInMs),
            avgRating: 4.8,
            ratingsCount: 23,
            commentsCount: 12,
            isActive: true,
        },
        {
            title: 'React Admin Dashboard with Analytics',
            originalText: 'need a dashboard with charts and user data table',
            optimizedPrompt: 'Build a comprehensive React admin dashboard with the following components: 1) Sidebar navigation with collapsible menu items and active state indicators, 2) Top navigation bar with search, notifications, and user profile dropdown, 3) Analytics section with 4 metric cards (Total Users, Revenue, Active Sessions, Conversion Rate), 4) Interactive charts using Recharts library including a line chart for revenue trends and bar chart for user growth, 5) Data table with sorting, filtering, and pagination for user management. Use React with TypeScript, Tailwind CSS for styling, and implement responsive design for mobile and tablet views. Include loading states and error handling.',
            style: 'technical',
            tone: 'direct',
            responseType: 'step-by-step',
            context: 'dashboard',
            authorId: 'demo_user_1',
            createdAt: new Date(now - 3 * dayInMs),
            updatedAt: new Date(now - 3 * dayInMs),
            avgRating: 4.6,
            ratingsCount: 18,
            commentsCount: 8,
            isActive: true,
        },
        {
            title: 'Full-Stack Authentication System',
            originalText: 'authentication with login and signup pages',
            optimizedPrompt: 'Implement a complete authentication system with the following features: 1) Login page with email/password fields, remember me checkbox, and forgot password link, 2) Signup page with form validation (email format, password strength meter, confirm password), 3) Password reset flow with email verification, 4) OAuth integration for Google and GitHub login options, 5) Protected routes with middleware, 6) Session management using JWT tokens, 7) User profile page with ability to update information. Use Next.js 14 with App Router, Better Auth for authentication, and include proper error messages, loading states, and success notifications. Style with Tailwind CSS and shadcn/ui components.',
            style: 'technical',
            tone: 'formal',
            responseType: 'detailed',
            context: 'web development',
            authorId: 'demo_user_1',
            createdAt: new Date(now - 5 * dayInMs),
            updatedAt: new Date(now - 5 * dayInMs),
            avgRating: 4.9,
            ratingsCount: 25,
            commentsCount: 15,
            isActive: true,
        },
        {
            title: 'Modern Blog Platform',
            originalText: 'blog site with posts and categories',
            optimizedPrompt: 'Create a feature-rich blog platform with these components: 1) Homepage displaying recent posts in a masonry grid layout with featured image, title, excerpt, author info, and read time, 2) Individual post page with markdown support, table of contents, related posts sidebar, and social sharing buttons, 3) Category and tag filtering system with dynamic routing, 4) Search functionality with debounced input and instant results, 5) Author profile pages showing bio and all posts, 6) Comment section with nested replies and reaction buttons, 7) Admin panel for creating/editing posts with rich text editor. Build with Next.js, use MDX for content, implement SEO optimization with proper meta tags, and ensure fast page loads with image optimization.',
            style: 'creative',
            tone: 'enthusiastic',
            responseType: 'with-examples',
            context: 'web development',
            authorId: 'demo_user_1',
            createdAt: new Date(now - 2 * dayInMs),
            updatedAt: new Date(now - 2 * dayInMs),
            avgRating: 4.5,
            ratingsCount: 16,
            commentsCount: 9,
            isActive: true,
        },
        {
            title: 'E-commerce Product Page',
            originalText: 'product page with images and add to cart',
            optimizedPrompt: 'Design a conversion-optimized e-commerce product page with: 1) Image gallery with main product image, thumbnail navigation, and zoom functionality on hover, 2) Product details section including title, price with any discounts, rating stars with review count, and availability status, 3) Size/color variant selector with visual swatches, 4) Quantity selector and prominent Add to Cart button with loading state, 5) Accordion sections for product description, specifications, shipping info, and return policy, 6) Customer reviews section with filtering options and helpful vote buttons, 7) Related products carousel, 8) Sticky add-to-cart bar on mobile scroll. Use React with TypeScript, implement shopping cart state management, add product to wishlist functionality, and ensure mobile-first responsive design with smooth animations.',
            style: 'professional',
            tone: 'friendly',
            responseType: 'detailed',
            context: 'web development',
            authorId: 'demo_user_1',
            createdAt: new Date(now - 6 * dayInMs),
            updatedAt: new Date(now - 6 * dayInMs),
            avgRating: 4.7,
            ratingsCount: 20,
            commentsCount: 11,
            isActive: true,
        },
    ];

    await db.insert(sharedPrompt).values(samplePrompts);

    console.log('✅ Shared prompts seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});