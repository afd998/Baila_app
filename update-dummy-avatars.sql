-- Update all dummy profiles with random avatars using DiceBear API
-- This will assign different avatars to each dummy profile

WITH numbered_profiles AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (ORDER BY created_at) as row_num
  FROM profiles 
  WHERE is_dummy = TRUE
)
UPDATE profiles 
SET avatar_url = 'https://api.dicebear.com/7.x/avataaars/png?seed=' || 
                 np.row_num::text || 
                 '&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&size=200'
FROM numbered_profiles np
WHERE profiles.id = np.id; 