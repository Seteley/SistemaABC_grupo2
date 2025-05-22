// src/pages/ActividadObjetoPage.tsx
import { useEffect, useState } from "react";
import { getActividadObjeto } from "../api/abcApi";

export default function ActividadObjetoPage({ periodo }: { periodo: string }) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      try {
        const result = await getActividadObjeto(periodo);
        setData(result);
      } catch (e: any) {
        setError(e.message);
        setData(null);
      }
    };
    fetchData();
  }, [periodo]);

  // Procesar los datos para armar la tabla dinámica
  let objetos: string[] = [];
  let actividades: { cod: string, nombre: string }[] = [];
  let tabla: Record<string, Record<string, number>> = {};
  let totales: Record<string, number> = {};

  if (Array.isArray(data) && data.length > 0) {
    // Obtener lista de objetos únicos en orden
    objetos = Array.from(new Set(data.map((row: any) => row.nombre_objeto)));
    // Obtener lista de actividades únicas en orden
    const acts = new Map<string, string>();
    data.forEach((row: any) => acts.set(row.cod_actividad, row.nombre_actividad));
    actividades = Array.from(acts.entries()).map(([cod, nombre]) => ({ cod, nombre }));
    // Llenar la tabla de costos asignados
    data.forEach((row: any) => {
      if (!tabla[row.cod_actividad]) tabla[row.cod_actividad] = {};
      // Asegurarse de sumar como número
      const valor = Number(row.costo_asignado_objeto) || 0;
      tabla[row.cod_actividad][row.nombre_objeto] = valor;
      totales[row.nombre_objeto] = (totales[row.nombre_objeto] || 0) + valor;
    });
  }

  return (
    <div>
      <h2>Actividad x Objeto</h2>
      {error && <div style={{color: "red"}}>{error}</div>}
      {objetos.length > 0 && actividades.length > 0 ? (
        <table border={1} cellPadding={6} style={{marginTop: 16}}>
          <thead>
            <tr>
              <th>Código</th>
              <th>Actividad</th>
              {objetos.map(obj => <th key={obj}>{obj}</th>)}
            </tr>
          </thead>
          <tbody>
            {actividades.map(act => (
              <tr key={act.cod}>
                <td>{act.cod}</td>
                <td>{act.nombre}</td>
                {objetos.map(obj => (
                  <td key={obj}>{tabla[act.cod]?.[obj] ?? 0}</td>
                ))}
              </tr>
            ))}
            <tr style={{fontWeight: 'bold', background: '#f0f0f0'}}>
              <td colSpan={2}>Total por objeto</td>
              {objetos.map(obj => <td key={obj}>{totales[obj] !== undefined ? totales[obj].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''}</td>)}
            </tr>
          </tbody>
        </table>
      ) : (
        <pre>{data && JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  );
}
