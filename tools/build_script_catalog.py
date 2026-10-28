#!/usr/bin/env python3
"""Generate a transparent per-file index from an archived Earth Engine Code Editor clone.

Usage:
  cd ~/Documents/Chennai-LULC-GitHub/chennai-lulc-gis
  python tools/build_script_catalog.py

Requires Python 3.9+ and the local original archive. No GEE login or external packages.
No edits to source scripts. Writes only docs/CODE_SCAN_CATALOG.{md,csv} and
 docs/ASSET_REFERENCE_INDEX.md. Does not imply that exports were executed.
"""
from __future__ import annotations
import csv
import hashlib
import re
import sys
from collections import defaultdict, Counter
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'archive' / 'gee-original'
DOC = ROOT / 'docs'
GITHUB_BASE = 'https://github.com/bakayaro05/chennai-lulc-gis/blob/main/archive/gee-original/'

ASSET_PATTERNS = [
    re.compile(r'(?:ROOT|ASSETS|ASSET_ROOT|BASE)\s*\+\s*[\'\"]([A-Za-z0-9_\-/.]+)[\'\"]'),
    re.compile(r'projects/[A-Za-z0-9_\-]+/assets/([A-Za-z0-9_\-/.]+)'),
]
EXP_DESC = re.compile(r'\b(?:description|fileNamePrefix|assetId)\s*:\s*([^,\r\n}]+)')
COLLECTION = re.compile(r"(?:ee\.(?:ImageCollection|Image|FeatureCollection)\s*\(\s*['\"])([^'\"]{3,120})['\"]")
HEADER = re.compile(r'^\s*//\s*(.*)$')


def unique(seq):
    return list(dict.fromkeys(x for x in seq if x))


def md(s):
    return str(s).replace('|', r'\|').replace('\n', ' ').replace('`', "'")


def category(path):
    p = str(path).replace('\\', '/').lower()
    name = path.name.lower()
    if p.startswith('tnjregion/'):
        return 'Out-of-region generalisability'
    if p.startswith('stage8/'):
        return 'Stage 08: diagnosis and post-classification fusion'
    if p.startswith('stage7/'):
        return 'Stage 07: historical MLC and four-class reporting'
    if name.startswith(('01_', '02_', '03_')):
        return 'Foundation: study area, predictors and 2020/2025'
    if name.startswith('04'):
        return '2015 training, validation and Gaussian MLC'
    if name.startswith('05') or name.startswith('06'):
        return '2010 training, validation and Gaussian MLC'
    return 'Cross-stage tools and exports'


def tag_from_code(s, name):
    # Code-scan tags indicate observable operation, NOT authoritative research decisions.
    t = (s[:3500] + '\n' + name).lower()
    parts = []
    if 'read only' in t or 'read-only' in t:
        parts.append('read-only-labelled')
    if 'exploratory' in t or 'experimental' in t:
        parts.append('exploratory-labelled')
    if 'final' in t or 'locked' in t:
        parts.append('final/locked-mentioned')
    if 'fusion' in t:
        parts.append('fusion')
    if 'gaussian' in t or 'mlc' in t:
        parts.append('Gaussian-MLC-related')
    if 'random forest' in t or 'smileRandomForest' in s:
        parts.append('Random-Forest-related')
    if 'validation' in t:
        parts.append('validation-related')
    if 'export.image' in s.lower() or 'export.table' in s.lower():
        parts.append('export-calls-present')
    if not parts:
        parts.append('requires-human-review')
    return ', '.join(parts)


def records():
    rows = []
    for fp in sorted(SRC.rglob('*'), key=lambda p: str(p).lower()):
        if not fp.is_file():
            continue
        raw = fp.read_bytes()
        text = raw.decode('utf-8', errors='replace')
        rel = fp.relative_to(SRC)
        initial_comments = []
        for line in text.splitlines()[:65]:
            m = HEADER.match(line)
            if m:
                st = m.group(1).strip(' =-/\t')
                if st and len(st) >= 7 and not st.lower().startswith('end '):
                    initial_comments.append(st)
        # Use source comments for description; do not claim that filenames prove behaviour.
        summary = ' — '.join(unique(initial_comments)[:3])[:310]
        if not summary:
            summary = 'No useful introductory comments; manual code review required'
        assets = []
        for p in ASSET_PATTERNS:
            assets.extend(p.findall(text))
        assets = unique(assets)
        datasets = unique(COLLECTION.findall(text))
        datasets = [d for d in datasets if '/' in d and not d.startswith('projects/') and not d.startswith('users/')]
        exp = unique(m.group(1).strip().strip('"\' ')[:110] for m in EXP_DESC.finditer(text))
        n_exp = len(re.findall(r'\bExport\.(?:image|table|video)\.(?:toDrive|toAsset|toCloudStorage)\s*\(', text))
        is_readonly = ('read only' in text[:3000].lower() or 'read-only' in text[:3000].lower())
        row = {
            'path': rel.as_posix(), 'category': category(rel),
            'size_bytes': len(raw), 'lines': len(text.splitlines()),
            'sha256': hashlib.sha256(raw).hexdigest(),
            'introductory_source_comments': summary,
            'code_detected_tags': tag_from_code(text, fp.name),
            'mentioned_asset_suffixes': '; '.join(assets[:45]),
            'external_dataset_ids_detected': '; '.join(datasets[:24]),
            'export_calls': n_exp,
            'export_argument_expressions': '; '.join(exp[:25]),
            'read_only_label': 'Yes' if is_readonly else 'Not labelled',
            'research_decision_status': 'Unverified — requires results/decision audit',
        }
        rows.append(row)
    return rows


