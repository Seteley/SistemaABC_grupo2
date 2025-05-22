// src/pages/CostoUnitarioPage.tsx
import { useEffect, useState } from "react";
import { getCostoUnitario } from "../api/abcApi";

export default function CostoUnitarioPage({ periodo }: { periodo: string }) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      try {
        const result = await getCostoUnitario(periodo);
        setData(result);
      } catch (e: any) {
        setError(e.message);
        setData(null);
      }
    };
    fetchData();
  }, [periodo]);

  // Procesar los datos para armar la tabla
  let columnas: string[] = [];
  let costoTotal: Record<string, number> = {};
  let cantidad: Record<string, number> = {};
  let costoUnitario: Record<string, number> = {};

  if (Array.isArray(data) && data.length > 0) {
    columnas = data.map((obj: any) => obj.nombre_objeto);
    data.forEach((obj: any) => {
      costoTotal[obj.nombre_objeto] = obj.costo_total_objeto;
      cantidad[obj.nombre_objeto] = obj.cantidad_objeto;
      costoUnitario[obj.nombre_objeto] = obj.costo_unitario;
    });
  }

  return (
    <div>
      <h2>Costo Unitario</h2>
      {error && <div style={{color: "red"}}>{error}</div>}
      {columnas.length > 0 ? (
        <table border={1} cellPadding={6} style={{marginTop: 16}}>
          <thead>
            <tr>
              <th>Concepto</th>
              {columnas.map(nombre => <th key={nombre}>{nombre}</th>)}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Costo total</td>
              {columnas.map(nombre => <td key={nombre}>{costoTotal[nombre]}</td>)}
            </tr>
            <tr>
              <td>Cantidad</td>
              {columnas.map(nombre => <td key={nombre}>{cantidad[nombre]}</td>)}
            </tr>
            <tr>
              <td>Costo unitario</td>
              {columnas.map(nombre => <td key={nombre}>{costoUnitario[nombre]}</td>)}
            </tr>
          </tbody>
        </table>
      ) : (
        <pre>{data && JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  );
}
