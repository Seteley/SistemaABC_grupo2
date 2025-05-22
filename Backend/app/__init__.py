from flask import Flask

def create_app():
    app = Flask(__name__)

    from .route import main_bp
    from .excel_routes import excel_bp
    app.register_blueprint(main_bp)
    app.register_blueprint(excel_bp)

    return app
