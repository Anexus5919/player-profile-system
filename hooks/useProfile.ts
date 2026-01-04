"use client";

import { useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { FormData } from '@/components/profile/CreateProfile';

interface UseProfileReturn {
    loading: boolean;
    saving: boolean;
    error: string | null;
    shareableUrl: string | null;
    hasProfile: boolean;
    fetchProfile: () => Promise<FormData | null>;
    saveProfile: (data: FormData) => Promise<{ success: boolean; shareableUrl?: string; error?: string }>;
    deleteProfile: () => Promise<boolean>;
}

export function useProfile(): UseProfileReturn {
    const { isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [shareableUrl, setShareableUrl] = useState<string | null>(null);
    const [hasProfile, setHasProfile] = useState(false);

    const fetchProfile = useCallback(async (): Promise<FormData | null> => {
        if (!isAuthenticated) return null;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/profile');
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch profile');
            }

            setHasProfile(data.hasProfile);

            if (data.profile?.shareableSlug) {
                setShareableUrl(`/profile/${data.profile.shareableSlug}`);
            }

            return data.profile;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to fetch profile';
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    const saveProfile = useCallback(async (data: FormData): Promise<{ success: boolean; shareableUrl?: string; error?: string }> => {
        if (!isAuthenticated) {
            setError('Please log in to save your profile');
            return { success: false };
        }

        setSaving(true);
        setError(null);

        try {
            const response = await fetch('/api/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to save profile');
            }

            setHasProfile(true);
            setShareableUrl(result.shareableUrl);

            return { success: true, shareableUrl: result.shareableUrl };
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to save profile';
            console.error("useProfile save error:", err);
            setError(message);
            return { success: false, error: message };
        } finally {
            setSaving(false);
        }
    }, [isAuthenticated]);

    const deleteProfile = useCallback(async (): Promise<boolean> => {
        if (!isAuthenticated) return false;

        try {
            const response = await fetch('/api/profile', { method: 'DELETE' });

            if (!response.ok) {
                throw new Error('Failed to delete profile');
            }

            setHasProfile(false);
            setShareableUrl(null);
            return true;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to delete profile';
            setError(message);
            return false;
        }
    }, [isAuthenticated]);

    return {
        loading,
        saving,
        error,
        shareableUrl,
        hasProfile,
        fetchProfile,
        saveProfile,
        deleteProfile,
    };
}
