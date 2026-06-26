-- Add meter reading columns to apartments
ALTER TABLE apartments
  ADD COLUMN electricity_reading INT NOT NULL DEFAULT 0 AFTER cars,
  ADD COLUMN water_reading INT NOT NULL DEFAULT 0 AFTER electricity_reading,
  ADD COLUMN last_electricity_reading INT NOT NULL DEFAULT 0 AFTER water_reading,
  ADD COLUMN last_water_reading INT NOT NULL DEFAULT 0 AFTER last_electricity_reading;
