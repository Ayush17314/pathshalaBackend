import mongoose from 'mongoose';
import Subject from '../models/Subject_diff.js';
import dotenv from 'dotenv';

dotenv.config();

const subjects = [
    { name: 'Mathematics', category: 'Science' },
    { name: 'Physics', category: 'Science' },
    { name: 'Chemistry', category: 'Science' },
    { name: 'Biology', category: 'Science' },
    { name: 'English', category: 'Languages' },
    { name: 'Hindi', category: 'Languages' },
    { name: 'History', category: 'Social Studies' },
    { name: 'Geography', category: 'Social Studies' },
    { name: 'Computer Science', category: 'Technology' },
    { name: 'Economics', category: 'Commerce' },
    { name: 'Accountancy', category: 'Commerce' },
    { name: 'Business Studies', category: 'Commerce' }
];

const seedSubjects = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        await Subject.deleteMany({});
        await Subject.insertMany(subjects);
        console.log('Subjects seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding subjects:', error);
        process.exit(1);
    }
};

seedSubjects();