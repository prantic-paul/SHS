# ADR-006: Use PostgreSQL as Primary Database

## Status
Accepted

## Date
2025-12-19

## Context

We need to choose a database for Smart Health Synchronizer that can:
- Store user data (doctors, patients)
- Handle health records and prescriptions
- Store blog posts and comments
- Manage appointments and schedules
- Support complex queries and relationships
- Ensure data integrity and ACID compliance
- Scale with application growth
- Meet healthcare data requirements

### Requirements
- ACID compliance (data integrity critical for healthcare)
- Support for complex relationships
- JSON field support (for flexible health data)
- Full-text search capabilities
- Transaction support
- Good performance
- Industry standard

### Options Considered

**Option 1: PostgreSQL**
- Open-source, powerful RDBMS
- ACID compliant
- JSON/JSONB support
- Full-text search
- Strong data integrity
- Mature and stable

**Option 2: MySQL**
- Popular, open-source
- Good performance
- Limited JSON support
- Less advanced features

**Option 3: MongoDB**
- NoSQL, document database
- Flexible schema
- No ACID in older versions
- Not ideal for relational data

**Option 4: SQLite**
- Lightweight, file-based
- Good for development
- Not suitable for production
- Limited concurrent access

## Decision

We will use **PostgreSQL** as the primary database.

## Rationale

### Why PostgreSQL?

1. **ACID Compliance**
   - Atomicity, Consistency, Isolation, Durability
   - Critical for healthcare data
   - Ensures data integrity
   - Reliable transactions

2. **Advanced Features**
   - JSONB for flexible data storage
   - Full-text search built-in
   - Array and hstore types
   - Window functions
   - Common Table Expressions (CTEs)
   - Partial indexes

3. **Data Integrity**
   - Strong constraint system
   - Foreign key support
   - Check constraints
   - Triggers and stored procedures
   - Data validation at DB level

4. **Scalability**
   - Handles large datasets efficiently
   - Good indexing strategies
   - Partitioning support
   - Replication capabilities
   - Used by large companies

5. **Django Integration**
   - Excellent Django ORM support
   - PostgreSQL-specific fields in Django
   - Best Django experience
   - Official Django recommendation

6. **Healthcare Industry**
   - Used in healthcare applications
   - HIPAA compliance possible
   - Audit trail support
   - Data encryption support

7. **Open Source**
   - Free and open-source
   - No licensing costs
   - Active community
   - Regular updates

## Consequences

### Positive

✅ **Data Integrity**
- ACID compliance ensures data consistency
- Strong constraints prevent invalid data
- Transaction support for complex operations
- Rollback capabilities

✅ **Advanced Features**
- JSONB for flexible health data storage
- Full-text search for blogs and prescriptions
- Array fields for multi-value data
- Advanced indexing options

✅ **Performance**
- Efficient query execution
- Good with complex queries
- Materialized views
- Query optimization tools

✅ **Django Integration**
- Django ORM works best with PostgreSQL
- PostgreSQL-specific fields (JSONField, ArrayField)
- Easy migrations
- Admin interface support

✅ **Extensibility**
- PostGIS for location data (doctor locations)
- pg_trgm for fuzzy text search
- Extensions for additional features

✅ **Reliability**
- Mature and battle-tested
- Data durability guarantees
- Backup and recovery tools
- Point-in-time recovery

✅ **Community & Support**
- Large, active community
- Excellent documentation
- Many hosting options
- Industry standard

### Negative

❌ **Setup Complexity**
- More complex than SQLite
- Requires separate server
- Mitigation: Good documentation available

❌ **Resource Usage**
- Uses more resources than SQLite
- Mitigation: Acceptable for production application

❌ **Learning Curve**
- More concepts than simple databases
- Mitigation: We have learning resources

## Implementation Details

### Database Schema Overview

