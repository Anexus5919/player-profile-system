
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(process.cwd(), '.env.local');
let mongoUri = '';

try {
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/MONGODB_URI=(.+)/);
        if (match) {
            mongoUri = match[1].trim().replace(/["']/g, '');
        }
    }
} catch (e) {
    console.error("Error reading .env.local", e);
}

if (!mongoUri) {
    console.error("MONGODB_URI not found in .env.local");
    // Fallback or exit
    process.exit(1);
}

const profileSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    contactNo: String,
    identityFileUrl: String,
    shareableSlug: String,
    isPublic: Boolean,
    userId: mongoose.Schema.Types.ObjectId
}, { strict: false });

const Profile = mongoose.models.Profile || mongoose.model('Profile', profileSchema);

async function checkProfiles() {
    try {
        console.log("Connecting to DB...");
        await mongoose.connect(mongoUri);
        console.log("Connected to DB");

        const profiles = await Profile.find({}).sort({ _id: -1 }).limit(1);

        if (profiles.length === 0) {
            console.log("No profiles found.");
        } else {
            const p = profiles[0];
            console.log("Latest Profile found:");
            console.log("ID:", p._id);
            console.log("Name:", p.fullName);
            console.log("Email:", p.email || "MISSING");
            console.log("Contact:", p.contactNo || "MISSING");
            console.log("Identity URL:", p.identityFileUrl || "MISSING");
            console.log("Slug:", p.shareableSlug);
        }
    } catch (error) {
        console.error("Error:", error);
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
        process.exit();
    }
}

checkProfiles();
