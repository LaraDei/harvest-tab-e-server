BEGIN;

TRUNCATE
  harvest_table_users,
  harvest_table_listings
  RESTART IDENTITY CASCADE;
  
INSERT INTO harvest_table_users (email, full_name, password)
VALUES
  ('test123@test.com', 'Test User', 'password123'),
  ('test123Bodeep@test.com', 'Bodeep Deboop', '$2a$12$lHK6LVpc15/ZROZcKU00'),
  ('test123Charlie@test.com', 'Charlie Bloggs', 'lmu59cy2jcZiV6U1.bE8rBBnC9'),
  ('test123Sam@test.com', 'Sam Smith', '$2a$12$ntGOlTLG5nEXYgDVqk4b');


  
INSERT INTO harvest_table_listings (
    title,
    img_location,
    location,
    lat,
    lng,
    description,
    user_id
) VALUES
  (
    'kale',
    'https://source.unsplash.com/_zV74zUnwmc/500x500',
    'Mainstage, Broadway, Sacramento, CA, USA',
    38.559005330011075,
    -121.48253537546658,
    'Photo by Laura Johnston on Unsplash',
    1
  ),
  (
    'daffodils',
    'https://source.unsplash.com/gXQCELcnI2U/500x500',
    'Main St, Orangevale, Sacramento, CA, USA',
    38.671668508216705,
    -121.20250687361289,
    'Photo by Annie Spratt on Unsplash',
    1
  ),
  (
    'apples',
    'https://source.unsplash.com/s7r4xjKXo0s/500x500',
    'Orangevale, CA, USA',
    38.67985581534705,
    -121.22604676782854,
    'Photo by Pierpaolo Riondato on Unsplash',
    1
  ),
  (
    'lemons',
    'https://source.unsplash.com/TFqjlTmkeyY/500x500',
    '"Main Avenue, Orangevale, CA, USA',
    38.67339260916394,
    -121.20245947361286,
    'Photo by Thitiphum Koonjantuek on Unsplash',
    2
  ),
  (
    'Oranges',
    'https://source.unsplash.com/ZZU9Wqzpj-M/500x500',
    'Fair Oaks, CA, USA',
    38.66248170591882,
    -121.27806123413936,
    'Photo by Jeremy Yap on Unsplash',
    2
  );

COMMIT;