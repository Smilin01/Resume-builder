# Deploying Resume Builder to Netlify

This guide will help you deploy your Resume Builder application to Netlify with proper environment variable configuration.

## Prerequisites

- GitHub account with your code pushed
- Netlify account (free tier works fine)
- OpenRouter API key

## Step-by-Step Deployment Guide

### 1. Connect Your Repository to Netlify

1. Go to [Netlify](https://www.netlify.com/) and sign in
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **"Deploy with GitHub"**
4. Authorize Netlify to access your GitHub repositories
5. Select your repository: `Smilin01/Resume-builder`

### 2. Configure Build Settings

Netlify should auto-detect your build settings, but verify these:

- **Base directory**: (leave empty)
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 18 or higher (Netlify usually auto-detects)

### 3. Add Environment Variables (CRITICAL!)

Before deploying, you MUST add your API key as an environment variable:

1. In the Netlify deployment setup, scroll down to **"Advanced build settings"**
2. Click **"Add environment variables"** or **"New variable"**
3. Add the following:
   - **Key**: `VITE_OPENROUTER_API_KEY`
   - **Value**: ``
   
   ⚠️ **Important**: The variable name MUST start with `VITE_` for Vite to expose it to the browser.

4. Click **"Add"** to save the variable

### 4. Deploy!

1. Click **"Deploy site"** or **"Deploy [your-site-name]"**
2. Wait for the build to complete (usually 2-5 minutes)
3. Netlify will provide you with a URL like: `https://your-site-name.netlify.app`

### 5. Verify Deployment

1. Open your deployed site URL
2. Open browser console (F12 → Console)
3. Look for: `✅ API Key loaded successfully (length: 84)`
4. Test the AI Assistant to ensure it works

## Managing Environment Variables After Deployment

If you need to update your API key or add more variables later:

1. Go to your Netlify dashboard
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Click **"Add a variable"** or edit existing ones
5. After changing variables, you need to **trigger a new deploy**:
   - Go to **Deploys** tab
   - Click **"Trigger deploy"** → **"Clear cache and deploy site"**

## Troubleshooting

### Issue: AI features not working after deployment

**Solution**: Check if the environment variable is set correctly:
1. Go to Site settings → Environment variables
2. Verify `VITE_OPENROUTER_API_KEY` exists and has the correct value
3. Redeploy the site

### Issue: Build fails

**Possible causes**:
- Node version mismatch
- Missing dependencies

**Solution**:
1. Check the build logs in Netlify
2. If needed, specify Node version by adding a `.nvmrc` file to your repo:
   ```
   18
   ```

### Issue: "API Key not loaded" in console

**Solution**: 
- Make sure the variable name is exactly `VITE_OPENROUTER_API_KEY` (case-sensitive)
- Must start with `VITE_` prefix
- Redeploy after adding the variable

## Custom Domain (Optional)

To use a custom domain:

1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Follow Netlify's instructions to configure DNS

## Continuous Deployment

Once set up, Netlify will automatically:
- Deploy when you push to the `main` branch
- Run builds and tests
- Update your live site

Just push your code to GitHub, and Netlify handles the rest! 🚀

## Security Notes

✅ Environment variables in Netlify are secure and not exposed in your code
✅ The `.env` file is never uploaded (protected by `.gitignore`)
✅ Each deployment uses the environment variables from Netlify's settings

## Need Help?

- [Netlify Documentation](https://docs.netlify.com/)
- [Netlify Environment Variables Guide](https://docs.netlify.com/environment-variables/overview/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
