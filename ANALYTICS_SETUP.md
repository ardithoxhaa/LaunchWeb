# Analytics Dashboard Setup Guide

## ✅ What's Been Implemented

1. **Backend Analytics System**
   - `website_analytics` table for tracking page views
   - Analytics API endpoints (`/api/analytics/track`, `/api/analytics/website/:id`)
   - Admin dashboard with comprehensive analytics

2. **Frontend Analytics Tracking**
   - Automatic page view tracking for public websites
   - Analytics dashboard with template usage, trends, and top websites

3. **Admin Dashboard Features**
   - Template usage statistics
   - Top performing websites
   - User registration trends
   - Website creation trends
   - Page view metrics

## 🚀 Quick Setup Steps

### Step 1: Create Analytics Table
```bash
mysql -u root -p launchweb < backend/database/fix_analytics_table.sql
```

### Step 2: Add Test Data (Optional)
```bash
mysql -u root -p launchweb < backend/database/test_analytics.sql
```

### Step 3: Restart Backend Server
```bash
npm run dev
```

### Step 4: Test Analytics
1. Visit any published website: `http://localhost:5173/site/your-website-slug`
2. Check Admin Dashboard: `http://localhost:5173/admin`
3. Click on "Analytics" tab

## 📊 What You'll See

### Analytics Tab Features:
- **Template Usage**: Most popular templates with usage percentages
- **Top Websites**: Websites with most page views (30 days)
- **User Trends**: Registration patterns over last 30 days
- **Website Trends**: Daily creation vs publishing stats

### Updated Stats Cards:
- **Page Views (30d)**: Total page views across all websites
- All existing metrics plus new analytics data

## 🔧 How It Works

1. **Automatic Tracking**: When someone visits a published website, the system automatically:
   - Records the page path
   - Captures IP address (for unique visitor counting)
   - Stores user agent and referrer
   - Timestamps the visit

2. **Privacy-Friendly**: 
   - No personal data collected
   - IP addresses only used for unique visitor counting
   - Data automatically aggregates after 30 days

3. **Real-Time Insights**:
   - Admin dashboard shows live data
   - Trends update automatically
   - Template popularity tracks in real-time

## 🎯 Next Steps (Optional)

1. **Add More Metrics**:
   - Bounce rate tracking
   - Time on page
   - Geographic data

2. **Export Features**:
   - CSV export of analytics data
   - PDF reports generation

3. **Advanced Filtering**:
   - Date range selectors
   - Website-specific analytics
   - Custom dashboard widgets

## 🐛 Troubleshooting

**If Analytics shows 0 data:**
1. Run the test data SQL script
2. Visit a published website to trigger tracking
3. Check browser console for analytics errors
4. Verify the analytics table exists: `DESCRIBE website_analytics;`

**If Admin Dashboard errors:**
1. Check backend logs for SQL errors
2. Verify all database tables exist
3. Restart the backend server

Your Analytics Dashboard is now ready! 🎉
