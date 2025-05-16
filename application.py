from flask import Flask, request, jsonify, send_from_directory
import sqlite3
import bcrypt
import os

app = Flask(__name__, static_folder='.', static_url_path='')

DATABASE = 'data.db'

# Connect to database
def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

# Initialize all required database tables and defaults
def init_db():
    with app.app_context():
        db = get_db()
        cursor = db.cursor()

        # Applications table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS applications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                contact TEXT NOT NULL,
                email TEXT NOT NULL,
                plan TEXT NOT NULL
            )
        ''')

        # FAQ questions table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS faq_questions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL,
                question TEXT NOT NULL
            )
        ''')

        # Exchange rates table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS exchange_rates (
                currency TEXT PRIMARY KEY,
                rate REAL NOT NULL
            )
        ''')

        # Users table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            )
        ''')

        # Default exchange rates (only inserted if not present)
        default_rates = {
            "GBP": 1.0,
            "USD": 1.25,
            "EUR": 1.15,
            "BRL": 6.5,
            "JPY": 150.0,
            "TRY": 35.0
        }
        for currency, rate in default_rates.items():
            cursor.execute('''
                INSERT OR IGNORE INTO exchange_rates (currency, rate)
                VALUES (?, ?)
            ''', (currency, rate))

        db.commit()

# Endpoint: Submit investment application
@app.route('/submit_application', methods=['POST'])
def submit_application():
    data = request.get_json()
    name = data.get('name')
    contact = data.get('contact')
    email = data.get('email')
    plan = data.get('plan')

    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute('''
            INSERT INTO applications (name, contact, email, plan)
            VALUES (?, ?, ?, ?)
        ''', (name, contact, email, plan))
        db.commit()
        return jsonify({'message': 'Application submitted successfully!'}), 201
    except sqlite3.Error:
        db.rollback()
        return jsonify({'message': 'Database Error'}), 500
    finally:
        db.close()

# Endpoint: Delete a user by ID
@app.route('/delete_user/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("DELETE FROM users WHERE id = ?", (user_id,))
        db.commit()
        return jsonify({'message': 'User deleted successfully'}), 200
    except sqlite3.Error as e:
        db.rollback()
        print("Error deleting user:", e)
        return jsonify({'message': 'Failed to delete user'}), 500
    finally:
        db.close()


# Endpoint: Register new user
@app.route('/register_user', methods=['POST'])
def register_user():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'message': 'Missing fields'}), 400

    # Hash the password
    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute('''
            INSERT INTO users (username, email, password)
            VALUES (?, ?, ?)
        ''', (username, email, hashed_pw))
        db.commit()
        return jsonify({'message': 'User registered successfully!'}), 201
    except sqlite3.IntegrityError:
        return jsonify({'message': 'Username or email already exists.'}), 409
    except sqlite3.Error:
        db.rollback()
        return jsonify({'message': 'Database error occurred'}), 500
    finally:
        db.close()

# Endpoint: Authenticate user login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Hardcoded admin account
    if username == "admin" and password == "admin":
        return jsonify({'message': 'Admin login successful'}), 200

    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
        user = cursor.fetchone()

        if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            return jsonify({'message': 'Login successful'}), 200
        else:
            return jsonify({'message': 'Invalid username or password'}), 401
    except sqlite3.Error:
        return jsonify({'message': 'Database error occurred'}), 500
    finally:
        db.close()

# Endpoint: Submit FAQ question
@app.route('/submit_faq', methods=['POST'])
def submit_faq():
    data = request.get_json()
    email = data.get('email')
    question = data.get('question')

    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute('''
            INSERT INTO faq_questions (email, question)
            VALUES (?, ?)
        ''', (email, question))
        db.commit()
        return jsonify({'message': 'Question submitted successfully!'}), 201
    except sqlite3.Error:
        db.rollback()
        return jsonify({'message': 'Database Error'}), 500
    finally:
        db.close()

# Endpoint: Admin view of all applications
@app.route('/admin_data')
def admin_data():
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM applications")
        rows = cursor.fetchall()
        applications = [{
            "id": row["id"],
            "name": row["name"],
            "contact": row["contact"],
            "email": row["email"],
            "plan": row["plan"]
        } for row in rows]
        return jsonify(applications)
    except sqlite3.Error:
        return jsonify({"error": "Database error occurred"}), 500
    finally:
        db.close()

# Endpoint: Admin view of submitted FAQ questions
@app.route('/faq_data')
def faq_data():
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM faq_questions")
        rows = cursor.fetchall()
        faqs = [{
            "id": row["id"],
            "email": row["email"],
            "question": row["question"]
        } for row in rows]
        return jsonify(faqs)
    except sqlite3.Error:
        return jsonify({"error": "Database error occurred"}), 500
    finally:
        db.close()

# Endpoint: Admin view of all registered users
@app.route('/user_data')
def user_data():
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT id, username, email FROM users")
        rows = cursor.fetchall()
        users = [{
            "id": row["id"],
            "username": row["username"],
            "email": row["email"]
        } for row in rows]
        return jsonify(users)
    except sqlite3.Error:
        return jsonify({"error": "Database error occurred"}), 500
    finally:
        db.close()

# Endpoint: Get current exchange rates
@app.route('/get_rates')
def get_rates():
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM exchange_rates")
        rows = cursor.fetchall()
        return jsonify([{ "currency": row["currency"], "rate": row["rate"] } for row in rows])
    except sqlite3.Error:
        return jsonify({"error": "Failed to retrieve exchange rates"}), 500
    finally:
        db.close()

# Endpoint: Update exchange rates
@app.route('/update_rates', methods=['POST'])
def update_rates():
    data = request.get_json()
    try:
        db = get_db()
        cursor = db.cursor()
        for currency, rate in data.items():
            cursor.execute('''
                UPDATE exchange_rates
                SET rate = ?
                WHERE currency = ?
            ''', (rate, currency))
        db.commit()
        return jsonify({"message": "Rates updated successfully!"}), 200
    except sqlite3.Error:
        db.rollback()
        return jsonify({"error": "Failed to update exchange rates"}), 500
    finally:
        db.close()

# Default route
@app.route('/')
def index():
    return app.send_static_file('index.html')

# Run the Flask app
if __name__ == '__main__':
    init_db()
    app.run(debug=True)
