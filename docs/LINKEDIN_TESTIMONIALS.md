# Adding LinkedIn Testimonials

This guide shows you how to add testimonials from LinkedIn to your personal site.

## Overview

While LinkedIn's API doesn't allow automatic fetching of recommendations, you can easily add them manually through the admin interface. The testimonial system now supports:

- **Author name** and **role/title**
- **Profile pictures** (avatar URLs)
- **LinkedIn icon** indicator
- **Professional formatting**

## Step-by-Step Guide

### 1. Go to Your LinkedIn Profile

Navigate to your LinkedIn profile and scroll to the "Recommendations" section.

### 2. Copy the Recommendation Details

For each recommendation you want to add, copy:
- **Author's name**
- **Author's title/role** (e.g., "Senior Developer at Google")
- **The recommendation text**

### 3. Get the Profile Picture (Optional)

To include the profile picture:

1. Right-click on the person's profile picture in their recommendation
2. Select "Copy image address" or "Copy image URL"
3. Paste this URL into the Avatar URL field

> **Note**: LinkedIn profile pictures may be protected or require authentication. If the image doesn't load, you can skip this field and a beautiful gradient fallback will be used with the person's initial.

### 4. Add to Your Site

1. Go to `/admin/testimonials` on your site
2. Fill in the form:
   - **ID**: A unique identifier (e.g., `john-doe-linkedin`)
   - **Author Name**: The person's full name
   - **Role / Title**: Their professional title and company
   - **Avatar URL**: The profile picture URL (optional)
   - **Quote**: The recommendation text
3. Click "Add Testimonial"

## Example

Here's an example of how a LinkedIn recommendation might look:

```
ID: jane-smith-linkedin
Author Name: Jane Smith
Role: Senior Product Manager at Meta
Avatar URL: https://media.licdn.com/dms/image/v2/C4D03AQF... (optional)
Quote: Jiri is an exceptional engineer with a keen eye for detail and user experience. His ability to translate complex requirements into elegant solutions is unmatched. I highly recommend him for any frontend or full-stack engineering role.
```

## Display Features

Your testimonials will be displayed with:

✅ **Professional layout** with avatar or initial badge
✅ **LinkedIn icon** to indicate source
✅ **Role and company information**
✅ **Beautiful hover animations**
✅ **Responsive design** for all screen sizes

## Alternative: Screenshot Method

If you prefer, you can also:

1. Take screenshots of LinkedIn recommendations
2. Use an image hosting service (Imgur, Cloudinary, etc.)
3. Reference those images instead of copying text

However, text-based testimonials are better for:
- SEO (search engines can read the text)
- Accessibility (screen readers can read the content)
- Performance (less data to load)
- Responsiveness (text adapts to screen size)

## Privacy Considerations

- Only add recommendations from people who have made them public
- If someone requests removal, delete it from the admin panel immediately
- Consider asking permission before displaying recommendations outside of LinkedIn

## Tips

1. **Start with your best recommendations** - Add 4-6 strong testimonials first
2. **Diversity matters** - Include testimonials from different roles (managers, peers, clients)
3. **Keep them current** - Update testimonials periodically as you get new ones
4. **Be selective** - Quality over quantity - choose recommendations that highlight different skills

## Technical Details

The testimonial system supports these fields:

- `id` (required): Unique identifier
- `author` (required): Person's name
- `quote` (required): The recommendation text
- `role` (optional): Professional title and company
- `avatar_url` (optional): Profile picture URL
- `order` (optional): Display order (lower numbers appear first)

All testimonials are stored in your database and can be edited or removed at any time through the admin interface.

