from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from .. import db
from ..models import Email
from ..services.ml_model import get_model_status, retrain_model
from ..services.gemini_service import analyze_with_gemini

api_bp = Blueprint('api', __name__, url_prefix='/api')

@api_bp.route('/model/status')
@login_required
def model_status():
    """Get the status of the ML model"""
    status = get_model_status()
    return jsonify(status)

@api_bp.route('/model/retrain', methods=['POST'])
@login_required
def retrain():
    """Retrain the ML model"""
    try:
        result = retrain_model()
        return jsonify({
            'message': 'Model retrained successfully',
            'accuracy': result.get('accuracy'),
            'f1_score': result.get('f1_score')
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/analyze/gemini', methods=['POST'])
@login_required
def analyze_with_gemini_api():
    """Analyze text with Gemini AI"""
    data = request.get_json()
    
    if not data or 'text' not in data:
        return jsonify({'error': 'No text provided'}), 400
    
    try:
        result = analyze_with_gemini(data['text'], data.get('metadata', {}))
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/stats')
@login_required
def get_stats():
    """Get statistics about the user's emails"""
    # Total emails
    total_emails = Email.query.filter_by(user_id=current_user.id).count()
    
    # Phishing emails
    phishing_emails = Email.query.filter_by(
        user_id=current_user.id, 
        is_phishing=True
    ).count()
    
    # Detection methods breakdown
    ml_detections = Email.query.filter_by(
        user_id=current_user.id,
        is_phishing=True,
        detection_method='ml'
    ).count()
    
    ai_detections = Email.query.filter_by(
        user_id=current_user.id,
        is_phishing=True,
        detection_method='ai'
    ).count()
    
    rules_detections = Email.query.filter_by(
        user_id=current_user.id,
        is_phishing=True,
        detection_method='rules'
    ).count()
    
    return jsonify({
        'total_emails': total_emails,
        'phishing_emails': phishing_emails,
        'phishing_percentage': (phishing_emails / total_emails * 100) if total_emails > 0 else 0,
        'detection_methods': {
            'ml': ml_detections,
            'ai': ai_detections,
            'rules': rules_detections
        }
    }) 