# Planned data structure:

**Shows table** (seeded once, never written to by users)
- show_id, name, description, seasons, ongoing, age_rating
- img_vertical, img_horizontal
- streaming_sites (JSON array)
- cast (JSON array of objects: name, character, photo)
- crew (JSON array of objects: name, role)

**Users table**
- user_id, username, email, password_hash, created_at

**User top shows table** (max 4 rows per user)
- id, user_id → Users, show_id → Shows, position (1–4)

**Show interactions table** (one row per user per show)
- interaction_id, user_id → Users, show_id → Shows
- watched (boolean), saved (boolean), liked (boolean)
- star_count (nullable 1–5)
- review_text (nullable)
- created_at, updated_at

**Review likes table** (one row per like)
- id, interaction_id → ShowInteractions, user_id → Users