-- Create the events table
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    location TEXT,
    cover_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Set up Row Level Security for events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Everyone can view events
CREATE POLICY "Everyone can view events" 
ON public.events 
FOR SELECT 
USING (true);

-- Only authenticated users can insert
CREATE POLICY "Authenticated users can insert events" 
ON public.events 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Only the creator or admin can update/delete
CREATE POLICY "Creators can update their own events" 
ON public.events 
FOR UPDATE 
USING (auth.uid() = created_by);

CREATE POLICY "Creators can delete their own events" 
ON public.events 
FOR DELETE 
USING (auth.uid() = created_by);

-- Create the media table for event photos
CREATE TABLE IF NOT EXISTS public.media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    type TEXT DEFAULT 'image',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Set up Row Level Security for media
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- Everyone can view media
CREATE POLICY "Everyone can view media" 
ON public.media 
FOR SELECT 
USING (true);

-- Only authenticated users can insert
CREATE POLICY "Authenticated users can insert media" 
ON public.media 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Only the creator or admin can update/delete
CREATE POLICY "Creators can update their own media" 
ON public.media 
FOR UPDATE 
USING (auth.uid() = created_by);

CREATE POLICY "Creators can delete their own media" 
ON public.media 
FOR DELETE 
USING (auth.uid() = created_by); 