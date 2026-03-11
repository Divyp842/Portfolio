# 📧 Deployment Email Configuration Checklist

This guide ensures emails are sent correctly in production. **This is the most common reason emails fail after deployment.**

---

## ⚠️ Critical: Missing Environment Variables

Emails ONLY work if you set the correct environment variables in your production deployment.

### What You Need:

1. **RESEND_API_KEY** (SECRET - Never share or commit)
   - Get from: https://resend.com/api-keys
   - Format: `re_xxxxxxxxxxxxxx`

2. **NEXT_PUBLIC_PORTFOLIO_EMAIL** (Your Gmail)
   - Your email where notifications arrive
   - Format: `youremail@gmail.com`

3. **RESEND_FROM_EMAIL** (Your domain sender)
   - Send from your custom domain (recommended)
   - Falls back to: `noreply@resend.dev` (may go to spam)
   - Format: `noreply@yourdomain.com`

4. **NEXT_PUBLIC_APP_URL** (Your deployed site URL)
   - Used in admin panel links in emails
   - Format: `https://yourportfolio.com`

---

## 🚀 Deployment Platforms Setup

### **Vercel** (Recommended for Next.js)

1. Go to your project: https://vercel.com/dashboard
2. Click **Settings** → **Environment Variables**
3. Add each variable:
   ```
   RESEND_API_KEY = re_xxxxxxxxxxxxxx
   NEXT_PUBLIC_PORTFOLIO_EMAIL = youremail@gmail.com
   RESEND_FROM_EMAIL = noreply@yourdomain.com
   NEXT_PUBLIC_APP_URL = https://yourportfolio.com
   SUPABASE_SERVICE_ROLE_KEY = your_key
   ```
4. Select **Production** environment
5. Click **Save**
6. Redeploy your site (or wait for automatic redeploy)

### **Netlify**

1. Go to your project: https://app.netlify.com
2. Click **Site settings** → **Build & deploy** → **Environment**
3. Click **Edit variables**
4. Add all 4 variables
5. Fill in values, click **Save**
6. Trigger a new deploy

### **Other Platforms (Firebase, AWS, etc.)**

- Look for "Environment Variables" or "Secrets" section
- Add all 4 variables
- Redeploy your application

---

## 🔍 Debugging: How to Check if Emails Work

### 1. **Check Server Logs**

- Vercel: Deployment → Logs → Function logs
- Look for: `✅ Email sent successfully` or error messages
- **If you see this**, email was sent:
  ```
  ✅ Email sent successfully: [message-id]
  ```

### 2. **Check Admin Messages Page**

- Go to `/admin/messages`
- Messages appear here **immediately** (even if email fails)
- **If messages appear here**, database is working ✅

### 3. **Check Gmail**

- Look for emails from `onboarding@resend.dev` or `noreply@yourdomain.com`
- **Check Spam/Promotions folder** - Resend emails often go there
- **Mark as not spam** to improve delivery

### 4. **Test Curl Request** (Advanced)

```bash
curl -X POST https://yoursite.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@gmail.com",
    "message": "Test message"
  }'
```

---

## 🔒 Security: RESEND_API_KEY Must Be Secret

**DO NOT:**

- ❌ Commit `.env.local` to Git
- ❌ Share your API key in messages
- ❌ Expose it in client-side code
- ❌ Put it in `NEXT_PUBLIC_*` variables

**DO:**

- ✅ Keep it in `.env.local` locally
- ✅ Use platform secrets/environment vars for production
- ✅ Rotate key if accidentally exposed
- ✅ Use `RESEND_API_KEY` (not NEXT_PUBLIC prefix)

---

## 📧 Email Domain Setup (Optional but Recommended)

**Current Setup:** Uses `onboarding@resend.dev`

- ✅ Works immediately
- ❌ Often marked as spam

**Better Setup:** Use your custom domain

1. Go to https://resend.com/domains
2. Add your domain: `yourdomain.com`
3. Add DNS records (Resend shows the exact records)
4. Wait for verification (usually 5-10 mins)
5. Update `RESEND_FROM_EMAIL = noreply@yourdomain.com`
6. Redeploy

---

## ✅ Complete Checklist

- [ ] Created Resend account at https://resend.com
- [ ] Generated API key from https://resend.com/api-keys
- [ ] Set `RESEND_API_KEY` in production environment variables
- [ ] Set `NEXT_PUBLIC_PORTFOLIO_EMAIL` to your Gmail
- [ ] Set `RESEND_FROM_EMAIL` (or using default `noreply@resend.dev`)
- [ ] Set `NEXT_PUBLIC_APP_URL` to your deployed site URL
- [ ] Redeployed application after setting variables
- [ ] Tested contact form on live site
- [ ] Check `/admin/messages` to see if message was saved
- [ ] Check Gmail (including Spam folder) for notification email
- [ ] Updated email settings on your hosting platform

---

## 🆘 Troubleshooting

### Emails saved but not sent?

1. Check if `RESEND_API_KEY` is set in production
2. Check if `NEXT_PUBLIC_PORTFOLIO_EMAIL` is set
3. Check server logs for error messages
4. Go to https://resend.com/inbox to see email logs

### Messages don't appear in Admin?

1. Check if Supabase is connected: `/api/profile` works?
2. Check if `SUPABASE_SERVICE_ROLE_KEY` is set
3. Check browser DevTools → Network tab → Contact form request response

### Emails going to Spam?

1. Using default `onboarding@resend.dev`? Verify custom domain
2. Mark emails as "Not Spam" in Gmail to improve delivery
3. Create Gmail filter to prevent spam marking

### Can't find API Key?

1. Go to https://resend.com/api-keys
2. If no key exists, click "Create API Key"
3. Copy the key (starts with `re_`)

---

## 📞 Need Help?

- Resend Docs: https://resend.com/docs
- Resend Support: support@resend.com
- Check server logs for detailed error messages
