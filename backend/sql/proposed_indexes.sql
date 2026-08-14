-- Indexes to add once the active_check schema issue is fixed
-- (see Week 3 notes - CREATE INDEX fails with "Invalid default value for 'active_check'")
--
-- Re-tested this in Week 9, still broken. Ran EXPLAIN on a realistic combined
-- filter query (city + price range + beds + year built) and got:
--
--   type: ALL, possible_keys: NULL, key: NULL, rows: 36048, filtered: 1.23
--
-- So it's scanning the whole table (36k rows) to find ~450 matches. None of these
-- columns have indexes, and L_City can't use its existing index anyway because
-- we wrap it in LOWER(TRIM()) for the case-insensitive matching.

CREATE INDEX idx_price ON rets_property (L_SystemPrice);
CREATE INDEX idx_beds ON rets_property (L_Keyword2);
CREATE INDEX idx_baths ON rets_property (LM_Dec_3);
CREATE INDEX idx_yearbuilt ON rets_property (YearBuilt);
CREATE INDEX idx_city_price ON rets_property (L_City, L_SystemPrice);

-- Note: idx_city_price won't actually get used until we stop wrapping L_City in
-- LOWER(TRIM()), since MySQL can't use an index through a function call. Would
-- need a stored/generated normalized column instead if we want both.