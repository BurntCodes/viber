from flask import Flask
from flask_cors import CORS

# Blueprints
from routes.auth import auth_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(auth_bp)

@app.route("/")
def hello():
    return "Hello, World!"


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
