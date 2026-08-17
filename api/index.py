import sys
import os

# Add backend path to sys.path
backend_dir = os.path.join(os.path.dirname(__file__), '..', 'fashionista', 'backend')
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app import app

# Export app instance for Vercel Serverless Functions
app = app
