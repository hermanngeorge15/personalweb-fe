# SEO Fixes for Google Search Console Issues

## 📊 Current Status

Based on Google Search Console analysis on October 27, 2025:
- **10 pages not indexed**
- **1 page indexed**
- **4 different reasons for indexing failures**

## 🔍 Issues Identified

### 1. ❌ Duplicate without user-selected canonical
**Severity:** Critical  
**Status:** ✅ FIXED

**Problem:**
The `index.html` file had a hardcoded canonical tag:
```html
<link rel="canonical" href="https://jirihermann.com/" />
```

This caused Google to see duplicate canonical tags because:
1. Initial page load: hardcoded canonical from `index.html` → `https://jirihermann.com/`
2. After JavaScript execution: dynamic canonical from `setHead()` → correct URL for each route
3. Google crawls both states and sees conflicting canonical URLs

**Solution Applied:**
- Removed hardcoded canonical tag from `index.html`
- All routes now dynamically set canonical tags via `setHead()` function in `lib/seo.ts`
- Added comment explaining the change

**Files Modified:**
- `/index.html` - Removed hardcoded canonical tag

---

### 2. ❌ Page with redirect
**Severity:** Medium  
**Status:** ⚠️ NEEDS VERIFICATION

**Problem:**
Some URLs may be causing redirects. Common causes in SPAs:
- Trailing slash inconsistencies (`/blog` vs `/blog/`)
- HTTP → HTTPS redirects
- www → non-www redirects

**Actions Required:**
1. Check your DNS and server configuration for redirect rules
2. Ensure consistent URL structure in sitemap (either all with trailing slashes or none)
3. Verify nginx configuration doesn't have conflicting redirect rules

**Current nginx config status:** ✅ Properly configured for SPA routing
- `location / { try_files $uri $uri/ /index.html =404; }`

---

### 3. ❌ Crawled - currently not indexed
**Severity:** Medium  
**Status:** ⏳ PENDING GOOGLE RE-CRAWL

**Problem:**
Google crawled these pages but decided not to index them. Common reasons:
- Low-quality content (perceived by Google)
- Duplicate content
- Thin content
- JavaScript rendering issues (SPA-specific)

