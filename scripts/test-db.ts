import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
if (!process.env.MONGODB_URI) {
    dotenv.config({ path: '.env.example' });
}

async function main() {
    const { default: connectToDatabase } = await import('../src/lib/mongoose');
    try {
        await connectToDatabase();
        console.log("DB connection successful!");
        process.exit(0);
    } catch (e) {
        console.error("DB connection failed:", e);
        process.exit(1);
    }
}

main();
