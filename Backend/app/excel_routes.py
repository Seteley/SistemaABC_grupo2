import io
from flask import Blueprint, request, send_file
import pandas as pd
from datetime import datetime
from app.funcion import read_tabla

excel_bp = Blueprint("excel", __name__)

@excel_bp.route("/plantilla_excel", methods=["GET"])
def plantilla_excel():
    # Obtener mes y año de la query
    mes = request.args.get("mes")
    anio = request.args.get("anio")
    if not mes or not anio:
        return {"error": "Faltan parámetros mes o año"}, 400
    nombre_archivo = f"Datos_{mes}_{anio}.xlsx"

    # Hoja 1: Recursos
    recursos = read_tabla("recurso")
    df_recursos = pd.DataFrame(recursos)[["codigo", "nombre"]]
    df_recursos.columns = ["Código", "Recurso"]
    df_recursos["Monto"] = ""  # columna vacía para que el usuario la llene

    # Hoja 2: Objetos
    objetos = read_tabla("objeto")
    df_objetos = pd.DataFrame(objetos)[["codigo", "nombre"]]
    df_objetos.columns = ["Código", "Nombre"]
    df_objetos["Cantidad"] = ""

    # Crear el archivo Excel en memoria
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine="xlsxwriter") as writer:
        df_recursos.to_excel(writer, index=False, sheet_name="Recursos")
        df_objetos.to_excel(writer, index=False, sheet_name="Objetos")

        # Hoja 3: Objeto x Actividad
        actividades = read_tabla("actividad")
        objetos = read_tabla("objeto")
        inductores = {i["codigo"]: i["nombre"] for i in read_tabla("inductor")}
        # Construir DataFrame: filas=actividades, columnas=objetos
        data = []
        for act in actividades:
            inductor_nombre = inductores.get(act.get("cod_inductor"), "") if act.get("cod_inductor") else ""
            row = [act["nombre"], inductor_nombre] + ["" for _ in objetos]
            data.append(row)
        columnas = ["Actividad", "Inductor"] + [obj["nombre"] for obj in objetos]
        df_obj_act = pd.DataFrame(data, columns=columnas)
        df_obj_act.to_excel(writer, index=False, sheet_name="Objeto-Actividad")
    output.seek(0)

    return send_file(
        output,
        as_attachment=True,
        download_name=nombre_archivo,
        mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
