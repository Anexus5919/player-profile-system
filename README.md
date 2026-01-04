# Player Profile System

A comprehensive web application designed for athletes to create, manage, and showcase their professional sports profiles. This platform allows players to highlight their career statistics, achievements, physical attributes, and media in a structured, shareable format perfect for scouts, coaches, and teams.

## 🚀 Overview

The Player Profile System empowers athletes to build a digital resume. With a clean, modern interface, users can input detailed information about their sporting career, from physical stats to tournament participations. The system generates a public, shareable profile page, making it easy for athletes to demonstrate their potential to the world.

## ✨ Features

- **User Authentication**: Secure Sign-up and Login functionality using NextAuth.js.
- **Dynamic Profile Management**:
  - **Personal Information**: Manage basic details, contact info, and demographics.
  - **Physical Statistics**: Track height, weight, wingspan, agility, and other physical attributes.
  - **Sport-Specific Stats**: Customizable statistics log for various sports.
  - **Biography & Journey**: Tell your story, including strengths, weaknesses, and languages known.
- **Career Tracking**:
  - **Participations**: Log tournaments, matches, and events with results and locations.
  - **Achievements**: Showcase awards, titles, and certifications.
- **Media Gallery**: Integrated Cloudinary support for uploading and displaying photos, videos, and certificates.
- **Social Integration**: Link your Facebook, Instagram, Twitter, and LinkedIn profiles.
- **Public Share Links**: Auto-generated unique URLs/slugs for public profile sharing.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop viewing.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Database**: [MongoDB](https://www.mongodb.com/) (with [Mongoose](https://mongoosejs.com/))
- **File Storage**: [Cloudinary](https://cloudinary.com/)
- **Animations**: Motion

## ⚙️ Pre-requisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A [MongoDB](https://www.mongodb.com/atlas/database) database URI
- A [Cloudinary](https://cloudinary.com/) account for media storage

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/player-profile-system.git
   cd player-profile-system
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup:**
   Create a `.env.local` file in the root directory and add the following variables:

   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string

   # Authentication
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_auth_secret_key

   # Cloudinary (for image/media uploads)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```

5. **Open the application:**
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Architecture

The application follows a modern **Next.js App Router** architecture:

- **Frontend**: Built with React Server Components (RSC) and Client Components. Pages are located in `app/` and reusable UI blocks in `components/`.
- **Backend**: API routes are defined in `app/api/` to handle server-side logic and database interactions.
- **Data Layer**: Mongoose models (`models/Profile.ts`, `models/User.ts`) define the schema and interact with the MongoDB database.
- **State Management**: React Context (`auth-context.tsx`) is used for managing authentication state globally.

## 📖 Usage

1. **Sign Up**: Create a new account using your email and password.
2. **Complete Profile**: Navigate to the Profile section and fill in the tabs (Personal, Physical, Stats, Bio, Media, etc.).
3. **Upload Media**: Use the Media tab to upload action shots or certificates.
4. **View Public Profile**: Click the "Share" or "Public View" button to see how your profile looks to others.
5. **Share**: Copy the generated URL and send it to coaches or scouts.
