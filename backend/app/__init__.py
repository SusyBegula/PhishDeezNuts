from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize SQLAlchemy
db = SQLAlchemy()

# Initialize LoginManager
login_manager = LoginManager()

def create_app():
    app = Flask(__name__)
    
    # Configure CORS
    CORS(app, 
         resources={r"/*": {
             "origins": [os.environ.get('FRONTEND_URL', 'http://localhost:3000')],
             "supports_credentials": True
         }},
         expose_headers=["Content-Type", "X-CSRFToken"],
         allow_headers=["Content-Type", "X-CSRFToken"],
    )
    
    # Configure the app
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-key-for-phishdeez')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URI', 'sqlite:///phishdeez.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Configure session
    app.config['SESSION_COOKIE_SECURE'] = True
    app.config['SESSION_COOKIE_HTTPONLY'] = True
    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
    app.config['PERMANENT_SESSION_LIFETIME'] = 1800  # 30 minutes
    
    # Initialize extensions with app
    db.init_app(app)
    login_manager.init_app(app)
    
    # Import and register blueprints
    from .routes.auth import auth_bp
    from .routes.email import email_bp
    from .routes.api import api_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(email_bp)
    app.register_blueprint(api_bp)
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    return app 