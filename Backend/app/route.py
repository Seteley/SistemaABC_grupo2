from flask import Blueprint, jsonify
from .funcion import obtener_usuarios

main_bp = Blueprint('main', __name__)

@main_bp.route('/actividad_objeto', methods=['GET'])
def listar_usuarios():
    usuarios = obtener_usuarios()
    return jsonify(usuarios)
