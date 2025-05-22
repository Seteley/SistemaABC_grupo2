// frontend/src/api/abcApi.ts

const API_URL = "http://127.0.0.1:5000"; // Cambia si tu backend está en otro host/puerto

export async function getRecursoxActividad(periodo: string) {
  const res = await fetch(`${API_URL}/recursoxactividad?periodo=${encodeURIComponent(periodo)}`);
  if (!res.ok) throw new Error("Error al obtener recursoxactividad");
  return res.json();
}

export async function getActividadObjeto(periodo: string) {
  const res = await fetch(`${API_URL}/actividad_objeto?periodo=${encodeURIComponent(periodo)}`);
  if (!res.ok) throw new Error("Error al obtener actividad_objeto");
  return res.json();
}

export async function getCostoUnitario(periodo: string) {
  const res = await fetch(`${API_URL}/costounitario?periodo=${encodeURIComponent(periodo)}`);
  if (!res.ok) throw new Error("Error al obtener costounitario");
  return res.json();
}