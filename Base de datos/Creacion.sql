-- Tabla de recursos
CREATE TABLE recursos (
    id_recurso SERIAL PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    monto NUMERIC(14,2) NOT NULL
);

-- Tabla de centros de actividad
CREATE TABLE centros_actividad (
    id_centro SERIAL PRIMARY KEY,
    nombre_centro VARCHAR(100) NOT NULL
);

-- Tabla de actividades
CREATE TABLE actividades (
    id_actividad SERIAL PRIMARY KEY,
    nombre_actividad VARCHAR(100) NOT NULL,
    id_centro INT NOT NULL REFERENCES centros_actividad(id_centro)
);

-- Tabla de objetos de costo
CREATE TABLE objetos_costo (
    id_objeto SERIAL PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL,
    nombre_objeto VARCHAR(100) NOT NULL,
    cantidad INT NOT NULL
);

-- Tabla de inductores
CREATE TABLE inductores (
    id_inductor SERIAL PRIMARY KEY,
    nombre_inductor VARCHAR(100) NOT NULL
);

-- Asignación de recursos a centros de actividad
CREATE TABLE recurso_centro (
    id_recurso INT NOT NULL REFERENCES recursos(id_recurso),
    id_centro INT NOT NULL REFERENCES centros_actividad(id_centro),
    monto_asignado NUMERIC(14,2) NOT NULL,
    fecha_periodo DATE NOT NULL,
    PRIMARY KEY (id_recurso, id_centro, fecha_periodo)
);

-- Asignación de inductores a actividades
CREATE TABLE actividad_inductor (
    id_actividad INT NOT NULL REFERENCES actividades(id_actividad),
    id_inductor INT NOT NULL REFERENCES inductores(id_inductor),
    cantidad_usada NUMERIC(14,2) NOT NULL,
    fecha_periodo DATE NOT NULL,
    PRIMARY KEY (id_actividad, id_inductor, fecha_periodo)
);

-- Asignación de actividades a objetos de costo
CREATE TABLE actividad_objeto (
    id_actividad INT NOT NULL REFERENCES actividades(id_actividad),
    id_objeto INT NOT NULL REFERENCES objetos_costo(id_objeto),
    monto_asignado NUMERIC(14,2) NOT NULL,
    fecha_periodo DATE NOT NULL,
    PRIMARY KEY (id_actividad, id_objeto, fecha_periodo)
);