**Solutions:**
1. ✅ Fixed canonical tag issue (see #1)
2. ✅ All routes have proper SEO meta tags via `setHead()`
3. ⚠️ **Recommended:** Add structured data (JSON-LD) to all pages - partially implemented
4. ⚠️ **Recommended:** Ensure content is meaningful and unique on each page

**Current Status:**
- ✅ Home page: Has JSON-LD (Person schema)
- ✅ About page: Has JSON-LD (AboutPage schema)
- ✅ Blog posts: Has JSON-LD (BlogPosting schema)
- ✅ Services page: Has JSON-LD (Service schema)
- ❌ Resume, Testimonials, Contact: Need JSON-LD schemas

---

### 4. ❌ Alternate page with proper canonical tag
**Severity:** Low  
**Status:** ⚠️ INVESTIGATION NEEDED

**Problem:**
7 pages showing this status. This typically means:
- Pages are variations of other pages (mobile, AMP, print versions)
- Canonical tags point to other pages as the "main" version
- Google is respecting the canonical and indexing the target page instead

**Investigation Required:**
1. Check which 7 pages have this issue in Google Search Console
2. Verify the canonical tags on those pages are correct
3. Ensure you don't have unintentional alternate versions

**Potential Culprit:**
- `/resume.print` route exists - is it being crawled as alternate?
- Check if there are URL parameters being crawled as separate pages

---

## ✅ Fixes Already Applied

### Code Changes

1. **Removed hardcoded canonical from index.html**
   ```html
   <!-- Before -->
   <link rel="canonical" href="https://jirihermann.com/" />
   
   <!-- After -->
   <!-- Canonical tag is dynamically set by setHead() in each route component -->
   ```

2. **Added missing imports to route files**
   - `about.tsx`
   - `services.tsx`
   - `contact.tsx`
   - `testimonials.tsx`
   - `blog/index.tsx`

3. **Verified SEO implementation**
   - ✅ All public routes call `setHead()` with proper meta tags
   - ✅ Canonical URLs are dynamically generated for each route
   - ✅ Open Graph tags configured
   - ✅ Twitter Card meta tags configured
   - ✅ Structured data (JSON-LD) on key pages

---

## 🚀 Next Steps & Recommendations

### Immediate Actions (Do Now)

1. **Deploy the changes**
   ```bash
   pnpm build
   # Deploy to production
   ```

2. **Request re-indexing in Google Search Console**
   - Go to URL Inspection tool
   - Inspect each problematic URL
   - Click "Request Indexing" for each URL

3. **Verify in Google Search Console**
   - Check which 7 pages have "Alternate page with proper canonical tag" status
   - Verify canonical tags are pointing to correct URLs

### Short-term Improvements (Next Week)

4. **Add structured data to all pages**
   
   Add JSON-LD schemas to remaining pages:
   
   **Resume page (`resume.tsx`):**
   ```typescript
   setJsonLd({
     '@context': 'https://schema.org',
     '@type': 'ProfilePage',
     mainEntity: {
       '@type': 'Person',
       name: 'Jiří Hermann',
       jobTitle: 'Backend Software Engineer',
       // ... more fields
     }
   })
   ```
   
   **Testimonials page (`testimonials.tsx`):**
   ```typescript
   setJsonLd({
     '@context': 'https://schema.org',
     '@type': 'CollectionPage',
     about: {
       '@type': 'Person',
       name: 'Jiří Hermann'
     }
   })
   ```
   
   **Contact page (`contact.tsx`):**
   ```typescript
   setJsonLd({
     '@context': 'https://schema.org',
     '@type': 'ContactPage',
     url: location.href
   })
   ```

5. **Check and fix trailing slash consistency**
   
   Review your sitemap.xml and ensure consistency:
   ```bash
   # Check current sitemap
   curl https://jirihermann.com/sitemap.xml
   ```
   
   Ensure all URLs either:
   - Have trailing slashes: `/blog/`, `/about/`
   - OR have no trailing slashes: `/blog`, `/about`
   
   **Don't mix both!**

6. **Verify robots.txt**
   ```bash
   curl https://jirihermann.com/robots.txt
   ```
   
   Current robots.txt looks good:
   ```
   User-agent: *
   Allow: /
   Disallow: /admin/
   Sitemap: https://jirihermann.com/sitemap.xml
   ```

### Long-term Improvements (Within 2-4 Weeks)

7. **Consider Server-Side Rendering (SSR) or Static Generation**
   
   SPAs can have SEO challenges because:
   - Content loads after JavaScript executes
   - Google may not always execute JavaScript fully
   - Initial HTML is empty
   
   **Options:**
   - Use Vite's SSG plugin for static pages
   - Consider Next.js or Remix for full SSR
   - Use prerendering service like Prerender.io or Netlify's Prerendering
   
   **Current Setup:** ✅ You have nginx properly configured for SPA routing

8. **Monitor Core Web Vitals**
   - Check Lighthouse scores
   - Optimize images (use WebP, lazy loading)
   - Minimize JavaScript bundle size

9. **Add more internal linking**
   - Link blog posts to each other
   - Add "Related Posts" section
   - Link from homepage to important pages

10. **Create an XML sitemap that updates dynamically**
    - Regenerate sitemap when new blog posts are published
    - Include lastmod dates
    - Submit sitemap to Google Search Console

---

## 📝 Configuration Files Status

### ✅ nginx.conf
- Properly configured for SPA routing
- Gzip compression enabled
- Proper caching headers for static assets
- No caching for HTML files (good for SEO)
- Special handling for `robots.txt` and `sitemap.xml`

### ✅ robots.txt
- Allows all crawlers
- Disallows `/admin/` (correct)
- References sitemap

### ⚠️ sitemap.xml
- Currently static
- Should be regenerated when blog posts change
- Check trailing slash consistency

---

## 🔧 Technical SEO Checklist

### ✅ Implemented
- [x] Dynamic canonical tags
- [x] Meta descriptions on all pages
- [x] Open Graph tags
- [x] Twitter Card meta tags
- [x] Structured data (JSON-LD) on key pages
- [x] robots.txt
- [x] sitemap.xml
- [x] Proper HTTP headers (via nginx)
- [x] Responsive meta viewport tag

### ⏳ Partially Implemented
- [~] Structured data on ALL pages (only on some)
- [~] URL consistency (need to verify trailing slashes)

### ❌ Not Implemented
- [ ] Prerendering or SSR
- [ ] Dynamic sitemap generation
- [ ] Image optimization (WebP, lazy loading)
- [ ] RSS feed (mentioned in index.html but may not exist)
- [ ] Breadcrumb structured data
- [ ] FAQ schema (if applicable)
- [ ] Video schema (if applicable)

---

## 🐛 Debugging Tips

### Check if JavaScript is executing for crawlers
```bash
# Test how Google sees your page
# Use Google's Mobile-Friendly Test or Rich Results Test
# URL: https://search.google.com/test/rich-results
```

### Verify canonical tags are working
```bash
# After deploying, check each page
curl -s https://jirihermann.com/about | grep canonical
curl -s https://jirihermann.com/blog | grep canonical
curl -s https://jirihermann.com/contact | grep canonical
```

**Note:** Since this is an SPA, the canonical tag is added by JavaScript after page load. Google can see it when executing JS, but curl won't show it.

### Test structured data
- Use Google's Rich Results Test: https://search.google.com/test/rich-results
- Paste each page URL to verify JSON-LD is correctly implemented

### Monitor indexing progress
- Google Search Console → Coverage report
- Check every few days after requesting re-indexing
- Full re-indexing can take 1-4 weeks

---

## 📚 Resources

- [Google Search Central](https://developers.google.com/search)
- [Schema.org Documentation](https://schema.org/)
- [TanStack Router SEO Guide](https://tanstack.com/router/latest/docs/framework/react/guide/seo)
- [Vite SSG Plugin](https://github.com/antfu/vite-ssg)

---

## 🎯 Expected Timeline

| Action | Timeline | Expected Result |
|--------|----------|-----------------|
| Deploy canonical fix | Immediate | Fixes "Duplicate canonical" errors |
| Request re-indexing | Immediate | Google re-crawls within 1-7 days |
| Add structured data | 1 week | Better rich snippets in search results |
| Fix URL consistency | 1 week | Reduces redirect issues |
| Monitor improvements | 2-4 weeks | More pages indexed |
| Consider SSR/prerendering | 1-3 months | Improved crawlability |

---

## ✅ Summary

**What was fixed today:**
1. ✅ Removed hardcoded canonical tag from `index.html`
2. ✅ Added missing imports to route files
3. ✅ Verified all routes have proper `setHead()` calls
4. ✅ Confirmed nginx configuration is correct for SPA routing

**What you need to do next:**
1. **Deploy these changes** to production
2. **Request re-indexing** in Google Search Console for all affected URLs
3. **Check which pages** have "Alternate page with proper canonical tag" status
4. **Add JSON-LD structured data** to remaining pages (resume, testimonials, contact)
5. **Verify trailing slash consistency** in your sitemap and URLs

**Expected outcome:**
After deploying and requesting re-indexing, you should see improvement within 1-4 weeks. The "Duplicate canonical" issues should disappear, and Google should start indexing more pages.

---

*Generated on: October 27, 2025*
*Last updated: After applying canonical tag fix*
