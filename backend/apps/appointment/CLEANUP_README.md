# Appointment Cleanup Automation

## Overview
Missed appointments (appointments whose time has passed for today) are automatically removed from the database at the end of each day to keep the system clean.

## Manual Cleanup
You can manually run the cleanup command:

```bash
cd backend
python manage.py cleanup_missed_appointments
```

### Dry Run (Preview without deleting)
```bash
python manage.py cleanup_missed_appointments --dry-run
```

## Automatic Cleanup (Cron Job)

### Linux/Mac Setup

1. Open crontab editor:
```bash
crontab -e
```

2. Add this line to run cleanup at 11:59 PM every day:
```bash
59 23 * * * cd /home/prantic/SHS/backend && /usr/bin/python3 manage.py cleanup_missed_appointments >> /home/prantic/SHS/logs/cleanup.log 2>&1
```

3. Or run at midnight (12:00 AM):
```bash
0 0 * * * cd /home/prantic/SHS/backend && /usr/bin/python3 manage.py cleanup_missed_appointments >> /home/prantic/SHS/logs/cleanup.log 2>&1
```

### Windows Setup

1. Open Task Scheduler
2. Create a new Basic Task
3. Set trigger to "Daily" at 11:59 PM
4. Set action to "Start a program"
5. Program: `python.exe` or full path to Python
6. Arguments: `manage.py cleanup_missed_appointments`
7. Start in: `C:\path\to\SHS\backend`

## What Gets Deleted

The cleanup removes appointments that meet ALL these criteria:
- Appointment date is today
- Appointment's approximate time has passed
- Status is NOT "COMPLETED"

## Logs

Cleanup logs are written to `/home/prantic/SHS/logs/cleanup.log` if using the cron job configuration above.

## Manual API Cleanup

Alternatively, you can call the API endpoint (requires admin/staff authentication):

```bash
POST /api/v1/appointments/cleanup-missed/
```

This can be triggered from a frontend dashboard or external scheduler.
