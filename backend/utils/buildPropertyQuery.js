function buildPropertyConditions(filters) {
    const conditions = [];
    const values = [];

    const { city, zipcode, minPrice, maxPrice, beds, baths, minYearBuilt, maxYearBuilt } = filters;

    if (city) {
        conditions.push("LOWER(TRIM(L_City)) = LOWER(TRIM(?))");
        values.push(city);
    }
    if (zipcode) {
        conditions.push("L_Zip = ?");
        values.push(zipcode);
    }
    if (minPrice !== undefined && minPrice !== null) {
        conditions.push("L_SystemPrice >= ?");
        values.push(minPrice);
    }
    if (maxPrice !== undefined && maxPrice !== null) {
        conditions.push("L_SystemPrice <= ?");
        values.push(maxPrice);
    }
    if (beds !== undefined && beds !== null) {
        conditions.push("L_Keyword2 >= ?");
        values.push(beds);
    }
    if (baths !== undefined && baths !== null) {
        conditions.push("LM_Dec_3 >= ?");
        values.push(baths);
    }
    if (minYearBuilt !== undefined && minYearBuilt !== null) {
        conditions.push("YearBuilt >= ?");
        values.push(minYearBuilt);
    }
    if (maxYearBuilt !== undefined && maxYearBuilt !== null) {
        conditions.push("YearBuilt <= ?");
        values.push(maxYearBuilt);
    }

    return { conditions, values };
}

module.exports = { buildPropertyConditions };