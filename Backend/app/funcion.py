from .db import get_connection

def obtener_usuarios():
    conn = get_connection()
    with conn.cursor() as cur:
        cur.execute("SELECT * FROM actividad_objeto")
        rows = cur.fetchall()
        columnas = [desc[0] for desc in cur.description]  # nombres de columnas
    conn.close()

    resultados = [
        dict(zip(columnas, fila)) for fila in rows
    ]
    return resultados
