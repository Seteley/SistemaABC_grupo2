// src/pages/RecursoActividadPage.tsx
import { useEffect, useState } from "react";
import { getRecursoxActividad } from "../api/abcApi";

export default function RecursoActividadPage({ periodo }: { periodo: string }) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      try {
        const result = await getRecursoxActividad(periodo);
        setData(result);
      } catch (e: any) {
        setError(e.message);
        setData(null);
      }
    };
    fetchData();
  }, [periodo]);

  // Procesar los datos para armar la tabla dinámica
  let actividades: string[] = [];
  let recursos: { cod: string, nombre: string }[] = [];
  let tabla: Record<string, Record<string, number>> = {};
  let totales: Record<string, number> = {};

  if (Array.isArray(data) && data.length > 0) {
    // Obtener lista de actividades únicas en orden
    actividades = Array.from(new Set(data.map((row: any) => row.nombre_actividad)));
    // Obtener lista de recursos únicos en orden
    const recs = new Map<string, string>();
    data.forEach((row: any) => recs.set(row.cod_recurso, row.nombre_recurso));
    recursos = Array.from(recs.entries()).map(([cod, nombre]) => ({ cod, nombre }));
    // Llenar la tabla de montos prorrateados
    data.forEach((row: any) => {
      if (!tabla[row.cod_recurso]) tabla[row.cod_recurso] = {};
      // Asegurarse de sumar como número
      const valor = Number(row.monto_prorrateado) || 0;
      tabla[row.cod_recurso][row.nombre_actividad] = valor;
    });
    // Calcular totales por actividad
    actividades.forEach(act => {
      totales[act] = recursos.reduce((acc, rec) => acc + (tabla[rec.cod]?.[act] ?? 0), 0);
    });
  }

  return (
    <div>
      <h2>Recurso x Actividad</h2>
      {error && <div style={{color: "red"}}>{error}</div>}
      {actividades.length > 0 && recursos.length > 0 ? (
        <table border={1} cellPadding={6} style={{marginTop: 16}}>
          <thead>
            <tr>
              <th>Código del recurso</th>
              <th>Recurso</th>
              {actividades.map(act => <th key={act}>{act}</th>)}
            </tr>
          </thead>
          <tbody>
            {recursos.map(rec => (
              <tr key={rec.cod}>
                <td>{rec.cod}</td>
                <td>{rec.nombre}</td>
                {actividades.map(act => (
                  <td key={act}>{(tabla[rec.cod]?.[act] ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                ))}
              </tr>
            ))}
            <tr style={{fontWeight: 'bold', background: '#f0f0f0'}}>
              <td colSpan={2}>Total</td>
              {actividades.map(act => <td key={act}>{totales[act]?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>)}
            </tr>
          </tbody>
        </table>
      ) : (
        <pre>{data && JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  );
}