from sqlmodel import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://neondb_owner:npg_KjN5CRXP0ZAl@ep-polished-bonus-aho16gac-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require")

engine = create_engine(DATABASE_URL)

def fix_user_table_schema():
    """
    Fix the user table schema to ensure the id column is properly set up with auto-increment
    """
    with engine.connect() as conn:
        # Check if the id column is already set up as SERIAL
        result = conn.execute(text("""
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns
            WHERE table_name = 'user' AND column_name = 'id'
        """))

        for row in result:
            print(f"Current schema for id column: {row}")

        try:
            # The id column is currently character varying, we need to change it to integer
            # Since there's a foreign key constraint with the task table, we need to handle both
            # First, let's see if there are any values in the user table
            user_count_result = conn.execute(text("SELECT COUNT(*) FROM \"user\" WHERE id IS NOT NULL;"))
            user_count = user_count_result.fetchone()[0]

            # Check if there are any values in the task table that reference user.id
            task_count_result = conn.execute(text("SELECT COUNT(*) FROM \"task\" WHERE user_id IS NOT NULL;"))
            task_count = task_count_result.fetchone()[0]

            print(f"Found {user_count} records in user table and {task_count} records in task table")

            # Temporarily drop the foreign key constraint
            try:
                conn.execute(text("ALTER TABLE \"task\" DROP CONSTRAINT IF EXISTS task_user_id_fkey;"))
                conn.commit()
                print("Dropped foreign key constraint")
            except Exception as e:
                print(f"Could not drop foreign key constraint: {e}")
                conn.rollback()

            # Change the user.id column type
            if user_count > 0:
                # For integer columns, we don't need to handle non-numeric values
                # Change the column type to integer
                conn.execute(text("ALTER TABLE \"user\" ALTER COLUMN id TYPE INTEGER;"))
                conn.commit()
            else:
                # If no records exist, just change the column type
                conn.execute(text("ALTER TABLE \"user\" ALTER COLUMN id TYPE INTEGER;"))
                conn.commit()

            # Change the task.user_id column type to match
            if task_count > 0:
                # For integer columns, we don't need to handle non-numeric values
                # Change the column type to integer
                conn.execute(text("ALTER TABLE \"task\" ALTER COLUMN user_id TYPE INTEGER;"))
                conn.commit()
            else:
                # If no records exist, just change the column type
                conn.execute(text("ALTER TABLE \"task\" ALTER COLUMN user_id TYPE INTEGER;"))
                conn.commit()

            # Recreate the foreign key constraint
            try:
                conn.execute(text("""
                    ALTER TABLE \"task\"
                    ADD CONSTRAINT task_user_id_fkey
                    FOREIGN KEY (user_id) REFERENCES \"user\"(id)
                    ON DELETE CASCADE;
                """))
                conn.commit()
                print("Recreated foreign key constraint")
            except Exception as e:
                print(f"Could not recreate foreign key constraint: {e}")
                conn.rollback()

            # Verify the changes
            user_result = conn.execute(text("""
                SELECT column_name, data_type, is_nullable, column_default
                FROM information_schema.columns
                WHERE table_name = 'user' AND column_name = 'id'
            """))

            for row in user_result:
                print(f"Updated schema for user.id column: {row}")

            task_result = conn.execute(text("""
                SELECT column_name, data_type, is_nullable
                FROM information_schema.columns
                WHERE table_name = 'task' AND column_name = 'user_id'
            """))

            for row in task_result:
                print(f"Updated schema for task.user_id column: {row}")

            print("Database schema fixed successfully!")

        except Exception as e:
            print(f"Error fixing schema: {e}")
            conn.rollback()

if __name__ == "__main__":
    fix_user_table_schema()