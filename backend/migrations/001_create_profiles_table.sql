-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY,
    email TEXT NOT NULL,
    codeforces_handle TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Create index on codeforces_handle for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_codeforces_handle ON profiles(codeforces_handle);

-- Create index on email
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

