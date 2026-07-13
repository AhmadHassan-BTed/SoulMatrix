# Soul Blueprint Matrix - How to Update Your Interpretations

## What you have

The files in the `Solution` folder:

```
SoulMatrix/
├── data/
│   ├── interpretations.xlsx      ← Master spreadsheet database (edit this!)
│   └── interpretations.csv       ← Dynamic CSV database compiled by sync tool
├── src/
│   ├── soul_matrix.html          ← The interactive chart page
│   ├── script_board.html         ← Pop-out streamer Script Board
│   ├── server.py                 ← Python local web server
│   └── server.ps1                ← PowerShell local web server (fallback)
├── tools/
│   ├── update_interpretations.py ← Excel-to-CSV sync tool engine
│   └── backups/                  ← Automatically generated CSV backups
├── run_locally.bat               ← Launch the web application locally
├── run_update.bat                ← Compile Excel edits to CSV database
└── HOW-TO-UPDATE.md              ← These instructions
```

### How to Run the App

Double-click **`run_locally.bat`**. This is the recommended way to open the app, as it runs a lightweight local web server to prevent browsers from blocking your `interpretations.csv` data (solving the CORS safety error).

> [!NOTE]
> The launcher (`run_locally.bat`) is fully automated:
>
> - It checks if Python is available. If not, it will automatically attempt to install Python for you via the Windows Package Manager (`winget`).
> - If Python cannot be installed, it will automatically fall back to the built-in PowerShell server (`server.ps1`), requiring zero installation on your part.

---

## Understanding the CSV structure

The CSV has exactly five columns:

| position | module | section  | number | text                                     |
| -------- | ------ | -------- | ------ | ---------------------------------------- |
| A        | core   | meaning  | 1      | "You carry the energy of the pioneer..." |
| A        | core   | positive | 1      | "Natural born leader, self-reliant..."   |
| E        | karma  | karmic   | 10     | "Your karmic tail carries..."            |

**What each column means:**

- **position** - The node on the chart (A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, R1, R2, S, T, F1, F2, G1, G2, H1, H2, I1, I2, L1, L2, or custom forecast keys: `FORECAST`, `COMPAT_FORECAST`)
- **module** - The tab category (core, relationships, karma, money, purpose, forecast, compat_forecast - or any new name you invent)
- **section** - The sub-heading within that tab (meaning, positive, shadow, healing, attraction, lesson, wound, partner, karmic, past_life, resolution, money_flow, block, activation, life_purpose, gifts, mission, theme, recommendations, watch_out - or any new name you invent)
- **number** - The numerological value (1 through 22)
- **text** - Your interpretation text for that combination

---

## How to edit in Excel - step by step

### Opening the file

1. Open your Excel workbook (e.g. `data/interpretations.xlsx` or `data/Interpretations backup.xlsx`).
2. You will see 5 user-friendly columns: **Position**, **Position Meaning**, **Section**, **Number**, and **Interpretation Text**.

### Adding or editing an interpretation

1. Find the row for the **Position** (A, B, C, etc.) and **Number** (1 to 22) you want to update.
2. In the **Section** column, write:
   - `Interpretation` for most general positions.
   - For Position A, choose `Core Meaning`, `Core Positive`, `Core Shadow`, `Core Healing`, or `Core Shadow Lessons`.
3. Click in the **Interpretation Text** cell and update the reading text. (Excel handles line breaks and multi-line text perfectly inside cell formatting).
4. Save the Excel file (**Ctrl+S**).

### Syncing with the Matrix Chart

1. Double-click the **`run_update.bat`** script file in the `SoulMatrix` folder.
2. A console window will pop up. It will:
    - Automatically check if Python is installed on your computer. If not, it will try to install it.
    - If Python is not present and cannot be installed automatically (e.g., offline or restricted permissions), the script **automatically falls back to a built-in Windows PowerShell synchronizer** using your local Microsoft Excel COM engine.
    - Automatically back up your current `data/interpretations.csv` to a timestamped backup inside the `tools/backups/` folder.
    - Parse your Excel spreadsheet.
    - Standardize column headings and translate human-friendly terms into the lowercase keys that the web application requires.
    - Print a success summary showing the number of entries successfully synced.
3. Reload Chrome (press **Ctrl+R**). The chart will update instantly with your new interpretations!

---

## Adding a completely new category (module)

You do NOT need any coding to add a new tab. Just use a new module name in the **module** column and the chart creates the tab automatically.

**Example - adding a "Past Life" module:**

| position | module    | section | number | text                                      |
| -------- | --------- | ------- | ------ | ----------------------------------------- |
| A        | past_life | theme   | 1      | "In a past life you were a leader who..." |
| A        | past_life | lesson  | 1      | "The lesson carried forward is..."        |
| A        | past_life | gift    | 1      | "The gift you brought with you is..."     |

Save, refresh Chrome - a new **Past Life** tab appears automatically on every node panel.

---

## Editing Forecast Interpretations

The forecast module displays interpretations based on the **client's age**. Instead of writing interpretations for each specific age node on the outer ring (which would require 56 separate sets of text), the app looks up a centralized set of **22 master Arcana forecasts** from the spreadsheet database:

