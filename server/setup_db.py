import sqlite3

# Connect to SQLite database (creates the file if it doesn't exist)
conn = sqlite3.connect('users.db')

# Create a cursor object to execute SQL commands
cursor = conn.cursor()

# Create the users table
cursor.execute('''
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
)
''')

# Create the recommendations table
cursor.execute('''
CREATE TABLE IF NOT EXISTS recommendations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    raw_results TEXT NOT NULL,
    FOREIGN KEY (username) REFERENCES users (username)
)
''')

# Create the itineraries table
cursor.execute('''
CREATE TABLE IF NOT EXISTS itineraries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    title TEXT NOT NULL,
    locations TEXT NOT NULL, -- Store selected locations as JSON
    FOREIGN KEY (username) REFERENCES users (username)
)
''')

# Commit changes and close the connection
conn.commit()
conn.close()

print("Database and users table created successfully.")
print("Recommendations table created successfully.")
print("Itineraries table created successfully.")