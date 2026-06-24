# ✦ SoulMatrix ✦

> A premium, dynamic live-reading dashboard and pop-out Script Board for Destiny Matrix (Soul Blueprint) analysis, featuring real-time multi-screen synchronization and couples compatibility engines.

---

## 📺 Overview

**SoulMatrix** is a specialized tool designed for numerologists, spiritual consultants, and content creators (specifically optimized for OBS/TikTok Live streaming). It calculates a client's Destiny Matrix octagram using their birth date, plots it onto an interactive SVG chart, and dynamically renders detailed script interpretations from a customizable Excel/CSV database.

Additionally, it provides a secondary **Script Board** window that communicates offline and in real-time, allowing you to run readings on a double-monitor setup without lag or external server dependency.

---

## 🌟 Key Features

* **👤 Single & 👥 Couples Compatibility Modes**: Toggle between individual matrix readings and combined relationship charts. The compatibility engine sums both partners' coordinates and reduces them (Major Arcana modulo-22) to plot a shared energetic map (Love, Finances, friction points, joint purposes).
* **📅 Outer Ring Age Timeline**: Displays decadic life milestone labels (`0/80`, `10`, `20`, `30`, `40`, `50`, `60`, and `70`) concentrically outside the octagram's anchor points for instant chronological reference during live sessions.
* **📺 Pop-out Script Board**: A second screen layout for streamers that runs real-time, bidirectional sync (clicking nodes on either screen highlights and highlights the other screen instantly).
* **🔍 Dynamic Excel Sync Tool**: Edit and maintain your entire database of interpretations (including custom categories or 3-number combination programs) in a standard Excel sheet. Run `run_update.bat` to sync it to the application.
* **🔎 Text Sizing Zoom**: Instant zoom options (**Small**, **Medium**, **Large**, **Extra Large**) on the Script Board to adjust text readability on streams. Choice is persisted in browser local storage.

---

## 🛠 Tech Stack

* **Frontend**: HTML5, Vanilla CSS3 (with custom variables and CSS keyframe glowing animations), and Modern JavaScript (ES6+).
* **Synchronization**: HTML5 `BroadcastChannel` API (for fast, offline cross-window communication).
* **Database Parsing**: HTML5 `FileReader` and local storage caching.
* **Sync Tool**: Python 3 and the `openpyxl` library.

---

## 📂 Repository Structure

The project has been organized into a structured directory layout:
* **`data/`**: Holds the Excel master database (`interpretations.xlsx`) and compiled data (`interpretations.csv`).
* **`src/`**: Core application files including HTML pages and server scripts (`soul_matrix.html`, `script_board.html`, `server.py`, `server.ps1`).
* **`tools/`**: Python Excel-to-CSV database synchronizer engine (`update_interpretations.py`) and CSV backups directory (`backups/`).
* **`run_locally.bat`**: Direct workspace root launcher to start the web server.
* **`run_update.bat`**: Direct workspace root compile script to sync Excel edits.

---

## 🚀 Quick Start

1. **Launch the Chart**:
   * Double-click `run_locally.bat` to start the local Python server.
   * Open `http://localhost:8000/src/soul_matrix.html` in Google Chrome.

2. **Open the Pop-out Board**:
   * Click the **📺 Script Board** button on the main navigation bar.
   * Drag the script board to your second screen or capture it inside OBS.

3. **Manage Interpretations in Excel**:
   * Open `data/interpretations.xlsx` and make edits or add new columns.
   * Double-click `run_update.bat` to sync changes. Reload the browser page to apply updates.

---

## 📈 Calculation Engine Details

### Arcana-22 Reduction Math
All calculations in the chart are mathematically reduced to a number between 1 and 22 based on the Major Arcana:
$$\text{reduced}(n) = \begin{cases} n, & \text{if } n \le 22 \\ \text{sum of digits of } n, & \text{if } n > 22 \end{cases}$$
If the intermediate sum is still greater than 22, it is recursively reduced.

### Couples Summation
Compatibility charts sum the individual partner matrix points for each position and apply the reduction:
$$\text{Node}_{\text{compatibility}} = \text{reduced}(\text{Node}_{\text{PartnerA}} + \text{Node}_{\text{PartnerB}})$$
Derived purposes (Earth/Sky, Personal, Social, Paternal, Maternal, and Spiritual) and the Chakra Map are computed dynamically from these combined nodes.
