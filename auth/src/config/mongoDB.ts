import mongoose from 'mongoose';

export const connection = async () => {
    const MONGO_URI = process.env.MONGO_URI!;
    try {
        mongoose.set('strictQuery', true);
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected...')
    } catch (err) {
        console.error(err);
    }
}