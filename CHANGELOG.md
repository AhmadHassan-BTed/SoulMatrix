# Changelog - Soul Blueprint Matrix (New Features Sync)

## [June 2026] - Destiny Matrix Compatibility Chart Support (on branch `feature/modern-chart-visuals`)

This update introduces a full **Compatibility Matrix Chart** combined from two Dates of Birth (DOBs), complete with real-time sync for pop-out screen viewing, custom Excel database management, and program/combination detection.

### 👥 Compatibility Calculations & Tabs
- Computes combined matrix numbers by adding corresponding nodes of Partner 1 & Partner 2 (reduced using base-22 numerology).
- Dynamically loads compatibility-specific tabs (e.g. `👥 General`, `♥ Love Dynamics`, `$ Shared Finance`, `☽ Relationship Karma`) and filters out single-DOB reading tabs.
- Supports adding custom compatibility categories and sections in Excel without changing any code.

### 📁 Excel-to-CSV Database Sync
- Sync tool now reads from a new **`Compatibility`** worksheet inside `data/interpretations.xlsx`.
- Automatically maps compatibility sections to `compat_` prefixed modules and compatibility programs to `compat_programs` inside the unified `data/interpretations.csv`.

### 📺 Pop-out Script Board Synchronization
- Added `readingMode` synchronization over the `BroadcastChannel`.
- The pop-out Script Board automatically updates its header details (displaying both client names and birth dates), sidebar nodes, and tabs to match the main screen's reading mode (Single vs Compatibility).

---

## [June 2026] - Modern Chart Visual Refresh (on branch `feature/modern-chart-visuals`)

This update delivers a visual modernization of the interactive chart dashboard with vibrant gradients, bolder outlines, glowing node effects, improved labels contrast, and micro-interactions.

### 📸 Visual Comparison (Before vs After)

#### Before Visual Refresh
![Before Visual Refresh - Muted gradients and low contrast labels](./docs/images/before_ui_change.png)

#### After Visual Refresh
![After Visual Refresh - Vibrant gradients, modern glow effects, high contrast labels](./docs/images/after_ui_change.png)

### Key Enhancements

| Element / Area | Before the UI Change | After the UI Change |
| :--- | :--- | :--- |
| **Zone Colors** | Mostly purple-lilac scheme across all nodes, making the different areas blend together. | **Vibrant Theme Gradients**; each area has a distinct identity (e.g. Portrait = Deep Purple, Karma = Gold/Amber, Material Karma = Crimson-Pink, Money/Relations = Emerald Green). |
| **Node Outlines** | Thinner borders (`1.6px`) with muted color values. | **Bolder Outlines (`1.8px`)** in matching vivid colors, providing a crisp, high-definition look. |
| **Node Glow Effects** | Standard low opacity (`.10`) fills with minor blur. | **Premium Neon Glow (`.18` opacity)** with increased blur deviation, giving selected/hovered nodes a high-end glowing look. |
| **Zone Label Visibility** | Lower contrast (`opacity: .4`), smaller fonts. | **High Contrast (`opacity: .60` or higher)** and slightly larger font sizes, making zone titles like `TALENTS & POTENTIALS` easy to read. |
| **Age Timeline** | Default font values, lower contrast. | **Prominent Timeline Labels** with high-contrast text (`opacity: 0.95`), framing the chart geometry perfectly. |
| **Hover Transitions** | Basic brightness boost. | **Micro-interactions** including scale zoom (`transform: scale(1.08)`) and bright neon outlines. |

---

## [June 2026] - Usability & Sync Adjustments

This update refines the live reading experience with enhanced text controls, active program overlays, and interactive cross-window navigation.

### Adjustments Implemented
- **Script Board Font Zooming**: Expanded font sizing to four granular levels (Small, Medium, Large, Extra Large) with persistent storage and active button highlighting.
- **Active Programs Display on Script Board**: Displays a summary of all active programs in the default reading pane view when no node is selected, and adds an "Active Programs" section at the top of the sidebar.
- **Program Visual Highlighting**: Adds a pulsing gold/orange drop-shadow glow and stroke animation to mark active program numbers on the main chart SVG.
- **Interactive Navigation**: Integrates click navigation from the main chart's active program dashboard to open, focus, and smoothly scroll to the program description on the Script Board.

---

## [June 2026] - Script Board & 3-Number Programs Update

This update introduces real-time multi-screen synchronization (perfect for live streaming) and dynamic support for combined 3-number Destiny Matrix programs.

---

### 1. New Features

#### 📺 Pop-out Script Board (`script_board.html`)
- Created a separate window view designed to be dragged onto a second monitor.
- Real-time bidirectional click synchronization (clicking a node on either screen syncs the other screen).
- Client metadata header showing calculated name and Date of Birth.
- Text zooming controls (`A`, `A+`, `A++`) to adjust reading text size on a second screen.
- Left-sidebar node navigator showing all calculated numbers at a glance.
- Dedicated tabs for module classifications and an active programs overview.

#### ✦ Dynamic 3-Number Combination Programs
- Integrated checking logic that automatically detects when three computed chart nodes match a combination code defined in your interpretations database.
- Designed a new "Active Programs" widget in the main dashboard next to the Purpose calculations.
- Integrated program reading cards into the side panels of any individual nodes that form part of active combinations.

---

### 2. Improvements & Sync Enhancements

#### 📁 Excel Synchronizer (`update_interpretations.py`)
- Upgraded mapping and validation logic to process 3-number combinations (e.g., matching position `M-N-D` with code `15-20-5`).
- Removed strict integer format constraints on the `Number` column to support string combination values (like `15-20-5` or `18-9-9`) for program rows.

#### 📁 Main Application Chart (`soul_matrix.html`)
- Added a **📺 Script Board** button to the navigation bar.
- Modified CSV parser to load combination codes cleanly and ignore browser console errors.
- Established a `BroadcastChannel` listener for instant offline communication between windows.

#### 📁 Documentation (`HOW-TO-UPDATE.md`)
- Added detailed step-by-step guidance on how to define and update 3-number combination programs inside your Excel sheet.

#### 📁 Excel Template (`interpretations.xlsx`)
- Appended a sample Destiny Matrix program (the Rebel program: `15-20-5` in `M-N-D` positions) to the sheet so you can immediately see the system in action.
