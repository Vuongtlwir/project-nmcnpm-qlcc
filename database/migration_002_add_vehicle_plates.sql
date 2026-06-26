ALTER TABLE apartments
  ADD COLUMN vehicle_plates TEXT NULL COMMENT 'JSON: {"motorbikes":["BS1"],"cars":["BS2"]}' AFTER owner_phone;
