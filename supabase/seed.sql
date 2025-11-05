-- Seed data for Parking Garage Management System

-- Insert garages
INSERT INTO garages (id, name, location) VALUES
  ('a1b2c3d4-e5f6-4a7b-8c9d-1e2f3a4b5c6d', 'Downtown Parking Center', '123 Main Street, Downtown'),
  ('b2c3d4e5-f6a7-4b8c-9d1e-2f3a4b5c6d7e', 'Airport Terminal Garage', '456 Airport Blvd, Terminal A'),
  ('c3d4e5f6-a7b8-4c9d-1e2f-3a4b5c6d7e8f', 'Shopping Mall Parking', '789 Commerce Way, Mall District');

-- Insert floors for Downtown Parking Center
INSERT INTO floors (id, garage_id, name) VALUES
  ('d4e5f6a7-b8c9-4d1e-2f3a-4b5c6d7e8f9a', 'a1b2c3d4-e5f6-4a7b-8c9d-1e2f3a4b5c6d', 'Ground Floor'),
  ('e5f6a7b8-c9d1-4e2f-3a4b-5c6d7e8f9a1b', 'a1b2c3d4-e5f6-4a7b-8c9d-1e2f3a4b5c6d', 'Level 2'),
  ('f6a7b8c9-d1e2-4f3a-4b5c-6d7e8f9a1b2c', 'a1b2c3d4-e5f6-4a7b-8c9d-1e2f3a4b5c6d', 'Level 3');

-- Insert floors for Airport Terminal Garage
INSERT INTO floors (id, garage_id, name) VALUES
  ('a7b8c9d1-e2f3-4a4b-5c6d-7e8f9a1b2c3d', 'b2c3d4e5-f6a7-4b8c-9d1e-2f3a4b5c6d7e', 'Ground Floor'),
  ('b8c9d1e2-f3a4-4b5c-6d7e-8f9a1b2c3d4e', 'b2c3d4e5-f6a7-4b8c-9d1e-2f3a4b5c6d7e', 'Level 2');

-- Insert floors for Shopping Mall Parking
INSERT INTO floors (id, garage_id, name) VALUES
  ('c9d1e2f3-a4b5-4c6d-7e8f-9a1b2c3d4e5f', 'c3d4e5f6-a7b8-4c9d-1e2f-3a4b5c6d7e8f', 'Ground Floor'),
  ('d1e2f3a4-b5c6-4d7e-8f9a-1b2c3d4e5f6a', 'c3d4e5f6-a7b8-4c9d-1e2f-3a4b5c6d7e8f', 'Level 2'),
  ('e2f3a4b5-c6d7-4e8f-9a1b-2c3d4e5f6a7b', 'c3d4e5f6-a7b8-4c9d-1e2f-3a4b5c6d7e8f', 'Rooftop Level');

-- Insert bays for Downtown Ground Floor
INSERT INTO bays (id, floor_id, name) VALUES
  ('f3a4b5c6-d7e8-4f9a-1b2c-3d4e5f6a7b8c', 'd4e5f6a7-b8c9-4d1e-2f3a-4b5c6d7e8f9a', 'Bay A'),
  ('a4b5c6d7-e8f9-4a1b-2c3d-4e5f6a7b8c9d', 'd4e5f6a7-b8c9-4d1e-2f3a-4b5c6d7e8f9a', 'Bay B'),
  ('b5c6d7e8-f9a1-4b2c-3d4e-5f6a7b8c9d1e', 'd4e5f6a7-b8c9-4d1e-2f3a-4b5c6d7e8f9a', 'Bay C');

-- Insert bays for Downtown Level 2
INSERT INTO bays (id, floor_id, name) VALUES
  ('c6d7e8f9-a1b2-4c3d-4e5f-6a7b8c9d1e2f', 'e5f6a7b8-c9d1-4e2f-3a4b-5c6d7e8f9a1b', 'Bay A'),
  ('d7e8f9a1-b2c3-4d4e-5f6a-7b8c9d1e2f3a', 'e5f6a7b8-c9d1-4e2f-3a4b-5c6d7e8f9a1b', 'Bay B');

-- Insert parking spots for Downtown Ground Floor, Bay A
INSERT INTO parking_spots (id, floor_id, bay_id, name, status, size, rate, features) VALUES
  ('e8f9a1b2-c3d4-4e5f-6a7b-8c9d1e2f3a4b', 'd4e5f6a7-b8c9-4d1e-2f3a-4b5c6d7e8f9a', 'f3a4b5c6-d7e8-4f9a-1b2c-3d4e5f6a7b8c', 'A-1', 'available', 'standard', 5.00, '{"EV_charging": true, "covered": true}'),
  ('f9a1b2c3-d4e5-4f6a-7b8c-9d1e2f3a4b5c', 'd4e5f6a7-b8c9-4d1e-2f3a-4b5c6d7e8f9a', 'f3a4b5c6-d7e8-4f9a-1b2c-3d4e5f6a7b8c', 'A-2', 'occupied', 'standard', 5.00, '{"covered": true}'),
  ('a1b2c3d4-e5f6-4a7b-8c9d-1e2f3a4b5c7d', 'd4e5f6a7-b8c9-4d1e-2f3a-4b5c6d7e8f9a', 'f3a4b5c6-d7e8-4f9a-1b2c-3d4e5f6a7b8c', 'A-3', 'available', 'compact', 3.50, '{"covered": true}'),
  ('b2c3d4e5-f6a7-4b8c-9d1e-2f3a4b5c6d8e', 'd4e5f6a7-b8c9-4d1e-2f3a-4b5c6d7e8f9a', 'f3a4b5c6-d7e8-4f9a-1b2c-3d4e5f6a7b8c', 'A-4', 'available', 'oversized', 8.00, '{"EV_charging": true, "covered": true}');

