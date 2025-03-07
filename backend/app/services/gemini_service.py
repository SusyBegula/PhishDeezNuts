import os
import json
import re
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Gemini API
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')

def analyze_with_gemini(email_text, metadata=None):
    """
    Analyze email text with Gemini AI to detect phishing
    
    Args:
        email_text (str): The email body text
        metadata (dict): Additional email metadata like sender, subject, etc.
    
    Returns:
        dict: Analysis results
    """
    if not GEMINI_API_KEY:
        return {
            'error': 'Gemini API key not configured',
            'phishing_score': 0,
            'is_phishing': False,
            'analysis': {}
        }
    
    try:
        # Import here to avoid issues if API key is not set
        import google.generativeai as genai
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-1.5-flash-latest')
        
        # Prepare metadata string
        metadata_str = ""
        if metadata:
            metadata_str = "Metadata:\n"
            for key, value in metadata.items():
                if value is not None:
                    metadata_str += f"{key}: {value}\n"
        
        # Create prompt for Gemini
        prompt = f"""
        Analyze this email and determine if it is a phishing attempt. 
        Check the sender's credibility, URL links, urgency, and any suspicious content.
        
        Email Content:
        {email_text}
        
        {metadata_str}
        
        Provide a detailed analysis with the following structure:
        1. Is this a phishing email? (Yes/No)
        2. Phishing score (0-100%)
        3. Key indicators (list specific phishing indicators found)
        4. Safe indicators (list indicators suggesting the email is legitimate)
        5. Recommendations
        
        Format your response as a JSON object with the following keys:
        - is_phishing (boolean)
        - phishing_score (number between 0-100)
        - key_indicators (array of strings)
        - safe_indicators (array of strings)
        - recommendations (array of strings)
        - analysis (string with detailed explanation)
        """
        
        # Generate response from Gemini
        response = model.generate_content(prompt)
        
        # Parse the response
        response_text = response.text
        
        # Extract JSON from response
        try:
            # Try to find JSON in the response
            json_start = response_text.find('{')
            json_end = response_text.rfind('}') + 1
            
            if json_start >= 0 and json_end > json_start:
                json_str = response_text[json_start:json_end]
                result = json.loads(json_str)
            else:
                # If no JSON found, create a structured response
                is_phishing = "yes" in response_text.lower() and "phishing" in response_text.lower()
                
                # Extract phishing score if present
                score_match = re.search(r'(\d+)%', response_text)
                phishing_score = int(score_match.group(1)) if score_match else (75 if is_phishing else 25)
                
                result = {
                    'is_phishing': is_phishing,
                    'phishing_score': phishing_score,
                    'key_indicators': [],
                    'safe_indicators': [],
                    'recommendations': [],
                    'analysis': response_text
                }
                
                # Try to extract indicators and recommendations
                lines = response_text.split('\n')
                current_section = None
                
                for line in lines:
                    line = line.strip()
                    if not line:
                        continue
                    
                    if 'key indicators' in line.lower() or 'phishing indicators' in line.lower():
                        current_section = 'key_indicators'
                    elif 'safe indicators' in line.lower() or 'legitimate indicators' in line.lower():
                        current_section = 'safe_indicators'
                    elif 'recommendations' in line.lower():
                        current_section = 'recommendations'
                    elif current_section and line.startswith('-'):
                        result[current_section].append(line[1:].strip())
        except Exception as e:
            print(f"Error parsing Gemini response: {str(e)}")
            result = {
                'is_phishing': False,
                'phishing_score': 0,
                'key_indicators': [],
                'safe_indicators': [],
                'recommendations': [],
                'analysis': response_text,
                'parsing_error': str(e)
            }
        
        return result
    
    except Exception as e:
        print(f"Error calling Gemini API: {str(e)}")
        return {
            'error': str(e),
            'phishing_score': 0,
            'is_phishing': False,
            'analysis': {}
        } 