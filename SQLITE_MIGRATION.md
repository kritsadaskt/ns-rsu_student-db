# SQLite Migration Guide

The application has been successfully migrated from MySQL to SQLite!

## What Changed

### Before (MySQL)
- Required external MySQL server
- Required phpMyAdmin for database management
- Complex setup with credentials
- Needed remote database hosting

### After (SQLite)
- ✅ **Self-contained** - Database file included in project
- ✅ **No external server needed** - SQLite is embedded
- ✅ **Easy to deploy** - Just copy the folder
- ✅ **Zero configuration** - Works out of the box
- ✅ **Fast** - Better performance for small to medium datasets

## Database File

**Location:** `student-management/server/graduate_students.db`

This is a single file that contains all your data:
- Students
- Course enrollments
- Thesis progress

## Quick Start

1. **Initialize database** (first time only):
```bash
cd student-management/server
node init-db.js
```

2. **Start server:**
```bash
npm run dev
```

That's it! No MySQL, no phpMyAdmin needed.

## Features

- ✅ Full CRUD operations for students
- ✅ Course enrollment management
- ✅ Thesis progress tracking
- ✅ All original features maintained
- ✅ Same REST API endpoints
- ✅ Frontend unchanged (no updates needed)

## Database Management

### View/Edit Database

You can use these tools to view/edit the SQLite database:

1. **DB Browser for SQLite** (Free, GUI)
   - Download: https://sqlitebrowser.org/
   - Open `graduate_students.db`

2. **Command Line**
   ```bash
   sqlite3 graduate_students.db
   .tables          # List tables
   .schema students # View table structure
   SELECT * FROM students; # Query data
   .exit
   ```

3. **VS Code Extensions**
   - SQLite Viewer
   - SQLite Explorer

### Reset Database

To start fresh with sample data:
```bash
cd student-management/server
node init-db.js
```

This will drop all tables and recreate them with sample data.

## Backup

To backup your database, simply copy the file:
```bash
cp graduate_students.db graduate_students.backup.db
```

## Advantages

1. **Portable** - Copy entire folder to another computer and it works
2. **Version Control** - Can commit database to git (small size)
3. **No Dependencies** - No MySQL installation needed
4. **Fast Development** - Instant setup for new developers
5. **Easy Deployment** - Deploy anywhere Node.js runs

## Performance

SQLite is perfect for this use case:
- ✅ Handles thousands of students easily
- ✅ Fast read/write operations
- ✅ Supports concurrent reads
- ✅ ACID compliant (safe transactions)
- ⚠️ Limited concurrent writes (not an issue for this app)

## When to Switch Back to MySQL

Consider MySQL if you need:
- 10,000+ concurrent users
- Heavy write operations from multiple users
- Remote database access from multiple servers
- Advanced replication features

For a graduate student management system, SQLite is perfect!

## Technical Details

### Package Used
- **better-sqlite3** - Fast, synchronous SQLite3 bindings for Node.js
- No callbacks, uses synchronous API
- Much faster than async wrappers

### Database Schema

Same structure as MySQL:
```sql
students (student_id, full_name, birth_date, age, ...)
thesis_progress (id, student_id, proposal_exam_date, ...)
course_enrollments (id, student_id, course_code, ...)
```

### API Compatibility

All API endpoints work exactly the same:
- `GET /api/students`
- `POST /api/students`
- `PUT /api/students/:id`
- `DELETE /api/students/:id`
- etc.

No frontend changes needed!
