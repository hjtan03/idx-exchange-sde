-- Indexes added to rets_property - Week 9 Part B

-- idx_price       -> L_SystemPrice   (min/max price filter)
-- idx_beds        -> L_Keyword2      (beds filter)
-- idx_baths       -> LM_Dec_3        (baths filter)
-- idx_yearbuilt   -> YearBuilt       (min/max year built filter)
-- idx_city_price  -> L_City, L_SystemPrice (city + price together)

-- These match the filters GET /api/properties and POST /api/search/natural
-- already support (price/beds/baths since Week 3, year built since Week 9).
-- They were queryable before, just not indexed - MySQL had to scan the whole
-- table to check them since there was nothing to look them up by.

SET sql_mode = '';

CREATE INDEX idx_price ON rets_property (L_SystemPrice);
CREATE INDEX idx_beds ON rets_property (L_Keyword2);
CREATE INDEX idx_baths ON rets_property (LM_Dec_3);
CREATE INDEX idx_yearbuilt ON rets_property (YearBuilt);
CREATE INDEX idx_city_price ON rets_property (L_City, L_SystemPrice);

-- Ran EXPLAIN before and after on a query combining city + price range + beds + year:
--
-- before: type ALL, possible_keys NULL, rows 36048, filtered 1.23
-- after:  type range, possible_keys idx_price/idx_beds/idx_yearbuilt, key idx_price,
--         rows 18024, filtered 25.00
--
-- rows scanned cut in half, and now there's actually something for MySQL to pick from.
--
-- idx_city_price doesn't show up as a possible key for that query even though it
-- exists, because the city filter uses LOWER(TRIM(L_City)) and MySQL can't use an
-- index through a function. checked this with EXPLAIN, wasn't just guessing. would
-- need a stored normalized city column to actually fix that.
--
-- ran price by itself too as a sanity check: filtered came back 100.00, so idx_price
-- is matching cleanly on its own, the 25% above is just the beds/year conditions
-- getting filtered afterward.