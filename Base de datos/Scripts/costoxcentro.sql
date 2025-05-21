WITH prorrateo_inductor AS (
    -- Relación recurso → inductor → cantidad del inductor por centro
    SELECT
        r.codigo AS cod_recurso,
        r.cod_prorrateo AS cod_inductor,
        ic.cod_centro,
        ic.fecha_periodo,
        ic.cantidad_inductor,
        rp.monto,
        SUM(ic.cantidad_inductor) OVER (
            PARTITION BY r.codigo, ic.fecha_periodo
        ) AS total_inductor
    FROM recurso r
    JOIN inductor_centro ic ON r.cod_prorrateo = ic.cod_inductor
    JOIN recurso_periodo rp ON r.codigo = rp.cod_recurso AND ic.fecha_periodo = rp.fecha_periodo
)

SELECT
    cod_recurso,
    cod_centro,
    fecha_periodo,
    ROUND(monto * (cantidad_inductor / NULLIF(total_inductor, 0)), 2) AS monto_asignado
FROM prorrateo_inductor
ORDER BY cod_recurso, cod_centro, fecha_periodo;