def main():
    if not SRC.exists():
        sys.exit('ERROR: original archive missing: ' + str(SRC))
    rows = records()
    DOC.mkdir(exist_ok=True, parents=True)
    csvfile = DOC / 'CODE_SCAN_CATALOG.csv'
    with csvfile.open('w', encoding='utf-8-sig', newline='') as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(rows)

    groups = defaultdict(list)
    asset_index = defaultdict(list)
    for r in rows:
        groups[r['category']].append(r)
        for asset in r['mentioned_asset_suffixes'].split('; '):
            if asset:
                asset_index[asset].append(r['path'])

    out = [
        '# Chennai GIS — Per-script code-scan catalogue', '',
        '**Status:** Automatically extracted from locally archived source; it is NOT a full scientific review.',
        '**Preservation:** Source scripts are read-only to this generator.',
        '**Counts:** %d archived files. **Expected from upstream snapshot:** 156.' % len(rows), '',
        '## How to read this catalogue', '',
        'Source-header excerpts come from each file itself. Asset mentions and export calls are located by static pattern scanning. '
        'A referenced asset may be an input, candidate output, explanatory comment, or dead code; do not claim it was created or executed without verifying the original code and Earth Engine task/asset.',
        'Labels such as "final" or "exploratory" describe wording found in the source, **not an independently validated adoption decision**.',
        'Some scripts have misleading names, duplicate versions, no file extensions or dynamic asset identifiers. The full original path is authoritative.', '',
        '## Summary by category', '', '| Category | Files |', '|---|---:|'
    ]
    for grp in sorted(groups):
        out.append('| %s | %d |' % (md(grp), len(groups[grp])))
    out.extend(['', '## Source-derived file entries', ''])
    for grp, rs in sorted(groups.items()):
        out.extend(['### '+grp, ''])
        for r in rs:
            url = GITHUB_BASE + quote(r['path'], safe='/')
            out.extend([
                '#### [`%s`](%s)' % (md(r['path']), url), '',
                '**Source-described purpose:** %s.' % md(r['introductory_source_comments'].rstrip('.')),
                '**Static code indicators:** %s; %d Export calls.' % (r['code_detected_tags'], r['export_calls']),
                '**Asset names referenced:** %s.' % (', '.join('`'+md(x)+'`' for x in r['mentioned_asset_suffixes'].split('; ')[:10]) if r['mentioned_asset_suffixes'] else 'None matched by scanner'),
                '**External dataset IDs (where statically detected):** %s.' % (', '.join('`'+md(x)+'`' for x in r['external_dataset_ids_detected'].split('; ')[:6]) if r['external_dataset_ids_detected'] else 'None detected'),
                '**Output/export arguments (where statically detected):** %s.' % (', '.join('`'+md(x)+'`' for x in r['export_argument_expressions'].split('; ')[:7]) if r['export_argument_expressions'] else 'None detected'),
                '**Execution/adoption status:** Not proven by source scan; see reviewed research decisions and Earth Engine task history.',
                '**Source fingerprint:** SHA-256 `%s` · %s lines.',
                ''
            ])
            out[-2] = out[-2] % (r['sha256'], r['lines'])
    (DOC / 'CODE_SCAN_CATALOG.md').write_text('\n'.join(out).rstrip()+'\n', encoding='utf-8')

    aout = ['# Earth Engine asset-name reference index', '',
            'This is a **static cross-reference**, not a confirmed producer-consumer dependency graph.',
            'Only constant-string patterns recognized by the scanner appear here.', '']
    for asset, refs in sorted(asset_index.items()):
        if len(refs) >= 2 or 'final' in asset or 'fusion' in asset:
            aout.extend(['## `'+asset+'`', ''])
            for f in sorted(set(refs)):
                aout.append('- [`%s`](%s)'%(md(f),GITHUB_BASE+quote(f,safe='/')))
            aout.append('')
    (DOC / 'ASSET_REFERENCE_INDEX.md').write_text('\n'.join(aout).rstrip()+'\n', encoding='utf-8')
    print('Generated %d source-derived entries.' % len(rows))
    print('  docs/CODE_SCAN_CATALOG.md')
    print('  docs/CODE_SCAN_CATALOG.csv')
    print('  docs/ASSET_REFERENCE_INDEX.md')
    if len(rows)!=156:
        print('WARNING: expected 156 archived files; inspect missing/extra sources.')

if __name__ == '__main__':
    main()
