import mongoose from 'mongoose';
import Subject from '../models/subject.js';
import dotenv from 'dotenv';

dotenv.config();

const subjects = [
    { name: 'Mathematics', code: 'MATH101', category: 'Science', icon: '📐', color: '#FF6B6B' },
    { name: 'Physics', code: 'PHY101', category: 'Science', icon: '⚡', color: '#4ECDC4' },
    { name: 'Chemistry', code: 'CHE101', category: 'Science', icon: '🧪', color: '#45B7D1' },
    { name: 'Biology', code: 'BIO101', category: 'Science', icon: '🧬', color: '#96CEB4' },
    { name: 'English', code: 'ENG101', category: 'Languages', icon: '📖', color: '#FFEAA7' },
    { name: 'Hindi', code: 'HIN101', category: 'Languages', icon: '📚', color: '#DDA0DD' },
    { name: 'History', code: 'HIS101', category: 'Social Studies', icon: '🏛️', color: '#FFB347' },
    { name: 'Geography', code: 'GEO101', category: 'Social Studies', icon: '🌍', color: '#87CEEB' },
    { name: 'Computer Science', code: 'CS101', category: 'Technology', icon: '💻', color: '#6C5CE7' },
    { name: 'Economics', code: 'ECO101', category: 'Commerce', icon: '📊', color: '#A8E6CF' }
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