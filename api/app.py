from flask import Flask, request
from flask_cors import CORS

# Blueprints
from routes.auth import auth_bp

app = Flask(__name__)
app.secret_key = 'cool_secret'
app.register_blueprint(auth_bp)

CORS(app)

@app.route("/")
def hello():
    return "Hello, World!"

@app.before_request
def log_request_info():
    app.logger.info('Request Headers: %s', request.headers)
    app.logger.info('Request Data: %s', request.get_data())

@app.after_request
def log_response_info(response):
    app.logger.info('Response Status: %s', response.status)
    app.logger.info('Response Data: %s', response.get_data())
    return response


if __name__ == "__main__":
    app.run(host='192.168.20.15', port=5000, debug=True)
