#!/usr/bin/env python3
"""
Soul Blueprint Matrix - Compiler & Release Packager Engine.
Author: Ahmad Hassan (B-Ted)
"""

import os
import sys
import shutil
import zipfile
from datetime import datetime

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
DATA_DIR = os.path.join(PROJECT_ROOT, "data")
TOOLS_DIR = os.path.join(PROJECT_ROOT, "tools")

VERSION = "1.2.0"


def compile_database():
    """Runs the database synchronizer script to compile Excel -> CSV."""
    print("=" * 60)
    print(" [STEP 1/2] Compiling Master Database (xlsx -> csv)...")
    print("=" * 60)
    
    sync_script = os.path.join(TOOLS_DIR, "update_interpretations.py")
    if os.path.isfile(sync_script):
        try:
            sys.path.insert(0, TOOLS_DIR)
            import update_interpretations
            update_interpretations.main()
        except Exception as e:
            print(f"[WARNING] Database compilation encountered an issue: {e}")
            print("Proceeding with existing CSV database...")
    else:
        print("[ERROR] update_interpretations.py not found!")


def create_release_zip():
    """Compiles clean files into a versioned zip package."""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    zip_filename = f"SoulMatrix_v{VERSION}_{timestamp}.zip"
    latest_filename = f"SoulMatrix_v{VERSION}_Latest.zip"
    
    zip_path = os.path.join(PROJECT_ROOT, zip_filename)
    latest_path = os.path.join(PROJECT_ROOT, latest_filename)

    print("\n" + "=" * 60)
    print(f" [STEP 2/2] Packaging Release Zip: {zip_filename}...")
    print("=" * 60)

    files_to_pack = [
        "src/soul_matrix.html",
        "src/script_board.html",
        "src/server.py",
        "src/server.ps1",
        "data/interpretations.xlsx",
        "data/interpretations.csv",
        "tools/update_interpretations.py",
        "tools/update_interpretations.ps1",
        "run_locally.bat",
        "run_update.bat",
        "build_release.bat",
        "README.md",
        "HOW-TO-UPDATE.md",
        "CHANGELOG.md"
    ]

    packed_count = 0
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as z:
        for rel_path in files_to_pack:
            abs_path = os.path.join(PROJECT_ROOT, rel_path)
            if os.path.exists(abs_path):
                z.write(abs_path, rel_path)
                packed_count += 1
                print(f" [OK] Added: {rel_path}")
            else:
                print(f" [WARNING] File missing (skipped): {rel_path}")

    # Create latest copy
    shutil.copy2(zip_path, latest_path)

    size_mb = os.path.getsize(zip_path) / (1024 * 1024)
    print("\n" + "=" * 60)
    print("         SUCCESSFUL BUILD & PACKAGE RELEASE")
    print("=" * 60)
    print(f" [OK] Version Tag     : v{VERSION}")
    print(f" [OK] Release Archive : {zip_filename}")
    print(f" [OK] Latest Shortcut : {latest_filename}")
    print(f" [OK] Items Packaged  : {packed_count} files")
    print(f" [OK] Package Size    : {size_mb:.2f} MB")
    print(f" [OK] Location        : {zip_path}")
    print("=" * 60 + "\n")


if __name__ == "__main__":
    compile_database()
    create_release_zip()
