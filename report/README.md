# Final project report

**Report:** [Multi-temporal land use and land cover classification and interactive change visualization of the Chennai Urban Study Area (2010–2025)](Chennai_LULC_Report_With_Fusion_Maps.pdf)  
**File:** `Chennai_LULC_Report_With_Fusion_Maps.pdf`  
**Pages:** Refer to revised PDF (older 103-page edition is the source of legacy page citations)  
**Version:** revised public GitHub report exported from `Github_REPORT.docx`, October 2026  
**Format:** PDF, 6,478,620 bytes  
**Integrity:** SHA-256 is recorded in [`SHA256SUMS.txt`](SHA256SUMS.txt).

This **revised public PDF** was exported from the researcher-supplied `Github_REPORT.docx` through Microsoft Word (or a manually exported equivalent). The staging workflow does not rewrite scientific findings. Earlier results CSVs and original JPEG figures still cite the previously audited 103-page report edition. It includes the methods, classifications, validation evidence, original and fusion map comparisons, change analysis, geographical transferability experiments, limitations and interactive GIS prototype.

## Important interpretation notes

<!-- experiments-v1.0.0:begin -->
## Supplementary experiment maps and published rasters

The [supplementary experiments directory](supplementary-experiments/README.md) contains two **derived** visual plates: the five-panel Chennai original/fusion comparison and the six-map 2020 frozen-model geographical-transfer comparison. These figures are supplementary to the **revised public PDF** exported from the user-supplied `Github_REPORT.docx`; they do not alter the underlying classification computations.

The [published experiment release](https://github.com/bakayaro05/chennai-lulc-gis/releases/tag/experiments-v1.0.0) provides 26 original export files and a [SHA-256 manifest](https://github.com/bakayaro05/chennai-lulc-gis/releases/download/experiments-v1.0.0/extended_experiment_manifest.csv), including categorical and colour GeoTIFFs, class-area manifests, pilot ROI geometry and Thanjavur manual reference GeoJSON. The official reported 2010 baseline is provisional; the alternate 2010 two-way fusion map is sensitivity-only. Cuddalore/Nagapattinam/Thoothukudi automatic proxy agreement is **not** independent classification accuracy; 3 km pilot circles are **not** administrative boundaries.

The old 103-page report and its original SHA-256 remain identified in `docs/DATA_AND_RESULTS_PROVENANCE.md` for reproducibility. Historical CSV source-page citations and `figures/figure_provenance.csv` refer to that **earlier report edition**, not necessarily to page positions in the revised PDF.
<!-- experiments-v1.0.0:end -->


- The assessed historical classification series covers **2010 (provisional), 2015, 2020 and 2025**. An accepted 2005 classification was not completed.
- The original provisional 2010 classification is the reported baseline; its two-way fusion alternative is a **separate sensitivity experiment**, not a replacement.
- Five-class Gaussian MLC outputs, five-class post-classification fusion candidates, and four-class reporting rasters are distinct products.
- Thanjavur manual-reference validation and coastal-city automatic proxy agreement use different evaluation designs; do not treat proxy agreement as independently verified overall accuracy.
- The PDF is a completed **course project report**, not a peer-reviewed journal or conference publication.
- Some imagery/remote-sensing assets referenced in the report require external access or permissions. Full datasets are not embedded in this PDF.

For code and source provenance, see the repository [main README](../README.md), [full code manual](../docs/CODE_MANUAL.md), [asset inventory](../docs/ASSET_MANIFEST_VERIFIED.md), [results](../results/README.md), and [dataset catalogue](../data/README.md).

**Public-release check:** The revised document is intended to omit the college logo and bonafide material; inspect its rendered pages and personal identifiers before committing. Replacing a file does **not** remove the earlier PDF from Git history; privacy-sensitive history cleanup is a separate operation.
