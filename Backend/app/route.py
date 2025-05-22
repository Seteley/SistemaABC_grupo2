from flask import Blueprint, jsonify, request
from .funcion import (
    create_tabla,
    read_tabla,
    update_tabla,
    delete_tabla,
    recursoxactividad,
    actividad_objeto,
    costounitario,
)

main_bp = Blueprint("main", __name__)

@main_bp.route('/favicon.ico')
def favicon():
    return '', 204  # No Content


# CREATE
@main_bp.route("/<tabla>", methods=["POST"])
def crear(tabla):
    data = request.json
    result = create_tabla(tabla, data)
    return jsonify(result), 201 if result else 400


# READ (all or with filters)
@main_bp.route("/<tabla>", methods=["GET"])
def leer(tabla):
    filtros = request.args.to_dict()
    result = read_tabla(tabla, filtros if filtros else None)
    return jsonify(result)


# UPDATE
@main_bp.route("/<tabla>", methods=["PUT"])
def editar(tabla):
    data = request.json.get("data")
    where = request.json.get("where")
    result = update_tabla(tabla, data, where)
    return jsonify(result) if result else ("", 404)


# DELETE
@main_bp.route("/<tabla>", methods=["DELETE"])
def eliminar(tabla):
    where = request.json
    result = delete_tabla(tabla, where)
    return jsonify(result) if result else ("", 404)


# ENDPOINTS ABC QUERIES
@main_bp.route("/recursoxactividad", methods=["GET"])
def api_recursoxactividad():
    periodo = request.args.get("periodo")
    if not periodo:
        return jsonify({"error": "Falta el parámetro 'periodo'"}), 400
    try:
        data = recursoxactividad(periodo)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@main_bp.route("/actividad_objeto", methods=["GET"])
def api_actividad_objeto():
    periodo = request.args.get("periodo")
    if not periodo:
        return jsonify({"error": "Falta el parámetro 'periodo'"}), 400
    try:
        data = actividad_objeto(periodo)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@main_bp.route("/costounitario", methods=["GET"])
def api_costounitario():
    periodo = request.args.get("periodo")
    if not periodo:
        return jsonify({"error": "Falta el parámetro 'periodo'"}), 400
    try:
        data = costounitario(periodo)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
