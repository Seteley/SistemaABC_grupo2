WITH recurso_en_centro AS (
    -- Distribuye el costo del recurso al centro en base al inductor
    SELECT
        r.codigo AS cod_recurso,
        ic.cod_centro,
        r.cod_prorrateo AS cod_inductor,
        rp.fecha_periodo,
        rp.monto * (ic.cantidad_inductor / SUM(ic.cantidad_inductor) OVER (PARTITION BY r.codigo, rp.fecha_periodo)) AS monto_al_centro
    FROM recurso r
    JOIN recurso_periodo rp ON r.codigo = rp.cod_recurso
    JOIN inductor_centro ic ON r.cod_prorrateo = ic.cod_inductor AND rp.fecha_periodo = ic.fecha_periodo
),

costo_actividad AS (
    -- Distribuye el monto del recurso por centro a las actividades según porcentaje de uso del inductor
    SELECT
        ia.cod_actividad,
        rac.fecha_periodo,
        SUM(
            rac.monto_al_centro * (ia.porcentaje / 100.0)
        ) AS costo_actividad
    FROM recurso_en_centro rac
    JOIN actividad a ON a.cod_centro = rac.cod_centro
    JOIN inductor_actividad ia
        ON ia.cod_actividad = a.codigo
        AND ia.cod_inductor = rac.cod_inductor
        AND ia.fecha_periodo = rac.fecha_periodo
    GROUP BY ia.cod_actividad, rac.fecha_periodo
),

costo_objeto AS (
    -- Distribuye el costo de la actividad al objeto de costo según porcentaje
    SELECT
        ao.cod_objeto,
        ao.fecha_periodo,
        SUM(
            ca.costo_actividad * (ao.porcentaje / 100.0)
        ) AS costo_total_objeto
    FROM costo_actividad ca
    JOIN actividad_objeto ao
        ON ca.cod_actividad = ao.cod_actividad
        AND ca.fecha_periodo = ao.fecha_periodo
    GROUP BY ao.cod_objeto, ao.fecha_periodo
)

-- Resultado final: costo unitario por producto
SELECT
    o.codigo AS cod_objeto,
    o.nombre,
    co.fecha_periodo,
    co.costo_total_objeto,
    op.cantidad,
    ROUND(co.costo_total_objeto / op.cantidad, 2) AS costo_unitario
FROM costo_objeto co
JOIN objeto_periodo op
    ON co.cod_objeto = op.cod_objeto AND co.fecha_periodo = op.fecha_periodo
JOIN objeto o ON o.codigo = co.cod_objeto
ORDER BY o.codigo;
