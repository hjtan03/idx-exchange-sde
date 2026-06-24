# RETS Field Mapping

The RETS database uses legacy field names that differ from modern MLS field naming conventions.

## Property Fields

| Database Column  | Application Meaning  |
| ---------------- | -------------------- |
| L_ListingID      | Listing ID           |
| L_Address        | Street Address       |
| L_City           | City                 |
| L_State          | State                |
| L_Zip            | ZIP Code             |
| L_SystemPrice    | Listing Price        |
| L_Keyword2       | Bedrooms             |
| LM_Dec_3         | Bathrooms            |
| LM_Int2_3        | Square Feet          |
| L_Photos         | Property Photos      |
| LMD_MP_Latitude  | Latitude             |
| LMD_MP_Longitude | Longitude            |
| L_Remarks        | Property Description |
| YearBuilt        | Year Built           |
| LotSizeAcres     | Lot Size (Acres)     |

## Open House Fields

| Database Column | Application Meaning            |
| --------------- | ------------------------------ |
| L_ListingID     | Property Listing ID            |
| OpenHouseDate   | Open House Date                |
| OH_StartTime    | Start Time                     |
| OH_EndTime      | End Time                       |
| all_data        | Additional Open House Metadata |

## Notes

Always use the actual database column names when writing SQL queries.

Example:

Correct:
L_SystemPrice

Incorrect:
Price