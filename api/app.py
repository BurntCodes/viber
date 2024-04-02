from flask import Flask
from flask_cors import CORS

# Blueprints
from routes.auth import auth_bp

app = Flask(__name__)
app.config['SECRET_KEY'] = 'cool_secret'
app.register_blueprint(auth_bp)

CORS(app)

@app.route("/")
def hello():
    return "Hello, World!"


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
