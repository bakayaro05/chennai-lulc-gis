# Research stages and decisions

1. ROI and Landsat acquisition/preprocessing; 30 m grid, EPSG:32644. Historical years studied: 2005, 2010, 2015, 2020, 2025; a fully accepted 2005 classification should not be assumed.
2. Five-class Gaussian MLC experiments and independent reference assessment; later four-class reporting/aggregation are **different products**.
3. 2015 temporal fusion, 2020 GAIA + WorldCover fusion, 2025 GAIA + Dynamic World fusion as retained post-classification alternatives.
4. 2010 original L5/L7 MLC is the reported baseline; reconstructed 2010 GAIA + GHSL + 2015 temporal *two-way sensitivity* is not its replacement. Accuracy: original 69.33%, add-only 69.67%, two-way 71.33%. Two-way mapped Built-up area 304.716 km2, original 279.822 km2.
5. Thanjavur 2020 frozen Chennai MLC (five classes): direct area-adjusted accuracy 23.1854%, season-matched 20.6625%, quantile harmonised 35.9444% on 112 manually labelled reference locations. No Gaussian retraining.
6. Cuddalore, Nagapattinam, Thoothukudi were *automatic product-agreement screens*, not independently measured accuracy. Overall proxy agreement 57.9251%, 82.9085%, 46.0861% respectively, on covered subsets.

A file's presence in the archive does **not** prove that it produced an adopted result. Detailed statuses will be verified from source after the full GitHub repository is available.
