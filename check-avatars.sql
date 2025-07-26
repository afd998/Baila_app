-- Check if avatars were updated
SELECT id, full_name, handle, avatar_url, is_dummy
FROM profiles 
WHERE is_dummy = TRUE 
LIMIT 5; 