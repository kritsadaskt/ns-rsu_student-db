# 🚀 Supabase Migration Checklist

Follow this checklist to migrate your project from SQLite to Supabase.

## Phase 1: Supabase Setup

- [ ] Create Supabase account at https://supabase.com
- [ ] Create a new Supabase project
- [ ] Wait for project setup to complete (~2 minutes)
- [ ] Navigate to SQL Editor in Supabase Dashboard
- [ ] Copy and paste contents of `supabase-schema.sql`
- [ ] Run the SQL script
- [ ] Verify tables are created (check Table Editor)

## Phase 2: Environment Configuration

- [ ] Get Supabase URL from Project Settings → API
- [ ] Get Supabase Anon Key from Project Settings → API
- [ ] Create `.env.local` file in project root
- [ ] Add `VITE_SUPABASE_URL=your-url`
- [ ] Add `VITE_SUPABASE_ANON_KEY=your-key`
- [ ] Verify `.env.local` is in `.gitignore`

## Phase 3: Install Dependencies

- [x] Install Supabase client: `npm install @supabase/supabase-js` ✅ (Already done!)

## Phase 4: Update Component Imports

Change `import * as api from '../api/api'` to `import * as api from '../api/supabaseApi'` in:

- [ ] `src/components/StudentList.jsx`
- [ ] `src/components/StudentDetail.jsx`
- [ ] `src/components/AddStudent.jsx`
- [ ] `src/components/CourseEnrollment.jsx`
- [ ] `src/components/ThesisProgress.jsx`
- [ ] `src/components/Dashboard.jsx`

## Phase 5: Testing

- [ ] Start dev server: `npm run dev`
- [ ] Test: View student list
- [ ] Test: View student details
- [ ] Test: Add new student
- [ ] Test: Edit student
- [ ] Test: Delete student
- [ ] Test: Add course enrollment
- [ ] Test: Edit course enrollment
- [ ] Test: Delete course enrollment
- [ ] Test: Update thesis progress
- [ ] Test: View dashboard statistics

## Phase 6: Cleanup (Optional)

- [ ] Remove Express server if no longer needed
- [ ] Update deployment configuration
- [ ] Remove old SQLite database files
- [ ] Update documentation

## Phase 7: Production Readiness (Optional)

- [ ] Enable Row Level Security in Supabase
- [ ] Set up authentication (if needed)
- [ ] Configure production environment variables
- [ ] Deploy frontend to Vercel/Netlify
- [ ] Test production deployment

---

## Quick Reference

### Files Created:
- ✅ `supabase-schema.sql` - Database schema for Supabase
- ✅ `src/lib/supabaseClient.js` - Supabase client configuration
- ✅ `src/api/supabaseApi.js` - API layer using Supabase
- ✅ `SUPABASE_SETUP.md` - Detailed setup guide
- ✅ `COMPONENT_MIGRATION.md` - Component update guide
- ✅ `.gitignore` - Updated to ignore environment files
- ✅ This checklist!

### Key Commands:
```bash
# Install dependencies
npm install @supabase/supabase-js

# Start development server
npm run dev

# Build for production
npm run build
```

### Need Help?
- 📖 Read `SUPABASE_SETUP.md` for detailed instructions
- 🔧 Check `COMPONENT_MIGRATION.md` for code changes
- 🌐 Visit https://supabase.com/docs for Supabase docs
- 💬 Check browser console for errors

---

## Status

**Current Phase:** Ready to start Phase 1

**Next Action:** Create Supabase account and project

**Estimated Time:** 30-45 minutes total

**Difficulty:** ⭐⭐☆☆☆ (Easy - mostly copy/paste)

---

## Notes

- ✅ All necessary files have been created
- ✅ Supabase client library is installed
- ⏳ You just need to set up Supabase and update component imports
- 💡 The migration is non-destructive - you can keep your SQLite database
- 🔄 Easy rollback - just change imports back to old API

