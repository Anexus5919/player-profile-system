import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Profile from '@/models/Profile';

// GET - Fetch public profile by slug
export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        const { slug } = params;

        await connectDB();

        const profile = await Profile.findOne({ shareableSlug: slug });

        if (!profile) {
            return NextResponse.json(
                { error: 'Profile not found' },
                { status: 404 }
            );
        }

        if (!profile.isPublic) {
            return NextResponse.json(
                { error: 'This profile is private' },
                { status: 403 }
            );
        }

        // Return profile without sensitive data
        const publicProfile = {
            fullName: profile.fullName,
            dob: profile.dob,
            sports: profile.sports,
            gender: profile.gender,
            nationality: profile.nationality,
            address: profile.address,
            height: profile.height,
            weight: profile.weight,
            dominantHand: profile.dominantHand,
            disability: profile.disability,
            disabilityDesc: profile.disabilityDesc,
            wingspan: profile.wingspan,
            agilityRating: profile.agilityRating,
            profilePicUrl: profile.profilePicUrl,
            sportStats: profile.sportStats,
            bio: profile.bio,
            languages: profile.languages,
            strengths: profile.strengths,
            strengthDescription: profile.strengthDescription,
            weaknesses: profile.weaknesses,
            weaknessDescription: profile.weaknessDescription,
            socialLinks: profile.socialLinks,
            participations: profile.participations,
            achievements: profile.achievements,
            media: profile.media,
            playerJourney: profile.playerJourney,
        };

        return NextResponse.json({
            profile: publicProfile,
        });
    } catch (error) {
        console.error('Get public profile error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch profile' },
            { status: 500 }
        );
    }
}
