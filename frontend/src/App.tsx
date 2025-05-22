import { Routes, Route, useNavigate } from "react-router-dom";
import RecursoActividadPage from "./pages/RecursoActividadPage";
import ActividadObjetoPage from "./pages/ActividadObjetoPage";
import CostoUnitarioPage from "./pages/CostoUnitarioPage";
import { useState } from "react";

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

function App() {
  const navigate = useNavigate();
  const [anio, setAnio] = useState("2025");
  const [mes, setMes] = useState("01");
  const periodo = `${anio}-${mes}-01`;

  return (
    <div>
      <h1>Costeo ABC</h1>
      <label>
        Periodo:
        <select
          value={mes}
          onChange={e => setMes(e.target.value)}
          style={{ marginLeft: 8, marginRight: 8 }}
        >
          {meses.map(m => (
            <option key={m.valor} value={m.valor}>{m.nombre}</option>
          ))}
        </select>
        <input
          type="number"
          value={anio}
          min="2000"
          max="2100"
          onChange={e => setAnio(e.target.value)}
          style={{ width: 70, marginRight: 16 }}
        />
      </label>
      <button onClick={() => navigate("/recurso-actividad")}>Recurso x Actividad</button>
      <button onClick={() => navigate("/actividad-objeto")}>Actividad x Objeto</button>
      <button onClick={() => navigate("/costo-unitario")}>Costo Unitario</button>
      <Routes>
        <Route path="/recurso-actividad" element={<RecursoActividadPage periodo={periodo} autoFetch />} />
        <Route path="/actividad-objeto" element={<ActividadObjetoPage periodo={periodo} autoFetch />} />
        <Route path="/costo-unitario" element={<CostoUnitarioPage periodo={periodo} autoFetch />} />
        <Route path="*" element={<div>Selecciona una opción</div>} />
      </Routes>
    </div>
  );
}

export default App;