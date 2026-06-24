# Database Schema

Database Name: rets

## Tables

### rets_property

Stores MLS property listing information.

Current Record Count:

53,122

Primary Listing Identifier:

L_ListingID

Important Columns:

* L_ListingID
* L_Address
* L_City
* L_State
* L_Zip
* L_SystemPrice
* L_Keyword2
* LM_Dec_3
* LM_Int2_3
* L_Photos
* LMD_MP_Latitude
* LMD_MP_Longitude
* L_Remarks
* YearBuilt
* LotSizeAcres

### rets_openhouse

Stores open house events associated with property listings.

Current Record Count:

4,282

Relationship:

rets_openhouse.L_ListingID → rets_property.L_ListingID

Important Columns:

* L_ListingID
* OpenHouseDate
* OH_StartTime
* OH_EndTime
* all_data