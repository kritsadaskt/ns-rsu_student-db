# Component Migration Guide

This guide shows the exact changes needed to migrate your components from the Express API to Supabase.

## Quick Migration: One-Line Change

For each component, you only need to change one line - the import statement!

### Files to Update

You need to update the import in these 6 files:

1. `src/components/StudentList.jsx`
2. `src/components/StudentDetail.jsx`
3. `src/components/AddStudent.jsx`
4. `src/components/CourseEnrollment.jsx`
5. `src/components/ThesisProgress.jsx`
6. `src/components/Dashboard.jsx`

---

## Change Required

### Before (Old - using Express backend):
```javascript
import * as api from '../api/api';
```

### After (New - using Supabase):
```javascript
import * as api from '../api/supabaseApi';
```

That's it! The rest of your component code stays exactly the same because the API interface is identical.

---

## Detailed Example

### src/components/StudentList.jsx

**Change this line:**
```javascript
import * as api from '../api/api';  // ❌ Old
```

**To this:**
```javascript
import * as api from '../api/supabaseApi';  // ✅ New
```

**Everything else stays the same:**
```javascript
// Your existing code works as-is
const fetchStudents = async () => {
  try {
    const response = await api.getStudents();
    setStudents(response.data);
  } catch (error) {
    console.error('Error fetching students:', error);
  }
};
```

---

## Why This Works

The new `supabaseApi.js` has been designed to match the exact same interface as your old `api.js`. All functions return the same data structure:

```javascript
{
  data: { /* your data here */ }
}
```

So your components don't need any other changes!

---

## API Function Mapping

All these functions work exactly the same way:

| Function | Usage | Returns |
|----------|-------|---------|
| `getStudents()` | Get all students | `{ data: Student[] }` |
| `getStudent(id)` | Get single student | `{ data: Student }` |
| `createStudent(data)` | Create student | `{ data: { message, id } }` |
| `updateStudent(id, data)` | Update student | `{ data: { message } }` |
| `deleteStudent(id)` | Delete student | `{ data: { message } }` |
| `getStudentCourses(studentId)` | Get courses | `{ data: Course[] }` |
| `createCourse(data)` | Create course | `{ data: { message, id } }` |
| `updateCourse(id, data)` | Update course | `{ data: { message } }` |
| `deleteCourse(id)` | Delete course | `{ data: { message } }` |
| `updateThesisProgress(studentId, data)` | Update thesis | `{ data: { message } }` |
| `getStatistics()` | Get statistics | `{ data: { stats } }` |

---

## Benefits of This Approach

1. ✅ **Minimal code changes** - Just change the import
2. ✅ **No component logic changes** - Everything else stays the same
3. ✅ **Type safety maintained** - Same function signatures
4. ✅ **Error handling works** - Same error structure
5. ✅ **No backend needed** - Direct Supabase connection
6. ✅ **Faster** - No middle server, direct database access
7. ✅ **Better scaling** - Supabase handles all the infrastructure

---

## Automated Migration Script (Optional)

If you want to automate the import changes, you can use this command:

```bash
# macOS/Linux
find src/components -name "*.jsx" -type f -exec sed -i '' 's|from '\''../api/api'\''|from '\''../api/supabaseApi'\''|g' {} +

# Or manually replace in each file
```

---

## Testing After Migration

1. ✅ Test viewing student list
2. ✅ Test viewing single student detail
3. ✅ Test adding a new student
4. ✅ Test editing student information
5. ✅ Test deleting a student
6. ✅ Test adding course enrollments
7. ✅ Test editing course enrollments
8. ✅ Test deleting course enrollments
9. ✅ Test updating thesis progress
10. ✅ Test dashboard statistics

---

## Rollback Plan

If you need to rollback to the Express backend:

```javascript
// Just change back to:
import * as api from '../api/api';

// And make sure your Express server is running:
npm run dev  // (in the server directory)
```

---

## Next Steps After Migration

1. You can remove the Express backend dependencies if you want:
   - `server/index.js` (keep for reference or delete)
   - `server/package.json`
   - `server/node_modules`

2. Update your deployment (no backend needed!)

3. Consider adding authentication with Supabase Auth

4. Explore real-time features (live updates when data changes)

---

## Questions?

- Check `SUPABASE_SETUP.md` for detailed setup instructions
- Review `src/api/supabaseApi.js` to see how it works
- Look at `supabase-schema.sql` for database structure

