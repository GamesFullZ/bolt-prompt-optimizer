import { db } from '@/db';
import { user, promptRating } from '@/db/schema';

async function main() {
    // First, create demo users for ratings
    const demoUsers = [
        { id: 'rating_user_1', name: 'User 1', email: 'user1@example.com', emailVerified: false, image: null, createdAt: new Date(), updatedAt: new Date() },
        { id: 'rating_user_2', name: 'User 2', email: 'user2@example.com', emailVerified: false, image: null, createdAt: new Date(), updatedAt: new Date() },
        { id: 'rating_user_3', name: 'User 3', email: 'user3@example.com', emailVerified: false, image: null, createdAt: new Date(), updatedAt: new Date() },
        { id: 'rating_user_4', name: 'User 4', email: 'user4@example.com', emailVerified: false, image: null, createdAt: new Date(), updatedAt: new Date() },
        { id: 'rating_user_5', name: 'User 5', email: 'user5@example.com', emailVerified: false, image: null, createdAt: new Date(), updatedAt: new Date() },
        { id: 'rating_user_6', name: 'User 6', email: 'user6@example.com', emailVerified: false, image: null, createdAt: new Date(), updatedAt: new Date() },
        { id: 'rating_user_7', name: 'User 7', email: 'user7@example.com', emailVerified: false, image: null, createdAt: new Date(), updatedAt: new Date() },
        { id: 'rating_user_8', name: 'User 8', email: 'user8@example.com', emailVerified: false, image: null, createdAt: new Date(), updatedAt: new Date() },
        { id: 'rating_user_9', name: 'User 9', email: 'user9@example.com', emailVerified: false, image: null, createdAt: new Date(), updatedAt: new Date() },
        { id: 'rating_user_10', name: 'User 10', email: 'user10@example.com', emailVerified: false, image: null, createdAt: new Date(), updatedAt: new Date() },
        { id: 'rating_user_11', name: 'User 11', email: 'user11@example.com', emailVerified: false, image: null, createdAt: new Date(), updatedAt: new Date() },
        { id: 'rating_user_12', name: 'User 12', email: 'user12@example.com', emailVerified: false, image: null, createdAt: new Date(), updatedAt: new Date() },
        { id: 'rating_user_13', name: 'User 13', email: 'user13@example.com', emailVerified: false, image: null, createdAt: new Date(), updatedAt: new Date() },
        { id: 'rating_user_14', name: 'User 14', email: 'user14@example.com', emailVerified: false, image: null, createdAt: new Date(), updatedAt: new Date() },
        { id: 'rating_user_15', name: 'User 15', email: 'user15@example.com', emailVerified: false, image: null, createdAt: new Date(), updatedAt: new Date() },
        { id: 'rating_user_16', name: 'User 16', email: 'user16@example.com', emailVerified: false, image: null, createdAt: new Date(), updatedAt: new Date() },
        { id: 'rating_user_17', name: 'User 17', email: 'user17@example.com', emailVerified: false, image: null, createdAt: new Date(), updatedAt: new Date() },
        { id: 'rating_user_18', name: 'User 18', email: 'user18@example.com', emailVerified: false, image: null, createdAt: new Date(), updatedAt: new Date() },
        { id: 'rating_user_19', name: 'User 19', email: 'user19@example.com', emailVerified: false, image: null, createdAt: new Date(), updatedAt: new Date() },
        { id: 'rating_user_20', name: 'User 20', email: 'user20@example.com', emailVerified: false, image: null, createdAt: new Date(), updatedAt: new Date() },
    ];

    await db.insert(user).values(demoUsers);

    // Generate timestamps over past 7 days
    const now = Date.now();
    const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
    
    const getRandomTimestamp = (index: number, total: number) => {
        const range = now - sevenDaysAgo;
        const step = range / total;
        return new Date(sevenDaysAgo + (step * index) + Math.random() * step);
    };

    const sampleRatings = [
        // Prompt 1: 15 ratings, avg ~4.5 (8x5, 6x4, 1x3)
        { promptId: 1, userId: 'rating_user_1', value: 5, createdAt: getRandomTimestamp(0, 15) },
        { promptId: 1, userId: 'rating_user_2', value: 5, createdAt: getRandomTimestamp(1, 15) },
        { promptId: 1, userId: 'rating_user_3', value: 5, createdAt: getRandomTimestamp(2, 15) },
        { promptId: 1, userId: 'rating_user_4', value: 5, createdAt: getRandomTimestamp(3, 15) },
        { promptId: 1, userId: 'rating_user_5', value: 5, createdAt: getRandomTimestamp(4, 15) },
        { promptId: 1, userId: 'rating_user_6', value: 5, createdAt: getRandomTimestamp(5, 15) },
        { promptId: 1, userId: 'rating_user_7', value: 5, createdAt: getRandomTimestamp(6, 15) },
        { promptId: 1, userId: 'rating_user_8', value: 5, createdAt: getRandomTimestamp(7, 15) },
        { promptId: 1, userId: 'rating_user_9', value: 4, createdAt: getRandomTimestamp(8, 15) },
        { promptId: 1, userId: 'rating_user_10', value: 4, createdAt: getRandomTimestamp(9, 15) },
        { promptId: 1, userId: 'rating_user_11', value: 4, createdAt: getRandomTimestamp(10, 15) },
        { promptId: 1, userId: 'rating_user_12', value: 4, createdAt: getRandomTimestamp(11, 15) },
        { promptId: 1, userId: 'rating_user_13', value: 4, createdAt: getRandomTimestamp(12, 15) },
        { promptId: 1, userId: 'rating_user_14', value: 4, createdAt: getRandomTimestamp(13, 15) },
        { promptId: 1, userId: 'rating_user_15', value: 3, createdAt: getRandomTimestamp(14, 15) },

        // Prompt 2: 12 ratings, avg ~4.2 (5x5, 5x4, 2x3)
        { promptId: 2, userId: 'rating_user_1', value: 5, createdAt: getRandomTimestamp(0, 12) },
        { promptId: 2, userId: 'rating_user_2', value: 5, createdAt: getRandomTimestamp(1, 12) },
        { promptId: 2, userId: 'rating_user_3', value: 5, createdAt: getRandomTimestamp(2, 12) },
        { promptId: 2, userId: 'rating_user_4', value: 5, createdAt: getRandomTimestamp(3, 12) },
        { promptId: 2, userId: 'rating_user_5', value: 5, createdAt: getRandomTimestamp(4, 12) },
        { promptId: 2, userId: 'rating_user_6', value: 4, createdAt: getRandomTimestamp(5, 12) },
        { promptId: 2, userId: 'rating_user_7', value: 4, createdAt: getRandomTimestamp(6, 12) },
        { promptId: 2, userId: 'rating_user_8', value: 4, createdAt: getRandomTimestamp(7, 12) },
        { promptId: 2, userId: 'rating_user_9', value: 4, createdAt: getRandomTimestamp(8, 12) },
        { promptId: 2, userId: 'rating_user_10', value: 4, createdAt: getRandomTimestamp(9, 12) },
        { promptId: 2, userId: 'rating_user_11', value: 3, createdAt: getRandomTimestamp(10, 12) },
        { promptId: 2, userId: 'rating_user_12', value: 3, createdAt: getRandomTimestamp(11, 12) },

        // Prompt 3: 8 ratings, avg ~4.7 (6x5, 2x4)
        { promptId: 3, userId: 'rating_user_1', value: 5, createdAt: getRandomTimestamp(0, 8) },
        { promptId: 3, userId: 'rating_user_2', value: 5, createdAt: getRandomTimestamp(1, 8) },
        { promptId: 3, userId: 'rating_user_3', value: 5, createdAt: getRandomTimestamp(2, 8) },
        { promptId: 3, userId: 'rating_user_4', value: 5, createdAt: getRandomTimestamp(3, 8) },
        { promptId: 3, userId: 'rating_user_5', value: 5, createdAt: getRandomTimestamp(4, 8) },
        { promptId: 3, userId: 'rating_user_6', value: 5, createdAt: getRandomTimestamp(5, 8) },
        { promptId: 3, userId: 'rating_user_7', value: 4, createdAt: getRandomTimestamp(6, 8) },
        { promptId: 3, userId: 'rating_user_8', value: 4, createdAt: getRandomTimestamp(7, 8) },

        // Prompt 4: 10 ratings, avg ~3.8 (2x5, 4x4, 3x3, 1x2)
        { promptId: 4, userId: 'rating_user_1', value: 5, createdAt: getRandomTimestamp(0, 10) },
        { promptId: 4, userId: 'rating_user_2', value: 5, createdAt: getRandomTimestamp(1, 10) },
        { promptId: 4, userId: 'rating_user_3', value: 4, createdAt: getRandomTimestamp(2, 10) },
        { promptId: 4, userId: 'rating_user_4', value: 4, createdAt: getRandomTimestamp(3, 10) },
        { promptId: 4, userId: 'rating_user_5', value: 4, createdAt: getRandomTimestamp(4, 10) },
        { promptId: 4, userId: 'rating_user_6', value: 4, createdAt: getRandomTimestamp(5, 10) },
        { promptId: 4, userId: 'rating_user_7', value: 3, createdAt: getRandomTimestamp(6, 10) },
        { promptId: 4, userId: 'rating_user_8', value: 3, createdAt: getRandomTimestamp(7, 10) },
        { promptId: 4, userId: 'rating_user_9', value: 3, createdAt: getRandomTimestamp(8, 10) },
        { promptId: 4, userId: 'rating_user_10', value: 2, createdAt: getRandomTimestamp(9, 10) },

        // Prompt 5: 6 ratings, avg ~4.0 (2x5, 2x4, 2x3)
        { promptId: 5, userId: 'rating_user_1', value: 5, createdAt: getRandomTimestamp(0, 6) },
        { promptId: 5, userId: 'rating_user_2', value: 5, createdAt: getRandomTimestamp(1, 6) },
        { promptId: 5, userId: 'rating_user_3', value: 4, createdAt: getRandomTimestamp(2, 6) },
        { promptId: 5, userId: 'rating_user_4', value: 4, createdAt: getRandomTimestamp(3, 6) },
        { promptId: 5, userId: 'rating_user_5', value: 3, createdAt: getRandomTimestamp(4, 6) },
        { promptId: 5, userId: 'rating_user_6', value: 3, createdAt: getRandomTimestamp(5, 6) },
    ];

    await db.insert(promptRating).values(sampleRatings);
    
    console.log('✅ Prompt ratings seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});