# Supabase Setup Guide

This guide will help you migrate from SQLite to Supabase for your Graduate Student Database application.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Node.js and npm installed

## Step 1: Create a Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Fill in your project details:
   - **Name**: Graduate Student Database (or your preferred name)
   - **Database Password**: Choose a strong password and save it
   - **Region**: Choose the region closest to your users
   - **Pricing Plan**: Free tier is fine for development
4. Click "Create new project" and wait for setup to complete (~2 minutes)

## Step 2: Set Up Database Schema

1. In your Supabase project, go to the **SQL Editor** (left sidebar)
2. Click "New Query"
3. Copy the entire contents of `supabase-schema.sql` file
4. Paste it into the SQL editor
5. Click "Run" to execute the script

This will create:
- `students` table
- `thesis_progress` table
- `course_enrollments` table
- Sample data
- Indexes for better performance
- Triggers for automatic timestamp updates

## Step 3: Get Your Supabase Credentials

1. Go to **Project Settings** (gear icon in left sidebar)
2. Click on **API** in the settings menu
3. You'll need two values:
   - **Project URL** (e.g., `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public key** (under "Project API keys")

## Step 4: Configure Environment Variables

1. Create a `.env` file in the project root:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

   > **Important**: Never commit `.env` to version control. It's already in `.gitignore`.

## Step 5: Install Dependencies

Install the Supabase client library:

```bash
npm install @supabase/supabase-js
```

## Step 6: Update Your Code to Use Supabase

You have two options:

### Option A: Direct Supabase Integration (Recommended)

Replace your API calls to use Supabase directly. Update your components:

**Before:**
```javascript
import * as api from '../api/api';

// In your component
const fetchStudents = async () => {
  const response = await api.getStudents();
  setStudents(response.data);
};
```

**After:**
```javascript
import * as api from '../api/supabaseApi';

// In your component
const fetchStudents = async () => {
  const response = await api.getStudents();
  setStudents(response.data);
};
```

Simply change the import from `'../api/api'` to `'../api/supabaseApi'` in these files:
- `src/components/StudentList.jsx`
- `src/components/StudentDetail.jsx`
- `src/components/AddStudent.jsx`
- `src/components/CourseEnrollment.jsx`
- `src/components/ThesisProgress.jsx`
- `src/components/Dashboard.jsx`

### Option B: Keep Backend Server (Optional)

If you want to keep using the Express backend, you can modify `server/index.js` to use Supabase instead of SQLite. However, this adds unnecessary complexity since Supabase can be accessed directly from the frontend.

## Step 7: Test Your Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and test:
   - View students list
   - Add a new student
   - Edit student information
   - Add course enrollments
   - Update thesis progress
   - View dashboard statistics

## Step 8: Configure Row Level Security (Optional but Recommended)

For production, you should enable Row Level Security (RLS) to protect your data:

1. Go to **Authentication** > **Policies** in Supabase Dashboard
2. Enable RLS for each table
3. Create policies based on your security requirements

Example policy (allow all operations for now):
```sql
-- For students table
CREATE POLICY "Enable all access for now" ON students
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

For production, you'll want to add authentication and more restrictive policies.

## Step 9: Deploy Your Application

### Frontend Deployment (Vercel/Netlify)

1. Push your code to GitHub
2. Connect your repository to Vercel or Netlify
3. Add environment variables in the deployment platform:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

### No Backend Deployment Needed!

Since you're using Supabase directly from the frontend, you don't need to deploy the Express server anymore. This simplifies your deployment significantly.

## Comparison: SQLite vs Supabase

| Feature | SQLite (Old) | Supabase (New) |
|---------|-------------|----------------|
| Database Type | Local file | PostgreSQL (cloud) |
| Scalability | Limited | High |
| Real-time updates | No | Yes |
| Authentication | Manual | Built-in |
| Storage | Local | Cloud |
| Backup | Manual | Automatic |
| Deployment | Need backend server | Direct frontend access |
| Cost | Free | Free tier + pay as you grow |

## Benefits of Supabase

1. **No Backend Needed**: Access database directly from frontend
2. **Real-time**: Built-in real-time subscriptions (if you want live updates)
3. **Scalable**: PostgreSQL can handle millions of rows
4. **Secure**: Row Level Security, automatic backups
5. **Additional Features**: 
   - Built-in authentication
   - File storage
   - Edge functions
   - Automatic API generation

## Troubleshooting

### Error: "Missing Supabase environment variables"

- Make sure `.env` file exists in project root
- Check that variable names start with `VITE_`
- Restart the dev server after creating `.env`

### Error: "fetch failed" or connection errors

- Verify your Supabase URL and anon key are correct
- Check if your Supabase project is active
- Ensure you have internet connection

### Database errors

- Make sure you ran the `supabase-schema.sql` script
- Check Supabase logs in the Dashboard under "Logs"

### CORS errors

- Supabase handles CORS automatically for the anon key
- Make sure you're using the correct anon key (not service role key)

## Migration from SQLite

If you have existing data in SQLite that you want to migrate:

1. Export data from SQLite:
   ```bash
   cd server
   node -e "
   const db = require('better-sqlite3')('graduate_students.db');
   const students = db.prepare('SELECT * FROM students').all();
   console.log(JSON.stringify(students, null, 2));
   " > students.json
   ```

2. Use Supabase Dashboard to import the JSON data or write a migration script

## Next Steps

1. ✅ Set up Supabase project
2. ✅ Run database schema
3. ✅ Configure environment variables
4. ✅ Install dependencies
5. ✅ Update API imports
6. ✅ Test application
7. 🔲 Enable RLS (for production)
8. 🔲 Add authentication (optional)
9. 🔲 Deploy to production

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase React Guide](https://supabase.com/docs/guides/with-react)

## Support

If you encounter any issues:
1. Check Supabase Dashboard logs
2. Review browser console for errors
3. Verify environment variables
4. Check Supabase status page: https://status.supabase.com

