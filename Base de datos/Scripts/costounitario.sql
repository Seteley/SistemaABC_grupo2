-- Paso 1: Calcular el costo total de cada actividad para el periodo
WITH total_recurso AS (
    SELECT
        ar.cod_recurso,
        ar.fecha_periodo,
        SUM(ar.cantidad) AS total_cantidad
    FROM actividad_recurso ar
    WHERE ar.fecha_periodo = '2025-01-01'
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
    WHERE ar.fecha_periodo = '2025-01-01'
    GROUP BY ar.cod_actividad, a.nombre, ar.cod_recurso, r.nombre, ar.fecha_periodo
),
total_actividad_objeto AS (
    SELECT
        oa.cod_actividad,
        oa.fecha_periodo,
        SUM(oa.cantidad) AS total_cantidad_actividad
    FROM objeto_actividad oa
    WHERE oa.fecha_periodo = '2025-01-01'
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
    WHERE oa.fecha_periodo = '2025-01-01'
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
    --cto.fecha_periodo,
    cto.costo_total_objeto,
    op.cantidad AS cantidad_objeto,
    ROUND(cto.costo_total_objeto / NULLIF(op.cantidad, 0), 2) AS costo_unitario
FROM costo_total_objeto cto
JOIN objeto_periodo op ON cto.cod_objeto = op.cod_objeto AND cto.fecha_periodo = op.fecha_periodo
ORDER BY cto.cod_objeto;
