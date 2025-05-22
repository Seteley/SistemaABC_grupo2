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

// Recursos
export async function getRecursos() {
  const res = await fetch(`${API_URL}/recurso`);
  if (!res.ok) throw new Error("Error al obtener recursos");
  return res.json();
}
export async function createRecurso(data: any) {
  const res = await fetch(`${API_URL}/recurso`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear recurso");
  return res.json();
}
export async function updateRecurso(id: string, data: any) {
  const res = await fetch(`${API_URL}/recurso`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data, where: { codigo: id } }),
  });
  if (!res.ok) throw new Error("Error al actualizar recurso");
  return res.json();
}
export async function deleteRecurso(id: string) {
  const res = await fetch(`${API_URL}/recurso`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ codigo: id }),
  });
  if (!res.ok) throw new Error("Error al eliminar recurso");
  return res.json();
}
// Actividades
export async function getActividades() {
  const res = await fetch(`${API_URL}/actividad`);
  if (!res.ok) throw new Error("Error al obtener actividades");
  return res.json();
}
export async function createActividad(data: any) {
  const res = await fetch(`${API_URL}/actividad`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear actividad");
  return res.json();
}
export async function updateActividad(id: string, data: any) {
  const res = await fetch(`${API_URL}/actividad`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data, where: { codigo: id } }),
  });
  if (!res.ok) throw new Error("Error al actualizar actividad");
  return res.json();
}
export async function deleteActividad(id: string) {
  const res = await fetch(`${API_URL}/actividad`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ codigo: id }),
  });
  if (!res.ok) throw new Error("Error al eliminar actividad");
  return res.json();
}
// Objetos de Costo
export async function getObjetos() {
  const res = await fetch(`${API_URL}/objeto`);
  if (!res.ok) throw new Error("Error al obtener objetos");
  return res.json();
}
export async function createObjeto(data: any) {
  const res = await fetch(`${API_URL}/objeto`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear objeto");
  return res.json();
}
export async function updateObjeto(id: string, data: any) {
  const res = await fetch(`${API_URL}/objeto`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data, where: { codigo: id } }),
  });
  if (!res.ok) throw new Error("Error al actualizar objeto");
  return res.json();
}
export async function deleteObjeto(id: string) {
  const res = await fetch(`${API_URL}/objeto`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ codigo: id }),
  });
  if (!res.ok) throw new Error("Error al eliminar objeto");
  return res.json();
}
// Inductores
export async function getInductores() {
  const res = await fetch(`${API_URL}/inductor`);
  if (!res.ok) throw new Error("Error al obtener inductores");
  return res.json();
}
export async function createInductor(data: any) {
  const res = await fetch(`${API_URL}/inductor`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear inductor");
  return res.json();
}
export async function updateInductor(id: string, data: any) {
  const res = await fetch(`${API_URL}/inductor`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data, where: { codigo: id } }),
  });
  if (!res.ok) throw new Error("Error al actualizar inductor");
  return res.json();
}
export async function deleteInductor(id: string) {
  const res = await fetch(`${API_URL}/inductor`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ codigo: id }),
  });
  if (!res.ok) throw new Error("Error al eliminar inductor");
  return res.json();
}
// Centros
export async function getCentros() {
  const res = await fetch(`${API_URL}/centro`);
  if (!res.ok) throw new Error("Error al obtener centros");
  return res.json();
}
export async function createCentro(data: any) {
  const res = await fetch(`${API_URL}/centro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear centro");
  return res.json();
}
export async function updateCentro(id: string, data: any) {
  const res = await fetch(`${API_URL}/centro`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data, where: { codigo: id } }),
  });
  if (!res.ok) throw new Error("Error al actualizar centro");
  return res.json();
}
export async function deleteCentro(id: string) {
  const res = await fetch(`${API_URL}/centro`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ codigo: id }),
  });
  if (!res.ok) throw new Error("Error al eliminar centro");
  return res.json();
}