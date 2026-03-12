# Portfolio Website - Complete Setup Guide for Friend's Laptop

This guide will help your friend clone and set up the exact same portfolio website on their laptop with their own Supabase database and Vercel deployment.

## Prerequisites

Before starting, make sure your friend has:
- **Node.js 18+** ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- A **Supabase account** (free at [supabase.com](https://supabase.com))
- A **Vercel account** (free at [vercel.com](https://vercel.com))
- A **GitHub account** (free at [github.com](https://github.com)) - for pushing their own copy

---

## Step 1: Clone the Project

Your friend should open Terminal/Command Prompt and run:

```bash
# Navigate to where they want the project
cd Desktop

# Clone the repository
git clone https://github.com/Harmin30/portfolio-website.git

# Navigate into the project
cd portfolio-website

# Install all dependencies
npm install
```

---

## Step 2: Create a New Supabase Project (For Their Data)

Your friend needs to create **their own Supabase project** (not share yours):

### 2.1 Create Project
1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click **"New Project"**
3. Fill in:
   - **Project Name**: `portfolio-website` (or any name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to their location
4. Click **"Create new project"** and wait 1-2 minutes

### 2.2 Get API Keys
1. In Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (under "Project URL")
   - **Anon Key** (under "Project API keys")
   - **Service Role Key** (under "Project API keys") - keep this secret!

---

## Step 3: Create Database Tables

Your friend needs to set up the same database structure. In Supabase:

### 3.1 Go to SQL Editor
1. Click **"SQL Editor"** in left sidebar
2. Click **"New Query"**

### 3.2 Run Setup SQL
Paste this SQL script and execute it:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  bio TEXT,
  profile_photo TEXT,
  resume_link TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create about table
CREATE TABLE about (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id),
  about_text TEXT,
  profile_photo TEXT,
  resume_link TEXT,
  education JSONB DEFAULT '[]'::jsonb,
  experience JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image TEXT,
  tech_stack TEXT[],
  github_url TEXT,
  live_url TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create blog_posts table
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  image TEXT,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create skills table
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  level TEXT DEFAULT 'intermediate',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create certificates table
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  description TEXT,
  date_obtained DATE,
  certificate_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE about ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow public read)
CREATE POLICY "profiles_read" ON profiles FOR SELECT USING (true);
CREATE POLICY "about_read" ON about FOR SELECT USING (true);
CREATE POLICY "projects_read" ON projects FOR SELECT USING (true);
CREATE POLICY "blog_posts_read" ON blog_posts FOR SELECT USING (true);
CREATE POLICY "skills_read" ON skills FOR SELECT USING (true);
CREATE POLICY "certificates_read" ON certificates FOR SELECT USING (true);
CREATE POLICY "messages_insert" ON messages FOR INSERT WITH CHECK (true);
```

---

## Step 4: Set Up Environment Variables

### 4.1 Create `.env.local` File
In the project root folder, create a file named `.env.local`:

```bash
touch .env.local
```

### 4.2 Add Supabase Keys
Open `.env.local` in a text editor and add (using their own Supabase keys from Step 2.2):

```env
# === SUPABASE CONFIGURATION ===
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# === OPTIONAL: GMAIL SETUP (for contact form emails) ===
# If they want to receive emails from the contact form:
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
GMAIL_USER=their.email@gmail.com

# === OPTIONAL: NODE ENVIRONMENT ===
NODE_ENV=development
```

**Note**: The `NEXT_PUBLIC_SUPABASE_ANON_KEY` should be their own key from their Supabase project (Step 2.2).

---

## Step 5: Run Locally

```bash
# In the portfolio-website directory
npm run dev
```

The website will run at **http://localhost:3000**

Your friend can now:
- View the portfolio at `http://localhost:3000`
- Access the admin dashboard at `http://localhost:3000/admin`
- Add their own projects, blog posts, skills, etc. through the admin panel

---

## Step 6: Customize for Themselves

### 6.1 Update Profile Info
1. Go to **http://localhost:3000/admin/profile**
2. Add their name, bio, photo, resume link
3. Add their GitHub, LinkedIn, Twitter URLs

### 6.2 Add Content
- **Projects**: Admin → Projects → Add projects with descriptions, images, links
- **Blog**: Admin → Blog → Write blog posts
- **Skills**: Admin → Skills → Add skills by category
- **Certificates**: Admin → Certificates → Add certificates
- **About**: Admin → About → Add education & experience timeline

---

## Step 7: Deploy to Vercel

### 7.1 Push to GitHub
First, they need to create their own GitHub repository:

```bash
# Initialize as their own repo
git remote remove origin
git remote add origin https://github.com/THEIR_USERNAME/portfolio-website.git

# Push to their GitHub
git add -A
git commit -m "Initial portfolio setup"
git push -u origin main
```

### 7.2 Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign up
2. Click **"Import Project"**
3. Select **"Import Git Repository"**
4. Paste their GitHub repo URL and click **"Continue"**
5. Fill in **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL` = their Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = their Supabase Anon Key
6. Click **"Deploy"**

Vercel will automatically deploy whenever they push to GitHub 🚀

---

## Step 8: Set Up Custom Domain (Optional)

After deployment, they can:
1. Buy a domain from [Namecheap](https://namecheap.com), [GoDaddy](https://godaddy.com), etc.
2. In Vercel project settings, add the domain
3. Follow Vercel's DNS instructions

---

## Step 9: Admin Panel Setup

### Login Credentials
The admin panel uses **PIN-based authentication**:

1. First time: Go to **http://localhost:3000/admin**
2. Click "Set UP PIN" and create a 4-digit PIN
3. Use that PIN to login to admin dashboard

---

## Troubleshooting

### "Cannot find module" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Environment variables not loading
- Make sure `.env.local` file is in the **root** of the project (same level as `package.json`)
- Restart the dev server: `npm run dev`

### Supabase connection errors
- Double-check the Supabase URL and keys in `.env.local`
- Make sure tables are created (Step 3)
- Check Supabase dashboard for any errors

### Vercel deployment fails
- Make sure all environment variables are set in Vercel project settings
- Check that the GitHub repo is connected and up to date

---

## Key Files & Structure

```
portfolio-website/
├── src/
│   ├── app/
│   │   ├── (public)/          # Public pages
│   │   ├── admin/             # Admin dashboard
│   │   └── api/               # API routes
│   ├── components/            # Reusable components
│   ├── lib/                   # Utilities (Supabase client, etc)
│   └── types/                 # TypeScript types
├── .env.local                 # Environment variables (create this!)
├── package.json               # Dependencies
├── tailwind.config.ts         # Tailwind CSS config
└── tsconfig.json              # TypeScript config
```

---

## Getting Help

If your friend runs into issues:
1. Check the error message carefully
2. Review this guide again
3. Check Supabase/Vercel dashboards for configuration issues
4. Contact you or check GitHub issues

---

## Summary Checklist

- [ ] Installed Node.js, npm, Git
- [ ] Cloned repository
- [ ] Created Supabase account & project
- [ ] Got Supabase URL & keys
- [ ] Created `.env.local` with Supabase keys
- [ ] Ran setup SQL to create tables
- [ ] Ran `npm install`
- [ ] Ran `npm run dev` and accessed http://localhost:3000
- [ ] Added profile info via admin panel
- [ ] Pushed to GitHub (their own account)
- [ ] Deployed to Vercel
- [ ] Tested live site

---

Good luck! 🚀
