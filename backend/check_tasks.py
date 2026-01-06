from src.database.database import engine
from sqlalchemy import text

def check_tasks():
    with engine.connect() as conn:
        # Check if the task table exists
        result = conn.execute(text("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'task'
            );
        """))
        table_exists = result.fetchone()[0]
        print(f"Task table exists: {table_exists}")
        
        if table_exists:
            # Count the number of tasks
            result = conn.execute(text("SELECT COUNT(*) FROM task;"))
            task_count = result.fetchone()[0]
            print(f"Number of tasks: {task_count}")
            
            # Show task structure
            result = conn.execute(text("""
                SELECT column_name, data_type, is_nullable, column_default
                FROM information_schema.columns
                WHERE table_name = 'task'
                ORDER BY ordinal_position;
            """))
            print("\nTask table structure:")
            for row in result:
                print(f"  {row}")
        else:
            print("Task table does not exist in the database")

if __name__ == "__main__":
    check_tasks()