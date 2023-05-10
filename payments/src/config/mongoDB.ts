import mongoose from 'mongoose';

export const mongoDBConnection = async () => {
    const MONGO_URI = process.env.MONGO_URI!;
    //console.log('MONGO_URI: ', MONGO_URI);
    try {
        mongoose.set('strictQuery', true);
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected...')
    } catch (err) {
        console.error(err);
    }
}