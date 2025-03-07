from flask import Blueprint, request, redirect, url_for, jsonify, session, current_app
from flask_login import login_user, logout_user, login_required, current_user
from authlib.integrations.flask_client import OAuth
from .. import db, login_manager
from ..models import User
import os
from datetime import datetime, timedelta
import json

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

# Initialize OAuth
oauth = OAuth()

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

def setup_oauth(app):
    """Configure OAuth with the Flask app"""
    oauth.init_app(app)
    
    # Register Google OAuth
    oauth.register(
        name='google',
        client_id=os.environ.get('GOOGLE_CLIENT_ID'),
        client_secret=os.environ.get('GOOGLE_CLIENT_SECRET'),
        server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
        client_kwargs={
            'scope': 'openid email profile https://mail.google.com/'
        }
    )

@auth_bp.route('/login')
def login():
    """Redirect to Google OAuth login"""
    redirect_uri = url_for('auth.authorize', _external=True)
    return oauth.google.authorize_redirect(redirect_uri)

@auth_bp.route('/authorize')
def authorize():
    """Handle the OAuth callback from Google"""
    token = oauth.google.authorize_access_token()
    
    # Get user info from Google
    resp = oauth.google.get('https://www.googleapis.com/oauth2/v3/userinfo')
    user_info = resp.json()
    
    # Check if user exists, create if not
    user = User.query.filter_by(email=user_info['email']).first()
    
    if not user:
        user = User(
            email=user_info['email'],
            name=user_info.get('name'),
            profile_pic=user_info.get('picture'),
            access_token=token['access_token'],
            refresh_token=token.get('refresh_token'),
            token_expiry=datetime.utcnow() + timedelta(seconds=token['expires_in'])
        )
        db.session.add(user)
    else:
        # Update existing user's tokens
        user.access_token = token['access_token']
        if 'refresh_token' in token:
            user.refresh_token = token['refresh_token']
        user.token_expiry = datetime.utcnow() + timedelta(seconds=token['expires_in'])
    
    db.session.commit()
    
    # Log in the user
    login_user(user)
    
    # Redirect to frontend
    frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:3000')
    return redirect(f"{frontend_url}/dashboard")

@auth_bp.route('/logout')
@login_required
def logout():
    """Log out the user"""
    logout_user()
    frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:3000')
    return redirect(frontend_url)

@auth_bp.route('/user')
@login_required
def get_user():
    """Return the current user's info"""
    return jsonify({
        'id': current_user.id,
        'email': current_user.email,
        'name': current_user.name,
        'profile_pic': current_user.profile_pic
    }) 