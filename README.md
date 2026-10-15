# SplitSmart ↗

**Less math. More memories.** A small, private expense splitter for dinners, trips and everything friends share.

Vanilla HTML, CSS and JavaScript. No account, installation, tracking or backend.

![SplitSmart desktop interface with fictional weekend expenses](9-desktop.png)

## What it does

- Create a circle of up to 10 people and record up to 500 expenses.
- Split equally, exclude people, or use custom relative weights (2 pays twice as much as 1).
- Get the exact smallest number of transfers needed to settle the group, not a greedy approximation.
- Share a snapshot link, or export/import validated JSON backups.
- Keep your group on your device with localStorage.
- Use it on a phone, laptop or tablet. Keyboard labels, visible focus and reduced-motion support are included.

## Run it

Open `index.html` in a current browser. No build or dependencies required. For the most reliable clipboard support, use the HTTPS deployment or a local server:

```sh
python3 -m http.server 8000
# Open http://localhost:8000
```

Use **Load fictional demo** to explore, then **Clear group** to start fresh. The demo names and expenses are invented.

## The math

Amounts are converted into integer paise. Shares are allocated with the largest-remainder method: round each allocation down, then distribute leftover paise to the largest fractional parts, with list order breaking ties. Every expense sums exactly to the entered amount.

The settlement engine searches opposite-sign balances recursively and memoizes states. It tries all relevant pairings and selects the solution with the fewest transfers. The 10-person limit keeps this exact combinatorial search practical. Positive balance means money owed to a person; negative means they owe the group.

## Tests

```sh
node math.test.cjs
```

11 tests cover cent conservation, custom weights, excluded people, invalid inputs, malformed backups, exact settlement counterexamples, and 500 deterministic randomized ledgers. UI checks covered adding people/expenses, reload persistence, clean console, and no horizontal overflow at 320px and 390px.

## Privacy & limits

- Nothing is sent to an application server. Browser storage is device- and origin-specific; clearing site data removes your group.
- **A share link contains the group data in its URL fragment. Anyone with that link can read the names and expenses.** It is a snapshot, not live collaboration. Later edits do not sync.
- Links above 12,000 characters are blocked; export JSON for bigger groups. Imported backups must be under 1 MB.
- INR only. Custom shares are relative weights, not exact rupee amounts. Suggestions do not move real money.
- Export a backup before replacing data or clearing browser storage. No payment integrations or account recovery.

## Mobile preview

<img src="10-mobile-390.png" width="340" alt="SplitSmart responsive mobile view with fictional data">

## Project layout

`index.html` is the page, `style.css` the responsive theme, `logic.js` the independently testable arithmetic, `app.js` the local UI, and `math.test.cjs` the Node test suite. Screenshots were captured from the actual app, not design mockups.

Built as an original student web project. No external UI libraries or fonts.
