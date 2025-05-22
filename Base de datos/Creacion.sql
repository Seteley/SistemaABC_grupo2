DROP TABLE IF EXISTS actividad_objeto      CASCADE;
DROP TABLE IF EXISTS objeto_periodo        CASCADE;
DROP TABLE IF EXISTS objeto                CASCADE;
DROP TABLE IF EXISTS recurso_periodo       CASCADE;
DROP TABLE IF EXISTS recurso               CASCADE;
DROP TABLE IF EXISTS actividad             CASCADE;
DROP TABLE IF EXISTS inductor              CASCADE;
DROP TABLE IF EXISTS centro                CASCADE;

-- Tabla de centros
CREATE TABLE centro (
    codigo VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

-- Actividades (ahora con cod_inductor)
CREATE TABLE actividad (
    codigo VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    cod_centro VARCHAR(50) NOT NULL REFERENCES centro(codigo),
    cod_inductor VARCHAR(50) NOT NULL REFERENCES inductor(codigo)
);

-- Inductores
CREATE TABLE inductor (
    codigo VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

-- Recursos (definición base)
CREATE TABLE recurso (
    codigo VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    cod_prorrateo VARCHAR(50) NOT NULL REFERENCES inductor(codigo)
);


-- Relación de recursos consumidos por cada actividad
CREATE TABLE actividad_recurso (
    cod_actividad VARCHAR(50) NOT NULL REFERENCES actividad(codigo),
    cod_recurso VARCHAR(50) NOT NULL REFERENCES recurso(codigo),
    cantidad NUMERIC(14,2) NOT NULL, -- cantidad consumida del recurso por la actividad
    fecha_periodo DATE NOT NULL,
    PRIMARY KEY (cod_actividad, cod_recurso, fecha_periodo)
);

-- Objetos de costo (definición base)
CREATE TABLE objeto (
    codigo VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

-- Relación de actividades que componen cada objeto de costo
CREATE TABLE objeto_actividad (
    cod_objeto VARCHAR(50) NOT NULL REFERENCES objeto(codigo),
    cod_actividad VARCHAR(50) NOT NULL REFERENCES actividad(codigo),
    cantidad NUMERIC(14,2) NOT NULL, -- cantidad de la actividad asignada al objeto
    fecha_periodo DATE NOT NULL,
    PRIMARY KEY (cod_objeto, cod_actividad, fecha_periodo)
);



-- Cantidad de objetos de costo por período
CREATE TABLE objeto_periodo (
    cod_objeto VARCHAR(50) NOT NULL REFERENCES objeto(codigo),
    fecha_periodo DATE NOT NULL,
    cantidad INT NOT NULL,
    PRIMARY KEY (cod_objeto, fecha_periodo)
);

CREATE TABLE recurso_periodo (
    cod_recurso VARCHAR(50) NOT NULL REFERENCES recurso(codigo),
    fecha_periodo DATE NOT NULL,
    monto NUMERIC(14,2) NOT NULL,
    PRIMARY KEY (cod_recurso, fecha_periodo)
);
