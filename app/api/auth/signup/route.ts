import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
    try {
        const { email, password, name } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        await connectDB();

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });

        if (existingUser) {
            return NextResponse.json(
                { error: 'An account with this email already exists' },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user
        const user = await User.create({
            email: email.toLowerCase(),
            password: hashedPassword,
            name: name || undefined,
        });

        return NextResponse.json({
            success: true,
            message: 'Account created successfully',
            user: {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
            },
        });
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { error: 'Failed to create account' },
            { status: 500 }
        );
    }
}
