# Teacher Dashboard — Tracking, Parent Communication & Tasks

A bilingual (English/Arabic) tracking dashboard for a Grade 5 math classroom in Qatar. Tap-friendly for tablets, themed in maroon, gold, white and desert blue, with full RTL support for Arabic.

## Features

- **Bilingual UI** — an `EN / AR` toggle in the header swaps all interface text and flips the page between `ltr` and `rtl` instantly. Your language choice, students, and reminders are remembered on the device (via `localStorage`).
- **Student dashboard** — a tap-friendly card per student to log **Behavior**, **Marks/Understanding**, and **Activity** (🟢/🟡/🔴), plus a points counter with `+`/`−`.
- **WhatsApp parent reports** — one tap generates an encouraging, potential-focused message **in Arabic** (regardless of the UI language) based on the student's current metrics, and opens it in WhatsApp ready to send.
- **Quick Reminder widget** — save a task title, date and time straight to your Google Calendar.
- **Save Daily Data** — sends every student's Behavior/Marks/Activity/Points for the day to a Google Sheet with one tap.

The last two features talk to a small Google Apps Script backend (`Code.gs`) that you deploy yourself — your data stays in your own Google account.

## Files

| File | Purpose |
|---|---|
| `index.html` | Page structure and markup |
| `styles.css` | Qatari-themed, responsive/RTL-aware styling |
| `script.js` | Translations, dashboard logic, WhatsApp messages, backend calls |
| `Code.gs` | Google Apps Script backend — paste into a Google Sheet's Apps Script editor |

## Running it locally

Open `index.html` directly, or better, serve the folder with a tiny local server so `fetch()` behaves consistently across browsers:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

No build step or dependencies — it's plain HTML/CSS/JS.

## Deploying the backend (`Code.gs`)

This connects the **Save Daily Data** and **Quick Reminder** buttons to a Google Sheet and Google Calendar.

1. **Create a Google Sheet.** Go to [sheets.google.com](https://sheets.google.com) and create a new blank spreadsheet — this is where daily student data will be logged. Name it something like "Teacher Dashboard Data".
2. **Open the Apps Script editor.** In the Sheet, go to **Extensions → Apps Script**.
3. **Paste the code.** Delete the placeholder `myFunction() {}` code in `Code.gs`, and paste in the full contents of this repo's `Code.gs`.
4. **Set the project time zone.** In the Apps Script editor, click **Project Settings** (the gear icon), and set **Time zone** to `(GMT+03:00) Arabian Standard Time - Asia/Qatar`. This makes sure reminders land on your calendar at the correct local time.
5. **Save** the project (`Ctrl/Cmd+S`).
6. **Deploy as a Web App.**
   - Click **Deploy → New deployment**.
   - Click the gear icon next to "Select type" and choose **Web app**.
   - Set **Execute as**: `Me`.
   - Set **Who has access**: `Anyone`.
   - Click **Deploy**, then **Authorize access** and approve the permissions (this script needs access to your Sheet and Calendar).
   - Copy the **Web app URL** — it looks like `https://script.google.com/macros/s/AKfycb.../exec`.
7. **Paste the URL into the dashboard.** In the app, open the **Settings** tab, paste the URL into **Google Web App URL**, and click **Save**.
8. **Test it:**
   - Tap **Save Daily Data** — a `DailyData` sheet should appear in your spreadsheet with a row per student (it's created automatically the first time).
   - Add a **Quick Reminder** — it should appear on the default Google Calendar of the account you deployed as.

### Re-deploying after editing `Code.gs`

If you change `Code.gs` later, edits alone don't update the live URL. Go to **Deploy → Manage deployments**, click the pencil (edit) icon on your deployment, and under **Version** choose **New version**, then **Deploy**. This keeps the same Web App URL, so you won't need to update Settings again.

### Keep your Web App URL private

Anyone who has this URL can submit data to your Sheet and Calendar — there's no login on the endpoint. Don't commit it to a public repository or share it publicly; just paste it into the app's **Settings** tab, where it's stored only in your browser's local storage.

## How the WhatsApp report logic works

Tapping **WhatsApp Report** on a student card looks at their current Behavior / Marks / Activity and picks an encouraging, Arabic message template, for example:

- **Mastered marks + High activity** → praises excellence and leadership.
- **Needs Support marks + Excellent behavior** → praises manners, affirms the student is smart, and asks for light practice at home.
- **Needs Focus behavior** → frames it positively as energy that's being channeled into focus.
- Other combinations fall back to general, encouraging progress messages.

The message always generates in Arabic, regardless of which UI language is currently selected, then opens `https://wa.me/?text=<encoded message>` in a new tab so you can pick a contact and send.

## Notes

- Student list, points, daily taps, and your backend URL persist in the browser via `localStorage` — clearing site data/browser storage will reset them.
- A handful of sample student names are pre-loaded on first run; use **Add Student** / the **×** on a card to customize the roster.
