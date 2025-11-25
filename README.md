# AD7STORE — Vercel Deployable Project

This project is a static storefront with serverless Vercel functions that persist data into a GitHub repository.

## Files
- index.html — Storefront
- dashboard.html — Orders dashboard (fetches from GitHub via serverless)
- admin.html — Product management (CRUD) UI
- style.css, script.js, admin.js — static assets
- api/save-order.js — save orders to `orders.json` in GitHub
- api/get-orders.js — read orders from GitHub
- api/products.js — products CRUD to `products.json` in GitHub
- vercel.json — Vercel functions configuration

## Deployment steps
1. Create a GitHub repo (empty or with an initial README).
2. In the repo root, add this project (or upload the ZIP contents).
3. Deploy the repo to Vercel (Import Project).
4. In Vercel project settings → Environment Variables, add:
   - GITHUB_USER = your_github_username
   - GITHUB_REPO = your_repo_name
   - GITHUB_TOKEN = a GitHub Personal Access Token with `repo` scope
5. Deploy. Visit `/index.html` for the shop, `/admin.html` for product management, and `/dashboard.html` for orders.

## Notes
- Vercel serverless functions use the GitHub API to read/write `orders.json` and `products.json`. If the files don't exist, the APIs create them during first write.
- Keep your `GITHUB_TOKEN` secret. Rotate if leaked.

