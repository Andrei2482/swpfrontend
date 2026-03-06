# SwordigoPlus Frontend — Setup Guide
*No CLI required. GitHub uploads + Cloudflare Pages web dashboard only.*

---

## Step 1 — Create the GitHub repository

1. Go to [github.com/new](https://github.com/new) and log in.
2. Name it `swordigoplus-frontend` (or any name you prefer).
3. Set visibility to **Private** (recommended).
4. Click **Create repository**.
5. On the next screen click **uploading an existing file**.
6. Drag-and-drop the **entire contents** of the `frontend/` folder (all files and subfolders).
7. Commit message: `chore: initial frontend scaffold` → click **Commit changes**.

> **Tip:** You must upload *contents* of `frontend/`, not the folder itself. Open the folder, select everything inside, and drag it all into GitHub's uploader.

---

## Step 2 — Connect to Cloudflare Pages

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com).
2. In the left sidebar click **Workers & Pages**.
3. Click **Create** → **Pages** → **Connect to Git**.
4. Authorize GitHub access and select your `swordigoplus-frontend` repository.
5. Choose **Branch**: `main`.

---

## Step 3 — Configure the build

In the **Build settings** form:

| Setting | Value |
|---|---|
| Framework preset | **Vite** |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | *(leave blank)* |
| Node.js version | `20` (set via Environment Variables: key `NODE_VERSION`, value `20`) |

Click **Save and Deploy**. Cloudflare Pages will run `npm install` then `npm run build` automatically.

---

## Step 4 — Set environment variables

In your Pages project → **Settings** → **Environment Variables**:

| Variable | Value |
|---|---|
| `VITE_API_URL` | `https://swordigoplus-backend.<your-subdomain>.workers.dev` |
| `NODE_VERSION` | `20` |

After adding variables, go to **Deployments** → click **Retry deployment** (or push a new commit).

---

## Step 5 — Verify the deployment

Your site will be live at:
`https://<your-project>.pages.dev`

Checklist after deploy:
- [ ] `https://<your-project>.pages.dev` → redirects to `/login`
- [ ] Login page loads with animated background
- [ ] Register page accessible via the "Create one" link
- [ ] Password strength meter updates as you type
- [ ] DevTools → **Network** headers show `X-Frame-Options: DENY`, `Content-Security-Policy`, etc.
- [ ] DevTools → **Accessibility** tree shows no critical errors
- [ ] Resize window from 320 px → 2560 px — layout stays clean

---

## Step 6 — Custom domain (optional)

1. Pages project → **Custom domains** → **Set up a custom domain**.
2. Enter your domain e.g. `app.swordigoplus.com`.
3. Follow the DNS instructions (add a CNAME record).

---

## Updating the site

Every time you push/upload new files to the `main` branch on GitHub, Cloudflare Pages **automatically re-builds and re-deploys**. There is no manual step required.

---

## Wiring up the backend (when ready)

In `src/pages/Login.tsx` and `src/pages/Register.tsx`, look for the `// TODO: replace with real API call` comment.  
Uncomment the `fetch()` block and remove the placeholder `await new Promise(...)` line.  
The API URL is automatically read from `import.meta.env.VITE_API_URL` which you set in Step 4.
