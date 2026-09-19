import os
import django
from django.db import connection

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

with connection.cursor() as cursor:
    cursor.execute("SELECT column_name FROM information_schema.columns WHERE table_name='User';")
    columns = [row[0] for row in cursor.fetchall()]
    
    if 'is_staff' not in columns:
        print("Adding is_staff column to User table...")
        cursor.execute('ALTER TABLE "User" ADD COLUMN is_staff BOOLEAN DEFAULT false;')
    if 'is_active' not in columns:
        print("Adding is_active column to User table...")
        cursor.execute('ALTER TABLE "User" ADD COLUMN is_active BOOLEAN DEFAULT true;')
    if 'is_superuser' not in columns:
        print("Adding is_superuser column to User table...")
        cursor.execute('ALTER TABLE "User" ADD COLUMN is_superuser BOOLEAN DEFAULT false;')
    if 'last_login' not in columns:
        print("Adding last_login column to User table...")
        cursor.execute('ALTER TABLE "User" ADD COLUMN last_login TIMESTAMP WITH TIME ZONE NULL;')
print("Database schema adjusted.")
