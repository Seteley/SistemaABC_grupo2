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
WHERE fecha_periodo = '2025-01-01'
ORDER BY cod_recurso, cod_actividad;