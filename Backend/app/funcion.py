from .db import get_connection

def create_tabla(tabla, data):
    conn = get_connection()
    columnas = ', '.join(data.keys())
    valores = ', '.join(['%s'] * len(data))
    sql = f"INSERT INTO {tabla} ({columnas}) VALUES ({valores}) RETURNING *"
    with conn.cursor() as cur:
        cur.execute(sql, list(data.values()))
        result = cur.fetchone()
        columnas = [desc[0] for desc in cur.description]
    conn.commit()
    conn.close()
    return dict(zip(columnas, result)) if result else None

def read_tabla(tabla, where=None):
    conn = get_connection()
    sql = f"SELECT * FROM {tabla}"
    params = []
    if where:
        condiciones = [f"{k} = %s" for k in where.keys()]
        sql += " WHERE " + " AND ".join(condiciones)
        params = list(where.values())
    with conn.cursor() as cur:
        cur.execute(sql, params)
        rows = cur.fetchall()
        columnas = [desc[0] for desc in cur.description]
    conn.close()
    return [dict(zip(columnas, fila)) for fila in rows]

def update_tabla(tabla, data, where):
    conn = get_connection()
    set_expr = ', '.join([f"{k} = %s" for k in data.keys()])
    condiciones = [f"{k} = %s" for k in where.keys()]
    sql = f"UPDATE {tabla} SET {set_expr} WHERE {' AND '.join(condiciones)} RETURNING *"
    params = list(data.values()) + list(where.values())
    with conn.cursor() as cur:
        cur.execute(sql, params)
        result = cur.fetchone()
        columnas = [desc[0] for desc in cur.description] if result else []
    conn.commit()
    conn.close()
    return dict(zip(columnas, result)) if result else None

def delete_tabla(tabla, where):
    conn = get_connection()
    condiciones = [f"{k} = %s" for k in where.keys()]
    sql = f"DELETE FROM {tabla} WHERE {' AND '.join(condiciones)} RETURNING *"
    params = list(where.values())
    with conn.cursor() as cur:
        cur.execute(sql, params)
        result = cur.fetchone()
        columnas = [desc[0] for desc in cur.description] if result else []
    conn.commit()
    conn.close()
    return dict(zip(columnas, result)) if result else None

# Consulta: recursoxactividad.sql

def recursoxactividad(periodo):
    sql = f"""
WITH recurso_actividad AS (
    SELECT
        r.codigo AS cod_recurso,
        r.nombre AS nombre_recurso,
        ar.cod_actividad,
        a.nombre AS nombre_actividad,
        ar.cantidad AS cantidad_inductor_actividad,
        rp.monto,
        SUM(ar.cantidad) OVER (PARTITION BY r.codigo, ar.fecha_periodo) AS total_inductor_recurso,
        ar.fecha_periodo
    FROM actividad_recurso ar
    JOIN recurso r ON ar.cod_recurso = r.codigo
    JOIN recurso_periodo rp ON r.codigo = rp.cod_recurso AND ar.fecha_periodo = rp.fecha_periodo
    JOIN actividad a ON ar.cod_actividad = a.codigo
)
SELECT
    cod_recurso,
    nombre_recurso,
    cod_actividad,
    nombre_actividad,
    ROUND(monto * (cantidad_inductor_actividad / NULLIF(total_inductor_recurso, 0)), 2) AS monto_prorrateado
FROM recurso_actividad
WHERE fecha_periodo = %s
ORDER BY cod_recurso, cod_actividad;
"""
    conn = get_connection()
    with conn.cursor() as cur:
        cur.execute(sql, (periodo,))
        rows = cur.fetchall()
        columnas = [desc[0] for desc in cur.description]
    conn.close()
    return [dict(zip(columnas, fila)) for fila in rows]

# Consulta: actividad_objeto.sql

def actividad_objeto(periodo):
    sql = f"""
WITH total_recurso AS (
    SELECT
        ar.cod_recurso,
        ar.fecha_periodo,
        SUM(ar.cantidad) AS total_cantidad
    FROM actividad_recurso ar
    WHERE ar.fecha_periodo = %s
    GROUP BY ar.cod_recurso, ar.fecha_periodo
),
-- Costo total de cada actividad (sumando todos los recursos)
costo_actividad AS (
    SELECT
        ar.cod_actividad,
        a.nombre AS nombre_actividad,
        ar.fecha_periodo,
        SUM(
            CASE
                WHEN tr.total_cantidad = 0 THEN 0
                ELSE rp.monto * (ar.cantidad / tr.total_cantidad)
            END
        ) AS costo_total_actividad
    FROM actividad_recurso ar
    JOIN recurso r ON ar.cod_recurso = r.codigo
    JOIN recurso_periodo rp ON r.codigo = rp.cod_recurso AND ar.fecha_periodo = rp.fecha_periodo
    JOIN actividad a ON ar.cod_actividad = a.codigo
    JOIN total_recurso tr ON ar.cod_recurso = tr.cod_recurso AND ar.fecha_periodo = tr.fecha_periodo
    WHERE ar.fecha_periodo = %s
    GROUP BY ar.cod_actividad, a.nombre, ar.fecha_periodo
),
-- Paso 2: Repartir el costo de cada actividad a los objetos de costo según la cantidad de objeto_actividad
total_actividad_objeto AS (
    SELECT
        oa.cod_actividad,
        oa.fecha_periodo,
        SUM(oa.cantidad) AS total_cantidad_actividad
    FROM objeto_actividad oa
    WHERE oa.fecha_periodo = %s
    GROUP BY oa.cod_actividad, oa.fecha_periodo
)
SELECT
    oa.cod_objeto,
    o.nombre AS nombre_objeto,
    ca.cod_actividad,
    ca.nombre_actividad,
    ROUND(
        ca.costo_total_actividad * (oa.cantidad / NULLIF(tao.total_cantidad_actividad, 0)),
        2
    ) AS costo_asignado_objeto
FROM objeto_actividad oa
JOIN total_actividad_objeto tao ON oa.cod_actividad = tao.cod_actividad AND oa.fecha_periodo = tao.fecha_periodo
JOIN costo_actividad ca ON oa.cod_actividad = ca.cod_actividad AND oa.fecha_periodo = ca.fecha_periodo
JOIN objeto o ON oa.cod_objeto = o.codigo
WHERE oa.fecha_periodo = %s
ORDER BY oa.cod_objeto, ca.cod_actividad;
"""
    conn = get_connection()
    with conn.cursor() as cur:
        cur.execute(sql, (periodo, periodo, periodo, periodo))
        rows = cur.fetchall()
        columnas = [desc[0] for desc in cur.description]
    conn.close()
    return [dict(zip(columnas, fila)) for fila in rows]

