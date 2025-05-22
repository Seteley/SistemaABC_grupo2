import io
import pandas as pd
from flask import Blueprint, request, send_file, jsonify
from datetime import datetime
from app.funcion import read_tabla, create_tabla
import re

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

        # Hoja 3: Recurso - Actividad
        recursos = read_tabla("recurso")
        actividades = read_tabla("actividad")
        inductores = {i["codigo"]: i["nombre"] for i in read_tabla("inductor")}
        data_ra = []
        for rec in recursos:
            inductor_nombre = inductores.get(rec.get("cod_prorrateo"), "") if rec.get("cod_prorrateo") else ""
            row = [rec["nombre"], inductor_nombre] + ["" for _ in actividades]
            data_ra.append(row)
        columnas_ra = ["Recurso", "Inductor de recurso"] + [act["nombre"] for act in actividades]
        df_rec_act = pd.DataFrame(data_ra, columns=columnas_ra)
        df_rec_act.to_excel(writer, index=False, sheet_name="Recurso-Actividad")

        # Hoja 4: Objeto x Actividad
        actividades = read_tabla("actividad")
        objetos = read_tabla("objeto")
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

@excel_bp.route("/cargar_plantilla_excel", methods=["POST"])
def cargar_plantilla_excel():
    if "file" not in request.files:
        return {"error": "No se envió archivo"}, 400
    file = request.files["file"]
    filename = file.filename
    # Extraer periodo del nombre del archivo: Datos_MM_YYYY.xlsx
    m = re.match(r"Datos_(\d{2})_(\d{4})", filename)
    if not m:
        return {"error": "Nombre de archivo inválido. Debe ser Datos_MM_YYYY.xlsx"}, 400
    mes, anio = m.group(1), m.group(2)
    periodo = f"{anio}-{mes}-01"
    # Leer el Excel
    xls = pd.ExcelFile(file)
    # Hoja Recursos
    if "Recursos" in xls.sheet_names:
        df_rec = pd.read_excel(xls, sheet_name="Recursos")
        for _, row in df_rec.iterrows():
            cod = str(row["Código"]).strip()
            monto = row["Monto"]
            if cod and pd.notnull(monto) and str(monto).strip() != "":
                create_tabla("recurso_periodo", {"cod_recurso": cod, "fecha_periodo": periodo, "monto": float(monto)})
    # Hoja Objetos
    if "Objetos" in xls.sheet_names:
        df_obj = pd.read_excel(xls, sheet_name="Objetos")
        for _, row in df_obj.iterrows():
            cod = str(row["Código"]).strip()
            cantidad = row["Cantidad"]
            if cod and pd.notnull(cantidad) and str(cantidad).strip() != "":
                create_tabla("objeto_periodo", {"cod_objeto": cod, "fecha_periodo": periodo, "cantidad": int(cantidad)})
    # Hoja Recurso-Actividad
    if "Recurso-Actividad" in xls.sheet_names:
        df_ra = pd.read_excel(xls, sheet_name="Recurso-Actividad")
        recursos = df_ra["Recurso"].tolist()
        actividades = list(df_ra.columns[2:])
        for i, rec in enumerate(recursos):
            # Buscar código del recurso por nombre
            recs = read_tabla("recurso", {"nombre": rec})
            if recs:
                cod_recurso = recs[0]["codigo"]
            else:
                continue
            for j, act in enumerate(actividades):
                val = df_ra.iloc[i][act]
                if pd.notnull(val) and str(val).strip() != "":
                    # Buscar código de la actividad por nombre
                    acts = read_tabla("actividad", {"nombre": act})
                    if acts:
                        cod_actividad = acts[0]["codigo"]
                        create_tabla("actividad_recurso", {"cod_actividad": cod_actividad, "cod_recurso": cod_recurso, "cantidad": float(val), "fecha_periodo": periodo})
    # Hoja Objeto-Actividad
    if "Objeto-Actividad" in xls.sheet_names:
        df_oa = pd.read_excel(xls, sheet_name="Objeto-Actividad")
        actividades = df_oa["Actividad"].tolist()
        objetos = list(df_oa.columns[2:])
        for i, act in enumerate(actividades):
            cod_actividad = None
            # Buscar código de la actividad por nombre
            acts = read_tabla("actividad", {"nombre": act})
            if acts:
                cod_actividad = acts[0]["codigo"]
            if not cod_actividad:
                continue
            for obj in objetos:
                val = df_oa.iloc[i][obj]
                if pd.notnull(val) and str(val).strip() != "":
                    # Buscar código del objeto por nombre
                    objs = read_tabla("objeto", {"nombre": obj})
                    if objs:
                        cod_objeto = objs[0]["codigo"]
                        create_tabla("objeto_actividad", {"cod_objeto": cod_objeto, "cod_actividad": cod_actividad, "cantidad": float(val), "fecha_periodo": periodo})
    return jsonify({"ok": True, "periodo": periodo})
