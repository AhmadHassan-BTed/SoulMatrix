import http.server
import socketserver
import sys

PORT = 8000

class CleanHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        sys.stdout.write("%s - - [%s] %s\n" %
                         (self.client_address[0],
                          self.log_date_time_string(),
                          format%args))
        sys.stdout.flush()

class CleanThreadingTCPServer(socketserver.ThreadingTCPServer):
    allow_reuse_address = True

    def handle_error(self, request, client_address):
        exc_type, exc_value, _ = sys.exc_info()
       
        if exc_type is not None and issubclass(exc_type, (ConnectionAbortedError, ConnectionResetError, OSError)):
            if getattr(exc_value, 'errno', None) in (10053, 10054) or "10053" in str(exc_value) or "10054" in str(exc_value):
                return

        super().handle_error(request, client_address)

def main():
    handler = CleanHTTPRequestHandler
    try:
        with CleanThreadingTCPServer(("", PORT), handler) as httpd:
            print("===================================================")
            print(f"  Python Local Server Running on port {PORT}")
            print("  Serving files from local directory")
            print("  Press Ctrl+C in this window to stop the server")
            print("===================================================")
            print()
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped by user.")
        sys.exit(0)
    except Exception as e:
        print(f"\n[ERROR] Server failed to start: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
