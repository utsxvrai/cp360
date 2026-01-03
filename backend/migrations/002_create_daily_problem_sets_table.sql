-- Create daily_problem_sets table
CREATE TABLE IF NOT EXISTS daily_problem_sets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE UNIQUE NOT NULL,
    
    easy_contest_id INT NOT NULL,
    easy_index TEXT NOT NULL,
    easy_rating INT,
    
    medium_contest_id INT NOT NULL,
    medium_index TEXT NOT NULL,
    medium_rating INT,
    
    hard_contest_id INT NOT NULL,
    hard_index TEXT NOT NULL,
    hard_rating INT,
    
    created_at TIMESTAMP DEFAULT now()
);

-- Create unique index on date
CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_problem_sets_date ON daily_problem_sets(date);

-- Create index on date for range queries
CREATE INDEX IF NOT EXISTS idx_daily_problem_sets_date_range ON daily_problem_sets(date);

