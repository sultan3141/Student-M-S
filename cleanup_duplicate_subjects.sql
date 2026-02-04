-- Remove duplicate subjects created by ParentPortalSeeder
-- These have codes like MTH101, PHY101, etc.

DELETE FROM subjects WHERE code IN (
    'MTH101',
    'PHY101',
    'CHM101',
    'BIO101',
    'ENG101',
    'AMH101',
    'CIV101'
);

-- Verify remaining subjects for Grade 10
SELECT id, name, code, grade_id FROM subjects WHERE grade_id = (SELECT id FROM grades WHERE level = 10);
