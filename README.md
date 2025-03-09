# FestClicks - College Event Gallery

FestClicks is a web application designed to help college students and staff easily find and share images and videos from college events and festivals. This platform provides a centralized location for all event media, making it simple to browse, search, and upload content.

## Features

- **User Authentication**: Secure login and registration system
- **Event Galleries**: Browse events and view associated media
- **Media Upload**: Upload images and videos for specific events
- **Admin Dashboard**: Manage events and media content
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React, React Router, TailwindCSS
- **Backend**: Supabase (Authentication, Database, Storage)
- **Media Storage**: Cloudinary (Image and Video hosting)

## Prerequisites

Before you begin, ensure you have the following:

- Node.js (v14 or higher)
- npm or yarn
- Supabase account
- Cloudinary account

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/festclicks.git
cd festclicks
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory with the following variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_API_KEY=your_cloudinary_api_key
VITE_CLOUDINARY_API_SECRET=your_cloudinary_api_secret
VITE_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset
```

### 4. Supabase Setup

1. Create a new Supabase project
2. Set up the following tables:

#### Events Table
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  location TEXT,
  cover_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Media Table
```sql
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  public_id TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  format TEXT,
  width INTEGER,
  height INTEGER,
  bytes INTEGER,
  duration FLOAT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Profiles Table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

3. Set up Row Level Security (RLS) policies for your tables

### 5. Cloudinary Setup

1. Create a Cloudinary account
2. Create an upload preset for the application
3. Configure the upload preset to allow unsigned uploads

### 6. Start the development server

```bash
npm run dev
```

## Usage

### User Flow

1. **Login/Register**: Users can create an account or log in
2. **Browse Events**: View all available events on the dashboard
3. **View Gallery**: Click on an event to view its gallery of images and videos
4. **Upload Media**: Admins can upload new media to event galleries

### Admin Flow

1. **Manage Events**: Create, edit, or delete events
2. **Moderate Content**: Review and manage uploaded media

## Deployment

To build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Supabase](https://supabase.io/)
- [Cloudinary](https://cloudinary.com/)
- [TailwindCSS](https://tailwindcss.com/)
