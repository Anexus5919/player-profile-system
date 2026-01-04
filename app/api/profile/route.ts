import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Profile from '@/models/Profile';
import User from '@/models/User';

// GET - Fetch current user's profile
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        const profile = await Profile.findOne({ userId: (session.user as any).id });

        if (!profile) {
            return NextResponse.json(
                { profile: null, hasProfile: false },
                { status: 200 }
            );
        }

        return NextResponse.json({
            profile,
            hasProfile: true,
        });
    } catch (error) {
        console.error('Get profile error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch profile' },
            { status: 500 }
        );
    }
}

// POST - Create or update profile
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const data = await request.json();
        const userId = (session.user as any).id;

        await connectDB();

        // Check if profile exists
        let profile = await Profile.findOne({ userId });

        if (profile) {
            // Update existing profile
            Object.assign(profile, data);
            await profile.save();
        } else {
            // Create new profile
            profile = await Profile.create({
                ...data,
                userId,
            });

            // Update user with profileId
            await User.findByIdAndUpdate(userId, { profileId: profile._id });
        }

        return NextResponse.json({
            success: true,
            profile,
            shareableUrl: `/profile/${profile.shareableSlug}`,
        });
    } catch (error: any) {
        console.error('Save profile error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to save profile', details: error },
            { status: 500 }
        );
    }
}

// DELETE - Delete profile
export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const userId = (session.user as any).id;

        await connectDB();

        await Profile.findOneAndDelete({ userId });
        await User.findByIdAndUpdate(userId, { $unset: { profileId: 1 } });

        return NextResponse.json({
            success: true,
            message: 'Profile deleted',
        });
    } catch (error) {
        console.error('Delete profile error:', error);
        return NextResponse.json(
            { error: 'Failed to delete profile' },
            { status: 500 }
        );
    }
}
