import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Profile from '@/models/Profile';

export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        // Robust slug extraction
        let slug;

        try {
            const resolvedParams: any = await params;
            slug = resolvedParams?.slug;
        } catch (e) {
            console.log("Params await failed", e);
        }

        if (!slug) {
            const pathname = request.nextUrl.pathname;
            // Path is /api/public-profile/[slug]
            slug = pathname.split('/').pop();
            console.log("API: Extracted slug from URL:", slug);
        }

        console.log("API: Fetching public profile for slug:", slug);

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

        console.log("API: Found profile:", profile.fullName);
        console.log("API: Email:", profile.email, "Phone:", profile.contactNo);
        console.log("API: Identity:", profile.identityFileUrl);

        // Return profile without sensitive data
        const publicProfile = {
            fullName: profile.fullName,
            dob: profile.dob,
            sports: profile.sports,
            gender: profile.gender,
            nationality: profile.nationality,
            address: profile.address,
            contactNo: profile.contactNo,
            countryCode: profile.countryCode,
            email: profile.email,
            height: profile.height,
            weight: profile.weight,
            dominantHand: profile.dominantHand,
            disability: profile.disability,
            disabilityDesc: profile.disabilityDesc,
            wingspan: profile.wingspan,
            agilityRating: profile.agilityRating,
            profilePicUrl: profile.profilePicUrl,
            identityFileUrl: profile.identityFileUrl,
            identityFileName: profile.identityFileName,
            identityFilePublicId: profile.identityFilePublicId,
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
            shareableSlug: profile.shareableSlug, // useful for confirmation
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
