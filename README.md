# KOS Café - Premium SPA

This is a Scandi-Luxury Single Page Application for KOS Café, built with React, Tailwind CSS, and Framer Motion.

## 🚀 Quick Start

1.  **Install Dependencies:**
    ```bash
    npm install
    npm install papaparse framer-motion lucide-react
    ```

2.  **Run Development Server:**
    ```bash
    npm start
    ```

## 📊 Connecting Data

### 1. Google Sheets (Menu Data)
The app currently uses fallback data extracted from your PDF. To use a live Google Sheet:
1.  Create a Google Sheet with these columns (case-sensitive):
    *   `Category` (e.g., "Pizzas", "Sandwiches")
    *   `Name`
    *   `Description`
    *   `PriceReg`
    *   `PriceMed` (Optional)
    *   `ImageURL` (Google Drive share link)
2.  Go to **File > Share > Publish to Web**.
3.  Select "Entire Document" and "Comma-separated values (.csv)".
4.  Copy the link and paste it into `src/constants.ts` in the `GOOGLE_SHEET_CSV_URL` variable.

### 2. Google Drive Images
*   Set the sharing permissions of your image on Drive to "Anyone with the link".
*   Paste that link into the `ImageURL` column of your spreadsheet.
*   The app will automatically convert it to a viewable format.

### 3. Order Webhook
To receive orders (e.g., via email, WhatsApp, or Slack):
1.  Create a scenario in **Make.com** (or Zapier) with a "Webhooks - Custom Webhook" trigger.
2.  Copy the Webhook URL.
3.  Paste it into `src/constants.ts` in the `WEBHOOK_URL` variable.
4.  The payload sent will be JSON containing customer details and the cart items.

## 🎨 Customization
*   **Colors/Fonts:** Modified in `index.html` (Tailwind config).
*   **Static Data:** If you don't want to use Google Sheets, simply edit the `FALLBACK_MENU` array in `src/constants.ts`.
