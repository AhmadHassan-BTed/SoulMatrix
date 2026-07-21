# Soul Matrix Development & Fixes TODO

## Completed Tasks

### 1. 🔮 Yearly & Couple Forecast Integration
- [x] 3-number forecast calculations (Energy 1: Current Age, Energy 2: ±40 shift, Energy 3: reduced sum).
- [x] Couple forecast calculations (Current+Current, Key+Key, Outcome+Outcome reduced).
- [x] Prominent Forecast Triple Key Banner on chart view showing all 3 numbers.
- [x] Side panel section routing:
  - Click Energy 1 -> displays Energy of the Period (`theme`).
  - Click Energy 2 -> displays Event Line (`recommendations`).
  - Click Energy 3 -> displays Outcome of the Period (`watch_out`).
  - Click Outer Age Ring Node -> displays 3-card overview.

### 2. 🛠️ R & R1 Position & Tab Fixes
- [x] **R1 (Relationship Dynamics)**: Updated `update_interpretations.py` & `update_interpretations.ps1` to map `R1` to `relationships` (`Love` channel).
- [x] **R (Money & Relationships)**: Updated synchronizers and position definitions so `R` maps to `relationships` or `money`.
- [x] **Custom Section Sanitization**: Sanitized punctuation in custom Excel section names (e.g. `Love/relationship - problems` -> `relationships` / `wound`).
- [x] **Smart Module Tab Auto-Selection**: Updated `openPanel()` in `soul_matrix.html` so clicking any node automatically switches to the module tab containing interpretation text for that position (e.g. `R1` -> `Love` tab).
- [x] Synchronized database (`interpretations.xlsx` -> `interpretations.csv`).
- [x] Updated documentation (`CHANGELOG.md`, `HOW-TO-UPDATE.md`, `TODO.md`).
