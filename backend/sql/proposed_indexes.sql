-- Indexes added for rets_property - Week 9 Part B
--
-- Initially looked blocked by the same active_check schema issue from Week 3
-- (CREATE INDEX failing with "Invalid default value for 'active_check'"), but
-- turned out to be a session-level sql_mode setting, not a real schema problem.
-- My session had NO_ZERO_DATE enabled by default; teammates' didn't, which is
-- why they could create indexes on the same table and I couldn't at first.
--
-- Fix: SET sql_mode = ''; before running these. Only affects the current
-- session, doesn't touch the actual active_check column or table schema.
-- (sql_mode resets on reconnect, so this needs to be run again in a new session.)

SET sql_mode = '';

CREATE INDEX idx_price ON rets_property (L_SystemPrice);
CREATE INDEX idx_beds ON rets_property (L_Keyword2);
CREATE INDEX idx_baths ON rets_property (LM_Dec_3);
CREATE INDEX idx_yearbuilt ON rets_property (YearBuilt);
CREATE INDEX idx_city_price ON rets_property (L_City, L_SystemPrice);

-- Before/after on the combined filter query (city + price range + beds + year built):
--
-- BEFORE (no indexes):
--   type: ALL, possible_keys: NULL, key: NULL, rows: 36048, filtered: 1.23
--
-- AFTER (indexes added):
--   type: range, possible_keys: idx_price,idx_beds,idx_yearbuilt, key: idx_price,
--   rows: 18024, filtered: 25.00, Extra: Using index condition; Using where; Using MRR
--
-- Rows scanned cut in half, and MySQL now actually has candidate indexes to choose
-- from instead of none. It picks idx_price as the entry point and filters beds/year
-- against that narrowed set.
--
-- idx_city_price doesn't show up in possible_keys for this query, even though it
-- exists - the query wraps city in LOWER(TRIM(L_City)) for case-insensitive matching,
-- and MySQL can't use an index through a function call. Confirmed with EXPLAIN, not
-- just assumed. Would need a stored/generated normalized city column to actually use
-- that index for city lookups.
--
-- Isolated test on price alone (no other conditions) for comparison:
--   type: range, key: idx_price, rows: 18024, filtered: 100.00
-- Every row idx_price finds is a real match when it's the only condition - confirms
-- the index itself works cleanly, the 25% filtered above is just from the additional
-- beds/year conditions still being checked row-by-row after the price narrowing.