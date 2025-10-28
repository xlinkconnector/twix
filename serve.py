#!/usr/bin/env python3
"""
Simple HTTP server for testing the TWIX Chain landing page locally.
Usage: python serve.py [port]
Default port: 8000
"""

import http.server
import socketserver
import sys
import os
from pathlib import Path

def serve(port=8000):
    """Start a simple HTTP server."""
    
    # Change to the script directory
    os.chdir(Path(__file__).parent)
    
    Handler = http.server.SimpleHTTPRequestHandler
    
    # Add custom headers for security
    class CustomHandler(Handler):
        def end_headers(self):
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
            self.send_header('X-Content-Type-Options', 'nosniff')
            super().end_headers()
    
    try:
        with socketserver.TCPServer(("", port), CustomHandler) as httpd:
            print("=" * 60)
            print("🚀 TWIX Chain Landing Page - Local Server")
            print("=" * 60)
            print(f"\n✅ Server running at: http://localhost:{port}")
            print(f"📁 Serving files from: {os.getcwd()}")
            print(f"\n🌐 Open in browser: http://localhost:{port}")
            print("\n⌨️  Press Ctrl+C to stop the server\n")
            print("=" * 60)
            
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n\n👋 Server stopped. Goodbye!")
        sys.exit(0)
    except OSError as e:
        if "Address already in use" in str(e):
            print(f"\n❌ Error: Port {port} is already in use.")
            print(f"   Try a different port: python serve.py {port + 1}")
        else:
            print(f"\n❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    serve(port)