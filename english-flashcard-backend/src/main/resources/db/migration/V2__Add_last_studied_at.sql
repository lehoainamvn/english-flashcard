-- Add last_studied_at column to study_history if it doesn't exist
ALTER TABLE study_history 
ADD COLUMN IF NOT EXISTS last_studied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Update existing records
UPDATE study_history 
SET last_studied_at = studied_at 
WHERE last_studied_at IS NULL;