### 1. Single Yearly Forecast
- **Excel Tab**: `Master_Database`
- **Position**: `FORECAST`
- **Sections**:
  - `Theme` (or `theme`) - The primary yearly theme.
  - `What to watch for` (or `watch_out`) - Traps, risks, and shadow expressions.
  - `Recommendations` (or `recommendations`) - Action steps to align with the energy.
- **Numbers**: `1` through `22` (the Arcana numbers).

### 2. Couple Compatibility Forecast
- **Excel Tab**: `Compatibility`
- **Position**: `COMPAT_FORECAST`
- **Sections**:
  - `Theme` (or `theme`) - The couple's joint yearly forecast theme.
  - `What to watch for in the couple` (or `watch_out`) - Joint relationship traps and risks.
  - `Recommendations for the couple` (or `recommendations`) - Advice for navigating the year together.
- **Numbers**: `1` through `22`.

*Note: Clicking any outer age ring node (e.g. `age22.5` or `age58.75`) or the forecast section items in the bottom derived panel will automatically look up its Arcana value inside these master forecast sections.*

---

## Adding a completely new section within an existing module

Same idea - just use a new name in the **section** column:

| position | module | section          | number | text                                       |
| -------- | ------ | ---------------- | ------ | ------------------------------------------ |
| A        | core   | combination_code | 1      | "When Position A holds 1 combined with..." |

A new **Combination Code** section will appear inside the Core tab automatically.

---

## Adding 3-Number Programs (Combination Codes)

The tool dynamically detects when a client has a specific combination of three numbers across three different positions (for example, in the Karmic Tail, Money line, or Talent line).

To define a 3-number program in Excel:

1. In the **Position** column, write the three nodes separated by hyphens (e.g., `M-N-D` or `R-R1-R2`).
2. In the **Section** column, write the name of the program (e.g., `The Rebel` or `The Wizard`).
3. In the **Number** column, write the three numbers separated by hyphens (e.g., `15-20-5` or `18-9-9`).
4. In the **Interpretation Text** cell, write the combined reading text.

**Example Row:**

| Position | Position Meaning | Section   | Number  | Interpretation Text                                  |
| -------- | ---------------- | --------- | ------- | ---------------------------------------------------- |
| `M-N-D`  | `Karmic Tail`    | `The Rebel` | `15-20-5` | `This combination is known as the Rebel program...` |

Once you run `run_update.bat` and reload the app, if a client has those exact numbers in those three positions, the combined reading will automatically appear on both the main dashboard and the pop-out script board!

---

## Adding Outer Age Timeline Interpretations

The chart supports 56 intermediate age timeline nodes (e.g. Age 21.25, 22.5, 23.75, 25, 26.25, 27.5, 28.75) around the perimeter.

To add or update interpretations for these outer age nodes:

1. In the **Position** column, write `Age` followed by the age coordinate (e.g. `Age25` or `Age 22.5`). The sync tool accepts spaces, commas, and decimals.
2. In the **Section** column, write:
   - `Interpretation` (or leave it blank) to map to the `yearly` theme section automatically.
   - Or write a custom sub-heading (like `current_cycle`, `next_phase`, `yearly`).
3. In the **Number** column, write the calculated number (1 to 22) that this age node holds.
4. In the **Interpretation Text** cell, write the reading text.

**Example Row:**

| Position | Position Meaning       | Section  | Number | Interpretation Text                              |
| -------- | ---------------------- | -------- | ------ | ------------------------------------------------ |
| `Age25`  | `Age 25 (25 years old)` | `yearly` | `4`    | `At Age 25, you enter a cycle of structure...`   |

When you double-click `run_update.bat`, the sync engine will normalize the key to lowercase (e.g. `age25`), automatically map it to the `forecast` module (or `compat_forecast` for rows placed in the Compatibility sheet), and skip strict integer validation on the Number column if a decimal key is used.

---

## Positions reference

| Position | Name                       | Formula        |
| -------- | -------------------------- | -------------- |
| A        | Portrait / Avatar          | Day of Birth   |
| B        | Spiritual Essence          | Month of Birth |
| C        | Material Karma             | Year Digit Sum |
| D        | Spiritual Karma            | A + B + C      |
| E        | Core Energy / Soul Mission | A + B + C + D  |
| F        | Mother Line                | A + B          |
| G        | Mother Diagonal            | B + C          |
| H        | Father Line                | C + D          |
| I        | Father Diagonal            | D + A          |
| J        | Throat / Physical Chakra   | A + E          |
| K        | Talents & Potentials       | B + E          |
| L        | Relationship Crisis        | C + E          |
| M        | Ideal Partner              | D + E          |
| N        | Karmic Tail                | M + D          |
| O        | Child–Parent Balance       | A + J          |
| P        | Comfort Zone / Third Eye   | B + K          |
| Q        | Material Talent            | L + C          |
| R        | Money & Relationships      | M + L          |
| R1       | Relationship Dynamics      | R + M          |
| R2       | Profession / Success       | R + L          |
| S        | Relationship Block         | J + E          |
| T        | Heart's Desire             | K + E          |
| L1       | Lineage + Core             | E + L2         |
| L2       | Lineage Combined           | F + G + H + I  |
| F1       | Paternal Upper Gift        | F + F2         |
| F2       | Paternal Inherited Talent  | F + L2         |
| G1       | Maternal Upper Gift        | G + G2         |
| G2       | Maternal Inherited Talent  | G + L2         |
| H1       | Child Character (Paternal) | H + H2         |
| H2       | Father Ancestral Karma     | H + L2         |
| I1       | Child Character (Maternal) | I + I2         |
| I2       | Mother Ancestral Karma     | I + L2         |

