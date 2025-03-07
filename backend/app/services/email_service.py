import imaplib
import email
from email.header import decode_header
import re
import json
from datetime import datetime
from bs4 import BeautifulSoup
import base64
import os
from urllib.parse import urlparse

from .. import db
from ..models import Email
from .phishing_detection import analyze_email

def fetch_emails(user, limit=50):
    """Fetch emails from Gmail using IMAP"""
    if not user.access_token:
        raise Exception("User does not have Gmail access token")
    
    # Connect to Gmail IMAP server with OAuth2
    imap = imaplib.IMAP4_SSL('imap.gmail.com')
    
    # Authenticate with OAuth2
    auth_string = f'user={user.email}\1auth=Bearer {user.access_token}\1\1'
    imap.authenticate('XOAUTH2', lambda x: auth_string)
    
    # Select the inbox
    imap.select('INBOX')
    
    # Search for all emails, limit to recent ones
    status, messages = imap.search(None, 'ALL')
    email_ids = messages[0].split()
    
    # Get the most recent emails (up to the limit)
    email_ids = email_ids[-limit:] if len(email_ids) > limit else email_ids
    
    new_emails = []
    
    for e_id in email_ids:
        # Fetch the email
        status, msg_data = imap.fetch(e_id, '(RFC822)')
        
        for response in msg_data:
            if isinstance(response, tuple):
                msg = email.message_from_bytes(response[1])
                
                # Get email ID
                message_id = msg.get('Message-ID', '')
                
                # Check if email already exists in database
                existing_email = Email.query.filter_by(
                    user_id=user.id,
                    message_id=message_id
                ).first()
                
                if existing_email:
                    continue  # Skip if already in database
                
                # Extract email data
                subject = decode_email_header(msg.get('Subject', ''))
                sender = decode_email_header(msg.get('From', ''))
                recipient = decode_email_header(msg.get('To', ''))
                date_str = msg.get('Date', '')
                
                # Parse date
                received_date = None
                if date_str:
                    try:
                        # Try to parse the date in various formats
                        for fmt in [
                            '%a, %d %b %Y %H:%M:%S %z',
                            '%a, %d %b %Y %H:%M:%S %Z',
                            '%d %b %Y %H:%M:%S %z',
                            '%a, %d %b %Y %H:%M:%S'
                        ]:
                            try:
                                received_date = datetime.strptime(date_str, fmt)
                                break
                            except ValueError:
                                continue
                    except Exception:
                        pass
                
                # Extract body content
                body_text = ""
                body_html = ""
                has_attachment = False
                attachment_info = []
                
                # Process email parts
                if msg.is_multipart():
                    for part in msg.walk():
                        content_type = part.get_content_type()
                        content_disposition = str(part.get("Content-Disposition"))
                        
                        # Check for attachments
                        if "attachment" in content_disposition:
                            has_attachment = True
                            filename = part.get_filename()
                            if filename:
                                # Get attachment size
                                size = len(part.get_payload(decode=True))
                                attachment_info.append({
                                    'filename': filename,
                                    'content_type': content_type,
                                    'size': size
                                })
                        
                        # Get email body
                        if content_type == "text/plain" and "attachment" not in content_disposition:
                            body_text = get_email_body(part)
                        elif content_type == "text/html" and "attachment" not in content_disposition:
                            body_html = get_email_body(part)
                else:
                    # If not multipart, just get the payload
                    content_type = msg.get_content_type()
                    if content_type == "text/plain":
                        body_text = get_email_body(msg)
                    elif content_type == "text/html":
                        body_html = get_email_body(msg)
                
                # Extract links from HTML
                links = []
                if body_html:
                    soup = BeautifulSoup(body_html, 'html.parser')
                    for link in soup.find_all('a'):
                        href = link.get('href')
                        if href and href.startswith(('http://', 'https://')):
                            links.append({
                                'url': href,
                                'text': link.text.strip(),
                                'domain': urlparse(href).netloc
                            })
                
                # Check email authentication
                spf_pass = 'pass' in msg.get('Authentication-Results', '').lower() if msg.get('Authentication-Results') else None
                dkim_pass = 'dkim=pass' in msg.get('Authentication-Results', '').lower() if msg.get('Authentication-Results') else None
                dmarc_pass = 'dmarc=pass' in msg.get('Authentication-Results', '').lower() if msg.get('Authentication-Results') else None
                
                # Create new email record
                new_email = Email(
                    user_id=user.id,
                    message_id=message_id,
                    sender=sender,
                    recipient=recipient,
                    subject=subject,
                    body_text=body_text,
                    body_html=body_html,
                    received_date=received_date,
                    has_attachment=has_attachment,
                    attachment_info=json.dumps(attachment_info) if attachment_info else None,
                    links=json.dumps(links) if links else None,
                    spf_pass=spf_pass,
                    dkim_pass=dkim_pass,
                    dmarc_pass=dmarc_pass
                )
                
                db.session.add(new_email)
                new_emails.append(new_email)
    
    # Commit all new emails to database
    if new_emails:
        db.session.commit()
        
        # Analyze new emails for phishing
        for email_obj in new_emails:
            try:
                analyze_email(email_obj)
            except Exception as e:
                print(f"Error analyzing email {email_obj.id}: {str(e)}")
    
    # Close the connection
    imap.close()
    imap.logout()
    
    return new_emails

def get_email_details(email_id, user_id):
    """Get detailed information about an email"""
    email_obj = Email.query.filter_by(id=email_id, user_id=user_id).first()
    if not email_obj:
        return None
    
    return {
        'id': email_obj.id,
        'message_id': email_obj.message_id,
        'sender': email_obj.sender,
        'recipient': email_obj.recipient,
        'subject': email_obj.subject,
        'body_text': email_obj.body_text,
        'body_html': email_obj.body_html,
        'received_date': email_obj.received_date.isoformat() if email_obj.received_date else None,
        'is_phishing': email_obj.is_phishing,
        'phishing_score': email_obj.phishing_score,
        'detection_method': email_obj.detection_method,
        'analysis_result': email_obj.get_analysis_result(),
        'has_attachment': email_obj.has_attachment,
        'attachment_info': email_obj.get_attachment_info(),
        'links': email_obj.get_links(),
        'spf_pass': email_obj.spf_pass,
        'dkim_pass': email_obj.dkim_pass,
        'dmarc_pass': email_obj.dmarc_pass
    }

def decode_email_header(header):
    """Decode email header"""
    if not header:
        return ""
    
    decoded_parts = []
    for part, encoding in decode_header(header):
        if isinstance(part, bytes):
            if encoding:
                try:
                    decoded_parts.append(part.decode(encoding))
                except:
                    decoded_parts.append(part.decode('utf-8', errors='replace'))
            else:
                decoded_parts.append(part.decode('utf-8', errors='replace'))
        else:
            decoded_parts.append(part)
    
    return " ".join(decoded_parts)

def get_email_body(part):
    """Extract and decode email body"""
    try:
        body = part.get_payload(decode=True)
        charset = part.get_content_charset()
        
        if charset:
            try:
                return body.decode(charset)
            except:
                return body.decode('utf-8', errors='replace')
        else:
            return body.decode('utf-8', errors='replace')
    except:
        return "" 