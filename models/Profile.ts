import mongoose, { Schema, Document, Model } from 'mongoose';

// Sub-schemas
const MediaItemSchema = new Schema({
    id: String,
    type: { type: String, enum: ['image', 'video', 'certificate', 'link'] },
    url: String,
    caption: String,
    thumbnail: String,
    publicId: String, // Cloudinary public ID for deletion
});

const ParticipationSchema = new Schema({
    id: String,
    tournamentName: String,
    level: String,
    date: String,
    location: String,
    result: String,
    story: String,
    media: [MediaItemSchema],
});

const AchievementSchema = new Schema({
    id: String,
    title: String,
    organization: String,
    date: String,
    description: String,
    certificateUrl: String,
    certificateName: String,
    publicId: String, // Cloudinary public ID
});

const SportStatsSchema = new Schema({
    matchesPlayed: String,
    wins: String,
    loss: String,
    draws: String,
}, { strict: false }); // Allow extra fields for custom stats

const SocialLinksSchema = new Schema({
    facebook: String,
    instagram: String,
    twitter: String,
    linkedin: String,
});

export interface IProfile extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    shareableSlug: string;
    isPublic: boolean;

    // Personal Info
    fullName: string;
    dob: string;
    sports: string[];
    contactNo: string;
    countryCode: string;
    gender: string;
    email: string;
    nationality: string;
    address: string;

    // Physical Stats
    height: string;
    weight: string;
    dominantHand: string;
    disability: string;
    disabilityDesc: string;
    wingspan: string;
    agilityRating: string;

    // Profile Picture
    profilePicUrl: string;
    profilePicPublicId: string;

    // Identity Proof
    identityFileUrl: string;
    identityFileName: string;
    identityFilePublicId: string;

    // Sport Stats
    sportStats: Record<string, typeof SportStatsSchema>;

    // Bio
    bio: string;
    languages: string[];
    strengths: string[];
    strengthDescription: string;
    weaknesses: string[];
    weaknessDescription: string;
    socialLinks: typeof SocialLinksSchema;

    // Records
    participations: typeof ParticipationSchema[];
    achievements: typeof AchievementSchema[];

    // Media
    media: typeof MediaItemSchema[];
    playerJourney: string;

    createdAt: Date;
    updatedAt: Date;
}

const ProfileSchema = new Schema<IProfile>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        shareableSlug: {
            type: String,
            unique: true,
            sparse: true,
        },
        isPublic: {
            type: Boolean,
            default: true,
        },

        // Personal Info
        fullName: { type: String, required: true },
        dob: String,
        sports: [String],
        contactNo: String,
        countryCode: { type: String, default: '+91' },
        gender: String,
        email: String,
        nationality: { type: String, default: 'Indian' },
        address: String,

        // Physical Stats
        height: String,
        weight: String,
        dominantHand: String,
        disability: { type: String, default: 'No' },
        disabilityDesc: String,
        wingspan: String,
        agilityRating: String,

        // Profile Picture
        profilePicUrl: String,
        profilePicPublicId: String,

        // Identity Proof
        identityFileUrl: String,
        identityFileName: String,
        identityFilePublicId: String,

        // Sport Stats
        sportStats: {
            type: Map,
            of: SportStatsSchema,
            default: {},
        },

        // Bio
        bio: String,
        languages: [String],
        strengths: [String],
        strengthDescription: String,
        weaknesses: [String],
        weaknessDescription: String,
        socialLinks: SocialLinksSchema,

        // Records
        participations: [ParticipationSchema],
        achievements: [AchievementSchema],

        // Media
        media: [MediaItemSchema],
        playerJourney: String,
    },
    {
        timestamps: true,
    }
);

// Generate shareable slug before saving
// Generate shareable slug before saving
ProfileSchema.pre('save', async function () {
    if (!this.shareableSlug && this.fullName) {
        const slug = this.fullName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        this.shareableSlug = `${slug}-${this._id.toString().slice(-6)}`;
    }
});

const Profile: Model<IProfile> = mongoose.models.Profile || mongoose.model<IProfile>('Profile', ProfileSchema);

export default Profile;
