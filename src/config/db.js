import { MongoClient } from 'mongodb';
import dotenv from "dotenv";
dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

let db;

const connectDB = async () => {
    try {
        await client.connect();
        db = client.db('data'); // Change 'testdb' to your database name
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB Connection Failed:', error.message);
        process.exit(1);
    }
};

const getDB = () => db;

export { connectDB, getDB };