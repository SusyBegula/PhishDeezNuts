from app import create_app
from app.routes.auth import setup_oauth
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create Flask app
app = create_app()

# Set up OAuth
with app.app_context():
    setup_oauth(app)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True) 