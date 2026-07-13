Read the @couple's forecast.md (not pdf one. STRICTLY)

The costomer said:
Ive been looking at the forecast part of the destiny matrix and am wondering how I get it to work out the figures and input into excel sheet? Can I send you the file I have in relation to this. To see what you think please?

. Second Energy: After age 40, subtract 40. So 59 - 40 = 19
Your second energy is 19 (The Sun).

Third Energy: Add them together. 6 + 19 = 25 -> 2 +5= 7

So your personal forecast key for this year is:

6->19->7

COUPLE'S FORECAST.pdf

Ok this is related to the age numbers around the outside of matrix ....it relates to a arcana so my arcana is number 6 so from that I calculate the other 2 energies
How do I capture or input all the various combos onto the interpretations spreadsheet
So for me my forecast for my current year/ age is ...

PERSONAL FORECAST (Current Year)

Current Age: 59

Position

Current Energy

Number

6

Key Energy

19

Outcome

7

Meaning

The main theme of
the year

How to unlock the
year

What this year
leads towards

Then underneath ...

CURRENT YEAR

6 - Current Energy

(pulled automatically from your Arcana database)

Your relationships, choices and matters of the heart become
the dominant theme this year ...

CURRENT YEAR

6 - Current Energy

(pulled automatically from your Arcana database)

Your relationships, choices and matters of the heart become
the dominant theme this year ...

19 - Key Energy

The way you bring this year into its highest expression is by
becoming visible, confident and allowing yourself to shine ...

7 - Potential Outcome

If you embrace both previous energies, this year finishes with
momentum, success, movement and breakthrough ...

Im 59 years young

Requirements:

1. [x] Calculate the person’s current age from their date of birth.

2. [x] Find the Arcana number shown on the outer age ring for their current age.
   This becomes Forecast Energy 1: Current Energy.

3. [x] Calculate the second age:
   - If the person is under 40, add 40.
   - If the person is over 40, subtract 40.

4. [x] Find the Arcana number shown on the outer age ring for that second age.
   This becomes Forecast Energy 2: Key Energy.

5. [x] Calculate Forecast Energy 3: Outcome.
   Add Forecast Energy 1 and Forecast Energy 2 together.
   If the total is greater than 22, add the digits once to reduce it.

Example:
Current age 59 = Arcana 6
59 - 40 = 19
Age 19 = Arcana 19
6 + 19 = 25
2 + 5 = 7

Final forecast combination:
6 - 19 - 7

6 = Current Energy
19 = Key Energy
7 = Potential Outcome

6. [x] Display the three forecast numbers clearly on the chart or in a forecast section.

7. [x] Each forecast number must automatically pull the correct written interpretation from the spreadsheet database.

---
**Status: ALL COMPLETED AND IMPLEMENTED**
- Age calculation dynamically performed from birth date.
- Yearly Forecast energies determined using the exact outer age ring formulas.
- Added full support to Python Excel sync tool (`tools/update_interpretations.py`) for `FORECAST` and `COMPAT_FORECAST` master positions.
- Parsed Nika Matrix's couple forecast book (`docs/COUPLE’S FORECAST .md`) for all 22 Arcana for both single/couple readings, and saved them to the spreadsheet database (`data/interpretations.xlsx`).
- Rendered interactive widgets in the `#derived` section at the bottom of the chart to view/click the forecast.
- Added highlighting of the current age node on the outer ring of the chart.
- Activated the top navigation menu button "◎ Yearly Forecast" to quickly show forecast details.
- Integrated the Script Board pop-out page (`script_board.html`) to display the new forecast details in sync.
