# Project Notes

## Current state

What the app currently does:
- Add food entries
- Shows calories and protein totals
- Saves entries in localStorage
- Has target values for calories and protein
- Has totals dashboard / progress cards

Main files/components:
- App: probably owns main state
- TotalsPanel: shows totals/targets
- ProgressCard: reusable card for calorie/protein target
- Entry list component: shows entries
- Add entry form: adds a new food entry

Important state:
- entries
- ingredients
- calorie target
- protein target

Data saved in localStorage:
- entries
- custom ingredients
- calorie target
- protein target

## Decisions already made

- Use localStorage instead of a database for now
- Keep the app simple before adding accounts/cloud stuff
- Move target state higher up so more components can use it
- Use helper functions for calculations like protein efficiency

## Things I don't fully understand yet

- Exact best structure for the dashboard components

## Bugs / weird behaviour

## Log
### 4.5.26
gave succes/warning colours to efficiency summary
and dynamically assigned classNames
### 9.5.26
completeley refactored all button and input components to use shadcn radix components
styled so it scrolls nicely on a phone and takes up one simple page on a larger screen
gave scroll trays and cards nice styling and got everything working ready for typescript conversion

## Next session restart note

Open this file first:
- NOTES.md

Then open this code file:
- App.jsx
- TotalsPanel.jsx
- ProgressCard.jsx

Next tiny task:

Do not get distracted by:
- Weekly totals
- Custom ingredients
- Styling everything perfectly