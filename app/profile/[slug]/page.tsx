"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProfileSummary from '@/components/profile/ProfileSummary';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ProfileData {
    fullName: string;
    dob: string;
    sports: string[];
    gender: string;
    nationality: string;
    address: string;
    height: string;
    weight: string;
    dominantHand: string;
    disability: string;
    disabilityDesc: string;
    wingspan: string;
    agilityRating: string;
    profilePicUrl: string;
    sportStats: Record<string, any>;
    bio: string;
    languages: string[];
    strengths: string[];
    strengthDescription: string;
    weaknesses: string[];
    weaknessDescription: string;
    socialLinks: { facebook: string; instagram: string; twitter: string; linkedin: string };
    participations: any[];
    achievements: any[];
    media: any[];
    playerJourney: string;
}

export default function PublicProfilePage() {
    const params = useParams();
    const slug = params.slug as string;

    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`/api/profile/${slug}`);
                const data = await response.json();

                if (!response.ok) {
                    setError(data.error || 'Profile not found');
                } else {
                    setProfile(data.profile);
                }
            } catch (err) {
                setError('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchProfile();
        }
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 size={40} className="text-lime-500 animate-spin" />
                    <p className="text-gray-400">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <div className="max-w-md text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-full mb-4">
                        <AlertCircle size={32} className="text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Profile Not Found</h1>
                    <p className="text-gray-400 mb-6">{error || 'The profile you\'re looking for doesn\'t exist or has been removed.'}</p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-lime-500 text-black font-bold rounded-lg hover:brightness-110 transition-all"
                    >
                        <ArrowLeft size={18} />
                        Go Home
                    </Link>
                </div>
            </div>
        );
    }

    // Convert profile data to FormData format for ProfileSummary
    const formData = {
        fullName: profile.fullName,
        dob: profile.dob,
        sports: profile.sports || [],
        contactNo: '', // Hidden for public view
        countryCode: '',
        gender: profile.gender,
        email: '', // Hidden for public view
        nationality: profile.nationality,
        address: profile.address,
        height: profile.height,
        weight: profile.weight,
        dominantHand: profile.dominantHand,
        disability: profile.disability,
        disabilityDesc: profile.disabilityDesc,
        wingspan: profile.wingspan,
        agilityRating: profile.agilityRating,
        sportStats: profile.sportStats || {},
        bio: profile.bio,
        languages: profile.languages || [],
        strengths: profile.strengths || [],
        strengthDescription: profile.strengthDescription,
        weaknesses: profile.weaknesses || [],
        weaknessDescription: profile.weaknessDescription,
        socialLinks: profile.socialLinks || { facebook: '', instagram: '', twitter: '', linkedin: '' },
        participations: profile.participations || [],
        achievements: profile.achievements || [],
        media: profile.media || [],
        playerJourney: profile.playerJourney,
    };

    // Calculate BMI
    const calculateBMI = () => {
        const h = parseFloat(profile.height);
        const w = parseFloat(profile.weight);
        if (h > 0 && w > 0) {
            const hM = h / 100;
            const bmiVal = parseFloat((w / (hM * hM)).toFixed(1));
            let s = "Normal", c = "text-lime-500";
            if (bmiVal < 18.5) { s = "Underweight"; c = "text-red-500"; }
            else if (bmiVal >= 25 && bmiVal < 30) { s = "Overweight"; c = "text-yellow-500"; }
            else if (bmiVal >= 30) { s = "Obesity"; c = "text-red-500"; }
            return { value: bmiVal.toString(), status: s, color: c };
        }
        return { value: "", status: "", color: "text-gray-500" };
    };

    return (
        <div className="min-h-screen bg-black">
            {/* Public Profile Banner */}
            <div className="bg-lime-500/10 border-b border-lime-500/30 py-2 text-center">
                <p className="text-lime-500 text-sm font-medium">
                    📌 Public Profile View
                </p>
            </div>

            <ProfileSummary
                data={formData as any}
                bmiData={calculateBMI()}
                image={profile.profilePicUrl}
                units={{ height: "cm", weight: "kg" }}
                onEdit={() => { }} // No edit for public view
            />
        </div>
    );
}