---

## Adding Compatibility Matrix Interpretations

The application supports generating a **Compatibility Matrix Chart** combined from two Dates of Birth (DOBs). To store and sync compatibility interpretations, you will add a new worksheet inside your Excel workbook.

### Step 1: Create the Compatibility Sheet
1. Open `data/interpretations.xlsx`.
2. Create a new sheet named exactly **`Compatibility`**.
3. Add the following **five columns** (exactly matching the structure of the primary sheet):
   - **`Position`**
   - **`Position Meaning`**
   - **`Section`**
   - **`Number`**
   - **`Interpretation Text`**

### Step 2: Define Compatibility Readings
- **Individual Combined Nodes**: Write the node code (A, B, C... E, J, K, etc.) in the **`Position`** column. In the **`Section`** column, choose a category name (e.g. `General Compatibility`, `Love Dynamics`, `Financial Union`, `Karmic Connection`). 
- **Compatibility Programs (3-Number Combinations)**: Write the combination nodes separated by hyphens (e.g. `M-N-D` or `A-B-C`) in the **`Position`** column. In the **`Section`** column, write the name of the compatibility program (e.g. `Mutual Success`). The **`Number`** column should hold the combined three-number code (e.g. `15-20-5`).

When you double-click `run_update.bat`, the sync tool will automatically parse the `Master_Database` sheet (for Single DOB) and the `Compatibility` sheet, prefix the compatibility sections with `compat_` behind the scenes, and output a unified `interpretations.csv` database.

---

## Built-in module and section names

These names are already wired to friendly tab labels. You can use any name you like - unknown names will be auto-formatted - but these give the cleanest result:

**Modules:** `core` · `relationships` · `karma` · `money` · `purpose` · `forecast`

**Sections (Core):** `meaning` · `positive` · `shadow` · `healing`

**Sections (Relationships):** `attraction` · `lesson` · `wound` · `partner`

**Sections (Karma):** `karmic` · `past_life` · `resolution`

**Sections (Money):** `money_flow` · `block` · `activation`

**Sections (Purpose):** `life_purpose` · `gifts` · `mission`

**Sections (Forecast):** `current_cycle` · `next_phase` · `yearly`

---

## Quick-edit inside the chart (session only)

You can also edit text directly in the panel by clicking ** Edit Mode** in the top-right of the side panel. This is useful for testing wording during a live session. Important: these edits only last until you refresh - they are not saved. To keep them permanently, copy the text into your CSV.

---

## If the chart shows a browser security / CORS warning

Because you are opening `soul_matrix.html` directly as a local file (`file://` protocol), modern web browsers (Chrome, Edge, Safari, Firefox) block the page from reading the local `interpretations.csv` automatically due to built-in security policies (CORS policy restrictions).

To bypass this restriction and load your interpretations:

1. Click the ** Load CSV** button in the top navigation bar of the page.
2. Select your `interpretations.csv` file from the file explorer window.
3. The page will read and parse your interpretations instantly, and cache them in your browser.
4. **Subsequent visits**: Future page loads will automatically use the cached interpretations from your browser cache, meaning you won't need to upload the file again unless you run `run_update.bat` to update the CSV data.
5. **Updating**: Whenever you make edits in Excel and run `run_update.bat`, simply click ** Load CSV** again to upload the updated `interpretations.csv` file from the explorer window.

> [!TIP]
> **Checking Load Status**: To keep the layout clean, the load status banner automatically fades out and disappears after 5 seconds. You can check the current database status at any time by hovering over or clicking the circled "i" (**ⓘ**) button in the top right of the header. Clicking it will toggle the status banner back on or off.

---

## Backing up your data

Your entire interpretation database is in one file: `data/interpretations.xlsx`. Back this up regularly by copying it to a USB drive or cloud storage. The HTML and CSV files do not need to be manually backed up, as `run_update.bat` automatically creates backups of your CSV data inside `tools/backups/` when run, and the Excel file is the master database.

---

## Summary of how to add new interpretations

1. Open your Excel workbook (e.g. `data/interpretations.xlsx`).
2. Add or edit rows: `Position, Position Meaning, Section, Number, Interpretation Text`.
3. Save the workbook (**Ctrl+S**).
4. Double-click `run_update.bat` to generate the CSV.
5. Refresh Chrome.
6. Done - the chart updates instantly.

No coding. No developer. No server. Just Excel, a double-click sync, and Chrome.
