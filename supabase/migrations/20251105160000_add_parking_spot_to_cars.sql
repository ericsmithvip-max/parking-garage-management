-- Add parking_spot_id to cars table
-- Migration: Add foreign key relationship between cars and parking_spots

-- Add the parking_spot_id column (nullable, since car might not be parked)
ALTER TABLE cars
ADD COLUMN parking_spot_id UUID REFERENCES parking_spots(id) ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX idx_cars_parking_spot_id ON cars(parking_spot_id);

-- Add comment to explain the relationship
COMMENT ON COLUMN cars.parking_spot_id IS 'The parking spot where the car is currently parked. NULL if car is checked out.';
