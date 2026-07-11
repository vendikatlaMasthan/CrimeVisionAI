# CrimeVision AI v6.0 — Zoho Catalyst Deployment Guide

This guide provides step-by-step instructions to configure, run locally, and deploy CrimeVision AI to Zoho Catalyst as a secure, production-grade intelligence platform.

---

## 1. Environment Variables Setup

To secure the AI Investigator chat and prevent exposing API keys in the browser, the Gemini API is proxied through a serverless Catalyst Advanced I/O function (`crimevision-ai`).

### Local Development (`.env.local`)
Create or update your `/Users/masthan/Desktop/CrimeVisionAI/crimevisionai/.env.local` file with the following variables:

```ini
# Google Gemini API Key (Client-side, optional settings fallback)
NEXT_PUBLIC_GEMINI_API_KEY=your_google_gemini_key
```

### Zoho Catalyst Console (Production)
You must configure the Gemini API Key in your Zoho Catalyst Project console:

1. Open the **Zoho Catalyst Console** and navigate to your Project.
2. Under **Serverless**, click **Functions**.
3. Select the `crimevision-ai` function.
4. Navigate to **Environment Variables** (or Configuration).
5. Add the following key-value pair:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: `YOUR_GEMINI_API_KEY`
6. Save and apply the changes.

---

## 2. File Directory Changes

The migration from GitHub Pages static hosting to Zoho Catalyst introduced the following structure:

```
crimevisionai/
├── catalyst.json                # Project-level Catalyst deployment configuration
├── next.config.ts               # Next.js config (basePath: "", dev rewrites to emulator)
├── functions/
│   └── crimevision-ai/          # Serverless Express proxy function
│       ├── catalyst-config.json # Function metadata (Advanced I/O, Node.js 20)
│       ├── package.json         # Node.js function dependencies
│       └── index.js             # Express routing, secure fetch to Anthropic Claude
├── components/
│   ├── AuthGuard.tsx            # Renders responsive mobile layout overlay
│   ├── Topbar.tsx               # Hamburger menu button + layout offsets
│   └── Sidebar.tsx              # Click-to-close drawer logic for mobile viewports
└── app/
    ├── globals.css              # Responsive offscreen sidebar media queries
    └── investigator/page.tsx    # Multi-turn chat logic, retry handlers, offline UI
```

---

## 3. Local Execution & Testing

To test the entire client-server system locally using the Zoho Catalyst Emulator:

### Step A: Install Function Dependencies
Navigate to the serverless function folder and install the Node.js packages:
```bash
cd functions/crimevision-ai
npm install
cd ../..
```

### Step B: Start the Catalyst Emulator
Start the local Catalyst emulator to run the serverless function locally on port `8090`:
```bash
catalyst serve
```

### Step C: Start Next.js Development Server
In a separate terminal, launch the Next.js frontend dev server (port `3000`):
```bash
npm run dev
```
*Note: Next.js dev server will automatically rewrite `/api/crimevision-ai` requests to the Catalyst emulator at `http://localhost:8090/server/crimevision-ai/api/crimevision-ai`.*

---

## 4. Zoho Catalyst Production Deployment

Once local validation is successful, deploy the web client and function to production:

### Step A: Login to Catalyst CLI
Make sure you are logged in to your Zoho account:
```bash
catalyst login
```

### Step B: Initialize Catalyst Project (If not already linked)
Link your local directory with your remote Zoho Catalyst project:
```bash
catalyst project:use
```
*(Select the active project from the list)*

### Step C: Deploy to Zoho Catalyst
Deploy both the compiled web client (statically exported via `npm run build` into `out/`) and the `crimevision-ai` serverless function in one command:
```bash
catalyst deploy
```
*Note: The CLI will execute `predeploy: npm run build` automatically to compile the Next.js static files before uploading.*

---

## 5. Verification Checklist

After deploying to Zoho Catalyst, perform the following verification:

1. **Dashboard**: Navigate to your Catalyst Web Client URL. Verify the dashboard loads, charts display, and metrics scale correctly.
2. **Global Search**: Type `/` to focus the search bar, type a keyword (e.g. `Suresh` or `Bengaluru`), and verify live results show up under categorized headers.
3. **Responsiveness**: Resize the browser to mobile width:
   - Sidebar must hide offscreen.
   - Hamburger button must appear on the left of the logo.
   - Clicking the hamburger button must slide the sidebar in.
   - Clicking outside the sidebar (overlay) or clicking any nav link must close the sidebar drawer.
4. **AI Investigator**:
   - Navigate to `/investigator/`.
   - Submit a test query (e.g., "Show cybercrime hotspots").
   - If the backend is running and `GEMINI_API_KEY` is configured, it will stream the Gemini 2.0 Flash response with a blinking block typing cursor.
   - If the backend is offline or the environment variable is missing, it will display a warning: *"⚠️ CrimeNet Intelligence Server Offline..."* and show the **Retry Query** button.