# Consulta: costounitario.sql

def costounitario(periodo):
    sql = f"""
WITH total_recurso AS (
    SELECT
        ar.cod_recurso,
        ar.fecha_periodo,
        SUM(ar.cantidad) AS total_cantidad
    FROM actividad_recurso ar
    WHERE ar.fecha_periodo = %s
    GROUP BY ar.cod_recurso, ar.fecha_periodo
),
costo_actividad AS (
    SELECT
        ar.cod_actividad,
        a.nombre AS nombre_actividad,
        ar.cod_recurso,
        r.nombre AS nombre_recurso,
        ar.fecha_periodo,
        SUM(
            CASE
                WHEN tr.total_cantidad = 0 THEN 0
                ELSE rp.monto * (ar.cantidad / tr.total_cantidad)
            END
        ) AS costo_total_actividad
    FROM actividad_recurso ar
    JOIN recurso r ON ar.cod_recurso = r.codigo
    JOIN recurso_periodo rp ON r.codigo = rp.cod_recurso AND ar.fecha_periodo = rp.fecha_periodo
    JOIN actividad a ON ar.cod_actividad = a.codigo
    JOIN total_recurso tr ON ar.cod_recurso = tr.cod_recurso AND ar.fecha_periodo = tr.fecha_periodo
    WHERE ar.fecha_periodo = %s
    GROUP BY ar.cod_actividad, a.nombre, ar.cod_recurso, r.nombre, ar.fecha_periodo
),
total_actividad_objeto AS (
    SELECT
        oa.cod_actividad,
        oa.fecha_periodo,
        SUM(oa.cantidad) AS total_cantidad_actividad
    FROM objeto_actividad oa
    WHERE oa.fecha_periodo = %s
    GROUP BY oa.cod_actividad, oa.fecha_periodo
),
costo_objeto_actividad AS (
    SELECT
        oa.cod_objeto,
        o.nombre AS nombre_objeto,
        ca.cod_actividad,
        ca.nombre_actividad,
        ca.cod_recurso,
        ca.nombre_recurso,
        ROUND(
            ca.costo_total_actividad * (oa.cantidad / NULLIF(tao.total_cantidad_actividad, 0)),
            2
        ) AS costo_asignado_objeto,
        oa.fecha_periodo
    FROM objeto_actividad oa
    JOIN total_actividad_objeto tao ON oa.cod_actividad = tao.cod_actividad AND oa.fecha_periodo = tao.fecha_periodo
    JOIN costo_actividad ca ON oa.cod_actividad = ca.cod_actividad AND oa.fecha_periodo = ca.fecha_periodo
    JOIN objeto o ON oa.cod_objeto = o.codigo
    WHERE oa.fecha_periodo = %s
),
costo_total_objeto AS (
    SELECT
        cod_objeto,
        nombre_objeto,
        fecha_periodo,
        SUM(costo_asignado_objeto) AS costo_total_objeto
    FROM costo_objeto_actividad
    GROUP BY cod_objeto, nombre_objeto, fecha_periodo
)
SELECT
    cto.cod_objeto,
    cto.nombre_objeto,
    cto.costo_total_objeto,
    op.cantidad AS cantidad_objeto,
    ROUND(cto.costo_total_objeto / NULLIF(op.cantidad, 0), 2) AS costo_unitario
FROM costo_total_objeto cto
JOIN objeto_periodo op ON cto.cod_objeto = op.cod_objeto AND cto.fecha_periodo = op.fecha_periodo
ORDER BY cto.cod_objeto;
"""
    conn = get_connection()
    with conn.cursor() as cur:
        cur.execute(sql, (periodo, periodo, periodo, periodo))
        rows = cur.fetchall()
        columnas = [desc[0] for desc in cur.description]
    conn.close()
    return [dict(zip(columnas, fila)) for fila in rows]

