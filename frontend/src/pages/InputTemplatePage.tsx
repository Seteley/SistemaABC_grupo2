// src/pages/InputTemplatePage.tsx
import { useEffect, useState } from "react";
import { getRecursos, createRecurso, updateRecurso, deleteRecurso, getActividades, createActividad, updateActividad, deleteActividad, getObjetos, createObjeto, updateObjeto, deleteObjeto, getInductores, createInductor, updateInductor, deleteInductor } from "../api/abcApi";
import dayjs from "dayjs";

// Puedes ajustar estos nombres según tus tablas reales
const entidades = [
  { key: "inductor", label: "Inductores" },
  { key: "recurso", label: "Recursos" },
  { key: "actividad", label: "Actividades" },
  { key: "objeto", label: "Objetos de Costo" },
];

type Inductor = { codigo: string; nombre: string };
type Recurso = { codigo: string; nombre: string; cod_prorrateo: string };
type Actividad = { codigo: string; nombre: string; cod_centro?: string; cod_inductor?: string };
type Objeto = { codigo: string; nombre: string };

function InductorCrud({ onChange }: { onChange?: () => void }) {
  const [data, setData] = useState<Inductor[]>([]);
  const [nuevo, setNuevo] = useState<Partial<Inductor>>({});
  const [editando, setEditando] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Inductor>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getInductores().then(setData).catch(e => setError(e.message));
  }, []);

  const recargar = async () => {
    setData(await getInductores());
    onChange && onChange();
  };

  const handleCreate = async () => {
    setError(null);
    try {
      await createInductor(nuevo);
      setNuevo({});
      await recargar();
    } catch (e: any) {
      setError(e.message);
    }
  };
  const handleUpdate = async (id: string) => {
    setError(null);
    try {
      await updateInductor(id, editData);
      setEditando(null);
      setEditData({});
      await recargar();
    } catch (e: any) {
      setError(e.message);
    }
  };
  const handleDelete = async (id: string) => {
    setError(null);
    try {
      await deleteInductor(id);
      await recargar();
    } catch (e: any) {
      setError(e.message);
    }
  };
  return (
    <div style={{ marginBottom: 32, border: '1px solid #ccc', padding: 16 }}>
      <h3>Inductores</h3>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <table border={1} cellPadding={6}>
        <thead>
          <tr>
            <th>codigo</th>
            <th>nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.codigo}>
              <td>{editando === row.codigo ? <input value={editData.codigo ?? row.codigo} onChange={e => setEditData(ed => ({ ...ed, codigo: e.target.value }))} /> : row.codigo}</td>
              <td>{editando === row.codigo ? <input value={editData.nombre ?? row.nombre} onChange={e => setEditData(ed => ({ ...ed, nombre: e.target.value }))} /> : row.nombre}</td>
              <td>
                {editando === row.codigo
                  ? <>
                      <button onClick={() => handleUpdate(row.codigo)}>Guardar</button>
                      <button onClick={() => setEditando(null)}>Cancelar</button>
                    </>
                  : <>
                      <button onClick={() => { setEditando(row.codigo); setEditData(row); }}>Editar</button>
                      <button onClick={() => handleDelete(row.codigo)}>Eliminar</button>
                    </>}
              </td>
            </tr>
          ))}
          <tr>
            <td><input value={nuevo.codigo ?? ''} onChange={e => setNuevo(n => ({ ...n, codigo: e.target.value }))} /></td>
            <td><input value={nuevo.nombre ?? ''} onChange={e => setNuevo(n => ({ ...n, nombre: e.target.value }))} /></td>
            <td><button onClick={handleCreate}>Agregar</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function RecursoCrud({ inductores }: { inductores: Inductor[] }) {
  const [data, setData] = useState<Recurso[]>([]);
  const [nuevo, setNuevo] = useState<Partial<Recurso>>({});
  const [editando, setEditando] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Recurso>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getRecursos().then(setData).catch(e => setError(e.message));
  }, []);

  const recargar = async () => setData(await getRecursos());

  const handleCreate = async () => {
    setError(null);
    try {
      await createRecurso(nuevo);
      setNuevo({});
      await recargar();
    } catch (e: any) {
      setError(e.message);
    }
  };
  const handleUpdate = async (id: string) => {
    setError(null);
    try {
      await updateRecurso(id, editData);
      setEditando(null);
      setEditData({});
      await recargar();
    } catch (e: any) {
      setError(e.message);
    }
  };
  const handleDelete = async (id: string) => {
    setError(null);
    try {
      await deleteRecurso(id);
      await recargar();
    } catch (e: any) {
      setError(e.message);
    }
  };
  return (
    <div style={{ marginBottom: 32, border: '1px solid #ccc', padding: 16 }}>
      <h3>Recursos</h3>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <table border={1} cellPadding={6}>
        <thead>
          <tr>
            <th>codigo</th>
            <th>nombre</th>
            <th>Inductor de prorrateo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.codigo}>
              <td>{editando === row.codigo ? <input value={editData.codigo ?? row.codigo} onChange={e => setEditData(ed => ({ ...ed, codigo: e.target.value }))} /> : row.codigo}</td>
              <td>{editando === row.codigo ? <input value={editData.nombre ?? row.nombre} onChange={e => setEditData(ed => ({ ...ed, nombre: e.target.value }))} /> : row.nombre}</td>
              <td>{editando === row.codigo
                ? <select value={editData.cod_prorrateo ?? row.cod_prorrateo} onChange={e => setEditData(ed => ({ ...ed, cod_prorrateo: e.target.value }))}>
                    <option value="">Seleccione...</option>
                    {inductores.map(ind => <option key={ind.codigo} value={ind.codigo}>{ind.nombre}</option>)}
                  </select>
                : (inductores.find(i => i.codigo === row.cod_prorrateo)?.nombre || row.cod_prorrateo)}
              </td>
              <td>
                {editando === row.codigo
                  ? <>
                      <button onClick={() => handleUpdate(row.codigo)}>Guardar</button>
                      <button onClick={() => setEditando(null)}>Cancelar</button>
                    </>
                  : <>
                      <button onClick={() => { setEditando(row.codigo); setEditData(row); }}>Editar</button>
                      <button onClick={() => handleDelete(row.codigo)}>Eliminar</button>
                    </>}
              </td>
            </tr>
          ))}
          <tr>
            <td><input value={nuevo.codigo ?? ''} onChange={e => setNuevo(n => ({ ...n, codigo: e.target.value }))} /></td>
            <td><input value={nuevo.nombre ?? ''} onChange={e => setNuevo(n => ({ ...n, nombre: e.target.value }))} /></td>
            <td>
              <select value={nuevo.cod_prorrateo ?? ''} onChange={e => setNuevo(n => ({ ...n, cod_prorrateo: e.target.value }))}>
                <option value="">Seleccione...</option>
                {inductores.map(ind => <option key={ind.codigo} value={ind.codigo}>{ind.nombre}</option>)}
              </select>
            </td>
            <td><button onClick={handleCreate}>Agregar</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function ActividadCrud({ inductores }: { inductores: Inductor[] }) {
  const [data, setData] = useState<Actividad[]>([]);
  const [nuevo, setNuevo] = useState<Partial<Actividad>>({});
  const [editando, setEditando] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Actividad>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getActividades().then(setData).catch(e => setError(e.message));
  }, []);

  const recargar = async () => setData(await getActividades());

  const handleCreate = async () => {
    setError(null);
    try {
      await createActividad(nuevo);
      setNuevo({});
      await recargar();
    } catch (e: any) {
      setError(e.message);
    }
  };
  const handleUpdate = async (id: string) => {
    setError(null);
    try {
      await updateActividad(id, editData);
      setEditando(null);
      setEditData({});
      await recargar();
    } catch (e: any) {
      setError(e.message);
    }
  };
  const handleDelete = async (id: string) => {
    setError(null);
    try {
      await deleteActividad(id);
      await recargar();
    } catch (e: any) {
      setError(e.message);
    }
  };
  return (
    <div style={{ marginBottom: 32, border: '1px solid #ccc', padding: 16 }}>
      <h3>Actividades</h3>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <table border={1} cellPadding={6}>
        <thead>
          <tr>
            <th>codigo</th>
            <th>nombre</th>
            <th>Inductor</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.codigo}>
              <td>{editando === row.codigo ? <input value={editData.codigo ?? row.codigo} onChange={e => setEditData(ed => ({ ...ed, codigo: e.target.value }))} /> : row.codigo}</td>
              <td>{editando === row.codigo ? <input value={editData.nombre ?? row.nombre} onChange={e => setEditData(ed => ({ ...ed, nombre: e.target.value }))} /> : row.nombre}</td>
              <td>{editando === row.codigo
                ? <select value={editData.cod_inductor ?? ''} onChange={e => setEditData(ed => ({ ...ed, cod_inductor: e.target.value }))}>
                    <option value="">Seleccione...</option>
                    {inductores.map(ind => <option key={ind.codigo} value={ind.codigo}>{ind.nombre}</option>)}
                  </select>
                : (inductores.find(i => i.codigo === row.cod_inductor)?.nombre || row.cod_inductor || '')}
              </td>
              <td>
                {editando === row.codigo
                  ? <>
                      <button onClick={() => handleUpdate(row.codigo)}>Guardar</button>
                      <button onClick={() => setEditando(null)}>Cancelar</button>
                    </>
                  : <>
                      <button onClick={() => { setEditando(row.codigo); setEditData(row); }}>Editar</button>
                      <button onClick={() => handleDelete(row.codigo)}>Eliminar</button>
                    </>}
              </td>
            </tr>
          ))}
          <tr>
            <td><input value={nuevo.codigo ?? ''} onChange={e => setNuevo(n => ({ ...n, codigo: e.target.value }))} /></td>
            <td><input value={nuevo.nombre ?? ''} onChange={e => setNuevo(n => ({ ...n, nombre: e.target.value }))} /></td>
            <td>
              <select value={nuevo.cod_inductor ?? ''} onChange={e => setNuevo(n => ({ ...n, cod_inductor: e.target.value }))}>
                <option value="">Seleccione...</option>
                {inductores.map(ind => <option key={ind.codigo} value={ind.codigo}>{ind.nombre}</option>)}
              </select>
            </td>
            <td><button onClick={handleCreate}>Agregar</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function ObjetoCrud() {
  const [data, setData] = useState<Objeto[]>([]);
  const [nuevo, setNuevo] = useState<Partial<Objeto>>({});
  const [editando, setEditando] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Objeto>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getObjetos().then(setData).catch(e => setError(e.message));
  }, []);

  const recargar = async () => setData(await getObjetos());

  const handleCreate = async () => {
    setError(null);
    try {
      await createObjeto(nuevo);
      setNuevo({});
      await recargar();
    } catch (e: any) {
      setError(e.message);
    }
  };
  const handleUpdate = async (id: string) => {
    setError(null);
    try {
      await updateObjeto(id, editData);
      setEditando(null);
      setEditData({});
      await recargar();
    } catch (e: any) {
      setError(e.message);
    }
  };
  const handleDelete = async (id: string) => {
    setError(null);
    try {
      await deleteObjeto(id);
      await recargar();
    } catch (e: any) {
      setError(e.message);
    }
  };
  return (
    <div style={{ marginBottom: 32, border: '1px solid #ccc', padding: 16 }}>
      <h3>Objetos de Costo</h3>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <table border={1} cellPadding={6}>
        <thead>
          <tr>
            <th>codigo</th>
            <th>nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.codigo}>
              <td>{editando === row.codigo ? <input value={editData.codigo ?? row.codigo} onChange={e => setEditData(ed => ({ ...ed, codigo: e.target.value }))} /> : row.codigo}</td>
              <td>{editando === row.codigo ? <input value={editData.nombre ?? row.nombre} onChange={e => setEditData(ed => ({ ...ed, nombre: e.target.value }))} /> : row.nombre}</td>
              <td>
                {editando === row.codigo
                  ? <>
                      <button onClick={() => handleUpdate(row.codigo)}>Guardar</button>
                      <button onClick={() => setEditando(null)}>Cancelar</button>
                    </>
                  : <>
                      <button onClick={() => { setEditando(row.codigo); setEditData(row); }}>Editar</button>
                      <button onClick={() => handleDelete(row.codigo)}>Eliminar</button>
                    </>}
              </td>
            </tr>
          ))}
          <tr>
            <td><input value={nuevo.codigo ?? ''} onChange={e => setNuevo(n => ({ ...n, codigo: e.target.value }))} /></td>
            <td><input value={nuevo.nombre ?? ''} onChange={e => setNuevo(n => ({ ...n, nombre: e.target.value }))} /></td>
            <td><button onClick={handleCreate}>Agregar</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function DescargarPlantillaExcel() {
  const [anio, setAnio] = useState(dayjs().format("YYYY"));
  const [mes, setMes] = useState(dayjs().format("MM"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const meses = [
    { nombre: "Enero", valor: "01" },
    { nombre: "Febrero", valor: "02" },
    { nombre: "Marzo", valor: "03" },
    { nombre: "Abril", valor: "04" },
    { nombre: "Mayo", valor: "05" },
    { nombre: "Junio", valor: "06" },
    { nombre: "Julio", valor: "07" },
    { nombre: "Agosto", valor: "08" },
    { nombre: "Septiembre", valor: "09" },
    { nombre: "Octubre", valor: "10" },
    { nombre: "Noviembre", valor: "11" },
    { nombre: "Diciembre", valor: "12" },
  ];

  const handleDescargar = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:5000/plantilla_excel?mes=${mes}&anio=${anio}`);
      if (!res.ok) throw new Error("Error al descargar la plantilla");
      const blob = await res.blob();
      const nombreArchivo = `Datos_${mes}_${anio}.xlsx`;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = nombreArchivo;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{marginBottom: 32, border: '1px solid #ccc', padding: 16}}>
      <h3>Descargar plantilla Excel</h3>
      <label>
        Mes:
        <select value={mes} onChange={e => setMes(e.target.value)} style={{margin: '0 8px'}}>
          {meses.map(m => <option key={m.valor} value={m.valor}>{m.nombre}</option>)}
        </select>
      </label>
      <label>
        Año:
        <input type="number" value={anio} min="2000" max="2100" onChange={e => setAnio(e.target.value)} style={{width: 80, margin: '0 8px'}} />
      </label>
      <button onClick={handleDescargar} disabled={loading} style={{marginLeft: 8}}>
        {loading ? "Generando..." : "Descargar plantilla"}
      </button>
      {error && <div style={{ color: "red", marginTop: 12 }}>{error}</div>}
    </div>
  );
}

function CargarPlantillaExcel() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleUpload = async () => {
    setError(null);
    setSuccess(null);
    if (!file) {
      setError("Selecciona un archivo Excel");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("http://127.0.0.1:5000/cargar_plantilla_excel", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Error al cargar la plantilla");
      const data = await res.json();
      setSuccess("Datos cargados correctamente para el periodo " + data.periodo);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{marginBottom: 32, border: '1px solid #ccc', padding: 16}}>
      <h3>Cargar plantilla Excel</h3>
      <input type="file" accept=".xlsx" onChange={e => setFile(e.target.files?.[0] || null)} />
      <button onClick={handleUpload} disabled={loading || !file} style={{marginLeft: 8}}>
        {loading ? "Cargando..." : "Cargar plantilla"}
      </button>
      {error && <div style={{ color: "red", marginTop: 12 }}>{error}</div>}
      {success && <div style={{ color: "green", marginTop: 12 }}>{success}</div>}
    </div>
  );
}

export default function InputTemplatePage() {
  const [inductores, setInductores] = useState<Inductor[]>([]);

  // Recargar inductores para los selects
  const recargarInductores = async () => {
    setInductores(await getInductores());
  };
  useEffect(() => {
    recargarInductores();
  }, []);

  return (
    <div>
      <h2>Definición de entidades</h2>
      <DescargarPlantillaExcel />
      <CargarPlantillaExcel />
      <InductorCrud onChange={recargarInductores} />
      <RecursoCrud inductores={inductores} />
      <ActividadCrud inductores={inductores} />
      <ObjetoCrud />
    </div>
  );
}
