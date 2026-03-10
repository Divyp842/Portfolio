# Gmail Integration Setup Guide

## Overview

Your portfolio now sends contact form messages directly to your Gmail inbox via the Resend email service.

## How It Works

### 1. **Message Flow**

```
User fills contact form → Message saved in database → Email sent to your Gmail → Browser notification (optional)
```

### 2. **Admin Messages Page**

- New messages appear in the admin messages page
- Browser notifications alert you when new messages arrive
- Email also comes to your Gmail inbox
- Click "Notifs On/Off" button to enable/disable browser notifications

## Required Environment Variables

Add these to your `.env.local` file:

```env
# Resend API Key (for sending emails)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx

# Your Gmail address (where contact form emails will be sent)
NEXT_PUBLIC_PORTFOLIO_EMAIL=youremail@gmail.com

# Portfolio name (optional - appears in admin panel)
NEXT_PUBLIC_PORTFOLIO_NAME=Your Name

# Your app URL (optional - for the "View in Admin Panel" link)
NEXT_PUBLIC_APP_URL=https://yourportfolio.com
```

## Setting Up Resend

### Step 1: Create Resend Account

1. Go to [https://resend.com](https://resend.com)
2. Sign up with your email
3. Verify your email address

### Step 2: Get API Key

1. Go to [https://resend.com/api-keys](https://resend.com/api-keys)
2. Click "Create API Key"
3. Copy the API key to `RESEND_API_KEY` in `.env.local`

### Step 3: Configure Sender Email

**Option A: Quick Setup (Using Resend Subdomain)**

- Currently configured to use `onboarding@resend.dev`
- Works immediately, but emails may go to Spam folder
- Update `FROM_EMAIL` in `/src/app/api/contact/route.ts` to your domain

**Option B: Production Setup (Verify Your Domain)**

1. In Resend dashboard, go to "Domains"
2. Add your domain (e.g., `yourdomain.com`)
3. Follow DNS verification steps
4. Update `FROM_EMAIL` in `/src/app/api/contact/route.ts` to verified domain
5. Example: `noreply@yourdomain.com`

## Gmail Configuration

### Auto-Label Messages (Optional)

Gmail automatically categorizes emails. To ensure contact form emails don't go to Spam:

1. When you receive an email from Resend
2. Click the three dots menu
3. Select "Mark as not spam"
4. Check "Never send to spam"

### Create Gmail Filter (Optional)

1. Go to Gmail → Settings → Filters and Blocked Addresses
2. Click "Create a new filter"
3. Search for: `from:onboarding@resend.dev` (or your domain)
4. Click "Create filter"
5. Check "Never send to Spam"
6. Click "Create filter"

## Browser Notifications

### Enabling Notifications

1. Go to Admin → Messages
2. Click the "Notifs Off" button
3. Allow notifications in your browser
4. Button will change to "Notifs On"

### How Notifications Work

- Polls for new messages every 30 seconds
- Shows desktop notification when new unread message arrives
- Notification includes sender name and message preview
- Click notification to open admin panel

### Browser Support

- ✅ Chrome/Edge
- ✅ Firefox
- ✅ Safari (12+)
- ❌ Not available in Safari on iOS

## Troubleshooting

### Emails not arriving in Gmail

1. **Check environment variables**
   - Make sure `RESEND_API_KEY` is set correctly
   - Make sure `NEXT_PUBLIC_PORTFOLIO_EMAIL` is your Gmail address
   - Restart your development server

2. **Check Spam folder**
   - Look in Gmail spam/promotions tabs
   - Mark as "Not spam"
   - Add filter to prevent future issues

3. **Check Resend logs**
   - Go to [https://resend.com/logs](https://resend.com/logs)
   - Look for failed delivery attempts
   - Check error messages

### Notifications not showing

1. **Check browser permissions**
   - Go to browser settings
   - Find notification permissions for your site
   - Make sure it's set to "Allow"

2. **Verify notifications enabled**
   - Click "Notifs On" button on Messages page
   - Should show success notification
   - Check browser console for errors

## Testing

### Send Test Message

1. Go to your portfolio contact page
2. Fill out and submit contact form
3. Check your Gmail inbox
4. Should arrive within 30 seconds
5. Check admin messages page

### Test Notifications (Development)

```javascript
// Open browser console on messages page and run:
const notification = new Notification("Test Message", {
  body: "If you see this, notifications are working!",
});
```

## Email Template Customization

The email template is in `/src/app/api/contact/route.ts`. To customize:

1. Edit the `html` section of the email
2. Change colors, layout, text, etc.
3. Restart development server
4. Test with another contact form submission

## Rate Limiting

- No built-in rate limiting (add if needed)
- Resend has default limits on free tier
- Consider adding validation limit after production

## Security Notes

- ✅ Email validation built-in
- ✅ Messages stored securely in database
- ✅ CORS protected API
- ✅ No sensitive data in URLs

## Next Steps

1. [ ] Set up Resend account and API key
2. [ ] Update `.env.local` with your Gmail address
3. [ ] Test sending a contact form message
4. [ ] Verify email arrives in Gmail
5. [ ] Enable browser notifications
6. [ ] (Optional) Set up custom domain for emails
7. [ ] (Optional) Create Gmail filter to organize emails
