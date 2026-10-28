#!/usr/bin/env python3
"""Read-only SHA-256 and lightweight geospatial metadata inventory for a downloaded GIS export directory.

Use on the authoritative local project or a downloaded Drive export folder.
Default output is deliberately under data/private/, which should remain git-ignored.
No files are opened in write mode except the output manifest.
"""
from __future__ import annotations
import argparse
import csv
import hashlib
from pathlib import Path
import sys

EXTENSIONS = {'.tif','.tiff','.geojson','.gpkg','.shp','.dbf','.shx','.prj','.csv','.json','.kml','.kmz','.png','.jpg','.jpeg','.zip'}
SKIP_DIRS = {'.git','.venv','venv','node_modules','__pycache__','dist','build','data/private'}
FIELDNAMES = ['relative_path','suffix','size_bytes','sha256','raster_crs','raster_width','raster_height','raster_bands','raster_nodata','raster_overviews','raster_layout','note']

def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open('rb') as stream:
        for chunk in iter(lambda: stream.read(4 * 1024 * 1024), b''):
            h.update(chunk)
    return h.hexdigest()

def metadata(path):
    data = dict.fromkeys(FIELDNAMES[4:11], '')
    note = ''
    if path.suffix.lower() in {'.tif','.tiff'}:
        try:
            import rasterio
            with rasterio.open(path) as ds:
                data.update(raster_crs=str(ds.crs), raster_width=ds.width, raster_height=ds.height,
                            raster_bands=ds.count, raster_nodata=ds.nodata, raster_overviews=';'.join(map(str,ds.overviews(1))),
                            raster_layout=ds.tags(ns='IMAGE_STRUCTURE').get('LAYOUT',''))
        except ImportError:
            note = 'rasterio not installed; file hash recorded only'
        except Exception as exc:
            note = 'metadata unreadable: '+str(exc).replace('\n',' ')[:120]
    return data,note

def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--source',type=Path,required=True,help='Local original project directory or downloaded Drive exports folder')
    ap.add_argument('--output',type=Path,default=Path('data/private/local_file_inventory.csv'))
    args = ap.parse_args()
    source=args.source.resolve()
    if not source.is_dir():ap.error(f'Source directory not found: {source}')
    outfile=args.output.resolve()
    if source == outfile or outfile.is_relative_to(source / '.git'):
        ap.error('Refusing to output into .git')
    candidates = []
    for file in source.rglob('*'):
        if not file.is_file() or file.suffix.lower() not in EXTENSIONS:continue
        rel=file.relative_to(source)
        if any(part in SKIP_DIRS or part=='private' for part in rel.parts[:-1]):continue
        if file.resolve()==outfile:continue
        candidates.append((rel,file))
    rows=[]
    for rel,path in sorted(candidates,key=lambda x:str(x[0]).lower()):
        m,note=metadata(path)
        rows.append([rel.as_posix(),path.suffix.lower(),path.stat().st_size,sha256_file(path),
                     *(m[k] for k in FIELDNAMES[4:11]),note])
    outfile.parent.mkdir(parents=True,exist_ok=True)
    with outfile.open('w',newline='',encoding='utf-8') as stream:
        w=csv.writer(stream,lineterminator='\n');w.writerow(FIELDNAMES);w.writerows(rows)
    print(f'Inventoried {len(rows)} actual files; output: {outfile}')
    print('Review this file before sharing; it proves only local file identity and structural metadata.')
    return 0

if __name__=='__main__':sys.exit(main())
