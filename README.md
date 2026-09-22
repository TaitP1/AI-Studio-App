# Apex Scientific Training & Biomechanics Tracker

Evidence-based 4-day progressive overload program engineered with stretch-mediated hypertrophy research, stimulus-to-fatigue ratio (SFR) optimization, interactive SVG muscle anatomy graphics, and an AI biomechanics coach.

---

## 🚀 2-Minute Deployment Guide for GitHub

Because browsers cannot run raw TypeScript (`.tsx`) files directly, GitHub Pages uses the included **GitHub Action** to automatically compile and publish your site.

### Step 1: Upload the Files to GitHub
1. Create a new repository on GitHub (e.g. `apex-tracker`).
2. Click **"uploading an existing file"** (or **Add file** -> **Upload files**).
3. Drag and drop **all files and folders** into GitHub:
   - `components/`
   - `constants/`
   - `services/`
   - `App.tsx`
   - `index.tsx`
   - `index.html`
   - `types.ts`
   - `package.json`
   - `tsconfig.json`
   - `vite.config.ts`
   - `.gitignore`
   - `metadata.json`
4. Commit the changes by clicking **Commit changes**.

---

### Step 2: Make Sure the Workflow File Is Present
Operating systems often hide folders starting with a dot (`.github`). Check your repository file list on GitHub:

- **If you see `.github/workflows/deploy.yml`**: You are all set!
- **If you DO NOT see `.github` on GitHub**:
  1. Click **Add file** -> **Create new file**.
  2. In the filename box, type: `.github/workflows/deploy.yml` *(typing the slash creates the folder automatically)*.
  3. Paste the contents of `.github/workflows/deploy.yml`.
  4. Click **Commit changes**.

---

### Step 3: Enable GitHub Pages
1. On your repository page, click **Settings** (top tab).
2. Click **Pages** in the left sidebar.
3. Under **Build and deployment** -> **Source**, select:
   👉 **GitHub Actions**
4. Click the **Actions** tab at the top of your repository to watch the deployment run (takes ~45 seconds).
5. Once completed, your live site URL will be displayed at the top of the **Settings -> Pages** screen!
