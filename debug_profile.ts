
import { connect } from 'mongoose';
import Profile from './models/Profile';

async function checkProfiles() {
    try {
        await connect(process.env.MONGODB_URI || '');
        console.log("Connected to DB");

        const profiles = await Profile.find({}).sort({ _id: -1 }).limit(1);

        if (profiles.length === 0) {
            console.log("No profiles found.");
        } else {
            const p = profiles[0];
            console.log("Latest Profile:");
            console.log("Name:", p.fullName);
            console.log("Email:", p.email);
            console.log("Contact:", p.contactNo);
            console.log("Identity URL:", p.identityFileUrl);
            console.log("Identity Name:", p.identityFileName);
            console.log("Is Public:", p.isPublic);
            console.log("Slug:", p.shareableSlug);
        }
    } catch (error) {
        console.error("Error:", error);
    } finally {
        process.exit();
    }
}

checkProfiles();
