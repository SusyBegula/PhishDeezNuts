from flask import Blueprint, jsonify, request, Response
from flask_login import login_required, current_user
from .. import db
from ..models import Email
from ..services.email_service import fetch_emails, get_email_details
from ..services.phishing_detection import analyze_email
import json
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

email_bp = Blueprint('email', __name__, url_prefix='/emails')

# Initialize Gemini API
genai.configure(api_key=os.environ.get('GEMINI_API_KEY'))

@email_bp.route('/')
@login_required
def get_emails():
    """Get all emails for the current user with pagination"""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    # Filter options
    is_phishing = request.args.get('is_phishing', None)
    if is_phishing is not None:
        is_phishing = is_phishing.lower() == 'true'
    
    # Build query
    query = Email.query.filter_by(user_id=current_user.id)
    
    # Apply filters
    if is_phishing is not None:
        query = query.filter_by(is_phishing=is_phishing)
    
    # Order by received date (newest first)
    query = query.order_by(Email.received_date.desc())
    
    # Paginate
    emails_pagination = query.paginate(page=page, per_page=per_page)
    
    # Format response
    emails = []
    for email in emails_pagination.items:
        emails.append({
            'id': email.id,
            'message_id': email.message_id,
            'sender': email.sender,
            'subject': email.subject,
            'received_date': email.received_date.isoformat() if email.received_date else None,
            'is_phishing': email.is_phishing,
            'phishing_score': email.phishing_score,
            'has_attachment': email.has_attachment
        })
    
    return jsonify({
        'emails': emails,
        'total': emails_pagination.total,
        'pages': emails_pagination.pages,
        'current_page': page
    })

@email_bp.route('/<int:email_id>')
@login_required
def get_email(email_id):
    """Get details for a specific email"""
    email = Email.query.filter_by(id=email_id, user_id=current_user.id).first_or_404()
    
    # Format response with all details
    email_data = {
        'id': email.id,
        'message_id': email.message_id,
        'sender': email.sender,
        'recipient': email.recipient,
        'subject': email.subject,
        'body_text': email.body_text,
        'body_html': email.body_html,
        'received_date': email.received_date.isoformat() if email.received_date else None,
        'is_phishing': email.is_phishing,
        'phishing_score': email.phishing_score,
        'detection_method': email.detection_method,
        'analysis_result': email.get_analysis_result(),
        'has_attachment': email.has_attachment,
        'attachment_info': email.get_attachment_info(),
        'links': email.get_links(),
        'spf_pass': email.spf_pass,
        'dkim_pass': email.dkim_pass,
        'dmarc_pass': email.dmarc_pass
    }
    
    return jsonify(email_data)

@email_bp.route('/sync')
@login_required
def sync_emails():
    """Fetch new emails from Gmail"""
    try:
        # Fetch emails from Gmail
        new_emails = fetch_emails(current_user)
        
        return jsonify({
            'message': f'Successfully synced {len(new_emails)} new emails',
            'count': len(new_emails)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@email_bp.route('/<int:email_id>/analyze')
@login_required
def analyze_single_email(email_id):
    """Analyze a specific email for phishing"""
    email = Email.query.filter_by(id=email_id, user_id=current_user.id).first_or_404()
    
    try:
        # Analyze the email
        result = analyze_email(email)
        
        return jsonify({
            'message': 'Email analyzed successfully',
            'is_phishing': email.is_phishing,
            'phishing_score': email.phishing_score,
            'detection_method': email.detection_method,
            'analysis_result': email.get_analysis_result()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@email_bp.route('/<int:email_id>/analyze_with_ai', methods=['POST'])
@login_required
def analyze_email_with_ai(email_id):
    """Stream AI analysis of an email"""
    email = Email.query.get_or_404(email_id)
    
    if email.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    def generate():
        try:
            # Get email content (prefer text, fallback to html)
            content = email.body_text if email.body_text else email.body_html
            
            # Prepare email content for analysis
            email_content = f"""
            Subject: {email.subject}
            From: {email.sender}
            To: {email.recipient}
            Date: {email.received_date}
            
            Content:
            {content}
            """
            
            # Check if GEMINI_API_KEY is set
            api_key = os.environ.get('GEMINI_API_KEY')
            if not api_key:
                yield f"data: {json.dumps({'error': 'GEMINI_API_KEY is not set in environment variables'})}\n\n"
                return
            
            # List of models to try in order of preference
            models_to_try = [
                'gemini-1.5-flash',
                'gemini-1.0-pro',
                'gemini-pro',
                'gemini-1.5-pro-latest'
            ]
            
            model = None
            model_name = None
            
            # Try each model until one works
            for model_name in models_to_try:
                try:
                    yield f"data: {json.dumps({'text': f'Trying model: {model_name}...'})}\n\n"
                    model = genai.GenerativeModel(model_name)
                    # Test the model with a simple prompt
                    test_response = model.generate_content("Hello")
                    # If we get here, the model works
                    yield f"data: {json.dumps({'text': f'Successfully connected to model: {model_name}'})}\n\n"
                    break
                except Exception as e:
                    yield f"data: {json.dumps({'text': f'Model {model_name} failed: {str(e)}'})}\n\n"
                    continue
            
            if model is None:
                yield f"data: {json.dumps({'error': 'All models failed. Please check your Gemini API key and permissions.'})}\n\n"
                return
            
            # Create a chat session
            chat = model.start_chat(history=[])
            
            # Send the email for analysis
            prompt = f"""Analyze this email for potential phishing indicators. 

            Please structure your response using the following markdown format:
            
            # Email Phishing Analysis
            
            ## Overall Risk Assessment
            [Provide a clear risk level: Low, Medium, or High, with brief explanation]
            
            ## Key Suspicious Elements
            [List all suspicious elements as bullet points with explanations]
            
            ## Safe Indicators
            [List any safe indicators as bullet points]
            
            ## Technical Analysis
            [Provide technical details about links, domains, authentication, etc.]
            
            ## Final Verdict
            [Provide a final conclusion about whether this is phishing or not]
            
            Use **bold** for important points, organize with clear headings, and use bullet points for lists.
            
            Email to analyze:
            {email_content}"""
            
            yield f"data: {json.dumps({'text': 'Starting analysis...'})}\n\n"
            
            try:
                response = chat.send_message(prompt, stream=True)
                
                # Stream the response
                for chunk in response:
                    if chunk.text:
                        yield f"data: {json.dumps({'text': chunk.text})}\n\n"
            except Exception as chat_error:
                # If streaming fails, try non-streaming
                yield f"data: {json.dumps({'text': 'Streaming failed, trying non-streaming mode...'})}\n\n"
                try:
                    response = model.generate_content(prompt)
                    yield f"data: {json.dumps({'text': response.text})}\n\n"
                except Exception as non_stream_error:
                    yield f"data: {json.dumps({'error': f'Both streaming and non-streaming attempts failed: {str(non_stream_error)}'})}\n\n"
                    
        except Exception as e:
            error_message = str(e)
            # Add helpful context to the error message
            if "not found for API version" in error_message:
                error_message += " Please check your Gemini API key and ensure it has access to the required models."
            elif "quota" in error_message.lower():
                error_message += " You may have exceeded your API quota. Please check your Google AI Studio dashboard."
            
            yield f"data: {json.dumps({'error': error_message})}\n\n"
        finally:
            yield "data: [DONE]\n\n"

    return Response(generate(), mimetype='text/event-stream') 