-- Insert parking spots for Downtown Ground Floor, Bay B
INSERT INTO parking_spots (id, floor_id, bay_id, name, status, size, rate, features) VALUES
  ('c3d4e5f6-a7b8-4c9d-1e2f-3a4b5c6d7e9f', 'd4e5f6a7-b8c9-4d1e-2f3a-4b5c6d7e8f9a', 'a4b5c6d7-e8f9-4a1b-2c3d-4e5f6a7b8c9d', 'B-1', 'available', 'standard', 5.00, '{"handicap": true, "covered": true}'),
  ('d4e5f6a7-b8c9-4d1e-2f3a-4b5c6d7e8f1a', 'd4e5f6a7-b8c9-4d1e-2f3a-4b5c6d7e8f9a', 'a4b5c6d7-e8f9-4a1b-2c3d-4e5f6a7b8c9d', 'B-2', 'occupied', 'standard', 5.00, '{"covered": true}'),
  ('e5f6a7b8-c9d1-4e2f-3a4b-5c6d7e8f9a2b', 'd4e5f6a7-b8c9-4d1e-2f3a-4b5c6d7e8f9a', 'a4b5c6d7-e8f9-4a1b-2c3d-4e5f6a7b8c9d', 'B-3', 'available', 'compact', 3.50, '{"covered": true}');

-- Insert parking spots for Airport Ground Floor
INSERT INTO parking_spots (id, floor_id, bay_id, name, status, size, rate, features) VALUES
  ('f6a7b8c9-d1e2-4f3a-4b5c-6d7e8f9a1b3c', 'a7b8c9d1-e2f3-4a4b-5c6d-7e8f9a1b2c3d', NULL, 'Terminal-A-1', 'available', 'standard', 6.00, '{"short_term": true}'),
  ('a7b8c9d1-e2f3-4a4b-5c6d-7e8f9a1b2c4d', 'a7b8c9d1-e2f3-4a4b-5c6d-7e8f9a1b2c3d', NULL, 'Terminal-A-2', 'available', 'standard', 6.00, '{"short_term": true}'),
  ('b8c9d1e2-f3a4-4b5c-6d7e-8f9a1b2c3d5e', 'a7b8c9d1-e2f3-4a4b-5c6d-7e8f9a1b2c3d', NULL, 'Terminal-A-3', 'occupied', 'oversized', 10.00, '{"short_term": true}');

-- Insert parking spots for Shopping Mall Ground Floor
INSERT INTO parking_spots (id, floor_id, bay_id, name, status, size, rate, features) VALUES
  ('c9d1e2f3-a4b5-4c6d-7e8f-9a1b2c3d4e6f', 'c9d1e2f3-a4b5-4c6d-7e8f-9a1b2c3d4e5f', NULL, 'Mall-G-1', 'available', 'standard', 4.00, '{"VIP": true}'),
  ('d1e2f3a4-b5c6-4d7e-8f9a-1b2c3d4e5f7a', 'c9d1e2f3-a4b5-4c6d-7e8f-9a1b2c3d4e5f', NULL, 'Mall-G-2', 'available', 'compact', 3.00, '{}'),
  ('e2f3a4b5-c6d7-4e8f-9a1b-2c3d4e5f6a8b', 'c9d1e2f3-a4b5-4c6d-7e8f-9a1b2c3d4e5f', NULL, 'Mall-G-3', 'occupied', 'standard', 4.00, '{}'),
  ('f3a4b5c6-d7e8-4f9a-1b2c-3d4e5f6a7b9c', 'c9d1e2f3-a4b5-4c6d-7e8f-9a1b2c3d4e5f', NULL, 'Mall-G-4', 'available', 'standard', 4.00, '{"handicap": true}');

-- Insert cars
INSERT INTO cars (id, license_plate_number, checkedin_at, checkedout_at) VALUES
  ('a4b5c6d7-e8f9-4a1b-2c3d-4e5f6a7b8c1d', 'ABC-1234', '2025-11-05 08:30:00', NULL),
  ('b5c6d7e8-f9a1-4b2c-3d4e-5f6a7b8c9d2e', 'XYZ-5678', '2025-11-05 09:15:00', NULL),
  ('c6d7e8f9-a1b2-4c3d-4e5f-6a7b8c9d1e3f', 'LMN-9012', '2025-11-04 14:20:00', '2025-11-04 18:45:00'),
  ('d7e8f9a1-b2c3-4d4e-5f6a-7b8c9d1e2f4a', 'PQR-3456', '2025-11-03 10:00:00', '2025-11-03 15:30:00');

-- Insert parking fees
INSERT INTO parking_fees (id, car_id, billed_at) VALUES
  ('e8f9a1b2-c3d4-4e5f-6a7b-8c9d1e2f3a5b', 'a4b5c6d7-e8f9-4a1b-2c3d-4e5f6a7b8c1d', '2025-11-05 08:30:00'),
  ('f9a1b2c3-d4e5-4f6a-7b8c-9d1e2f3a4b6c', 'b5c6d7e8-f9a1-4b2c-3d4e-5f6a7b8c9d2e', '2025-11-05 09:15:00'),
  ('a1b2c3d4-e5f6-4a7b-8c9d-1e2f3a4b5c8d', 'c6d7e8f9-a1b2-4c3d-4e5f-6a7b8c9d1e3f', '2025-11-04 18:45:00'),
  ('b2c3d4e5-f6a7-4b8c-9d1e-2f3a4b5c6d9e', 'd7e8f9a1-b2c3-4d4e-5f6a-7b8c9d1e2f4a', '2025-11-03 15:30:00');