**Core Tables:**
```sql
-- Users (Abstract base)
users_user (id, email, password, user_type, is_active, created_at)

-- Doctors
doctors_doctor (
    id,
    user_id (FK),
    name,
    specialization,
    qualifications,
    experience_years,
    location,
    rating,
    profile_picture
)

-- Patients
patients_patient (
    id,
    user_id (FK),
    name,
    date_of_birth,
    gender,
    blood_group,
    phone,
    address
)

-- Health Records
health_records (
    id,
    patient_id (FK),
    record_date,
    diagnosis,
    symptoms,
    test_results (JSONB),
    notes,
    created_at
)

-- Prescriptions
prescriptions (
    id,
    doctor_id (FK),
    patient_id (FK),
    appointment_id (FK),
    medications (JSONB),
    instructions,
    created_at
)

-- Appointments
appointments (
    id,
    doctor_id (FK),
    patient_id (FK),
    appointment_date,
    status,
    reason,
    notes
)

-- Blogs
blogs (
    id,
    doctor_id (FK),
    title,
    content,
    tags (Array),
    published_at,
    views_count
)

-- Comments
blog_comments (
    id,
    blog_id (FK),
    user_id (FK),
    content,
    created_at
)
```

### Django Configuration
```python
# settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME', 'smart_health_db'),
        'USER': os.getenv('DB_USER', 'postgres'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}
```

### Connection Details
```
Host: localhost
Port: 5432
Database: smart_health_db
User: postgres
```

### Installation (Ubuntu/Debian)
```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Access PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE smart_health_db;
CREATE USER smart_health_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE smart_health_db TO smart_health_user;
```

### Backup Strategy
```bash
# Backup database
pg_dump smart_health_db > backup.sql

# Restore database
psql smart_health_db < backup.sql
```

## Data Types Used

### Standard Types
- `INTEGER` - IDs, counts
- `VARCHAR` - Text fields
- `TEXT` - Long text (blog content)
- `DATE` - Dates
- `TIMESTAMP` - Date and time
- `BOOLEAN` - Flags

### Advanced Types
- `JSONB` - Health metrics, test results, medications
- `ARRAY` - Tags, symptoms list
- `UUID` - Secure IDs (optional)

### Example: Health Record with JSONB
```python
# Django Model
class HealthRecord(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    record_date = models.DateField()
    test_results = models.JSONField(default=dict)  # PostgreSQL JSONB
    
    # test_results can store:
    {
        "blood_pressure": "120/80",
        "heart_rate": 72,
        "temperature": 98.6,
        "lab_results": {
            "hemoglobin": 14.5,
            "glucose": 95
        }
    }
```

## Why Not Other Databases?

### MySQL
- Less advanced JSON support
- Weaker constraint system
- Less feature-rich
- Not as good with Django

### MongoDB
- No ACID in older versions
- Not ideal for relational data
- Doctor-patient-appointment relationships are relational
- Less data integrity guarantees

### SQLite
- File-based, not for production
- Limited concurrent writes
- No user management
- Good for development only

## Security Considerations

1. **Connection Security**
   - Use SSL/TLS for connections
   - Strong password policies
   - Limited user permissions

2. **Data Encryption**
   - Encrypt sensitive data at rest
   - Use Django's encryption for passwords
   - Consider pgcrypto extension

3. **Access Control**
   - Separate users for application and admin
   - Principle of least privilege
   - Regular security updates

## Performance Optimization

1. **Indexing**
   - Index foreign keys
   - Index commonly queried fields
   - Partial indexes for filtered queries

2. **Query Optimization**
   - Use select_related and prefetch_related
   - Avoid N+1 queries
   - Use database indexes

3. **Connection Pooling**
   - Use pgBouncer for connection pooling
   - Limit concurrent connections

## Alternatives for Specific Features

- **Full-text Search**: PostgreSQL built-in or Elasticsearch
- **Caching**: Redis for frequently accessed data
- **File Storage**: S3 or local filesystem (not database)
- **Time-series Data**: PostgreSQL with TimescaleDB extension

## Review Date

This decision will be reviewed at the end of Sprint 2 after implementing core data models.

## References

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Django PostgreSQL](https://docs.djangoproject.com/en/stable/ref/databases/#postgresql-notes)
- [PostgreSQL Best Practices](https://wiki.postgresql.org/wiki/Don't_Do_This)

## Notes

- PostgreSQL is the best choice for Django applications
- ACID compliance critical for healthcare data
- JSONB provides flexibility for health data
- Industry standard for production applications
- Well-supported by hosting providers
- Excellent for learning database concepts
- Strong data integrity and consistency guarantees
