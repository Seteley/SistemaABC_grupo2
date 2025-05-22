-- Poblamiento de prueba para enero 2025
-- CENTROS
INSERT INTO centro (codigo, nombre) VALUES
('C001', 'Producción'),
('C002', 'Calidad'),
('C003', 'Almacén');

-- ACTIVIDADES (ahora con cod_inductor)
INSERT INTO actividad (codigo, nombre, cod_centro, cod_inductor) VALUES
('A001', 'Preparación de Maquinaria', 'C001', 'I001'),
('A002', 'Inspección de Calidad', 'C002', 'I002'),
('A003', 'Almacenamiento', 'C003', 'I003');

-- INDUCTORES
INSERT INTO inductor (codigo, nombre) VALUES
('I001', 'Número de Setups'),
('I002', 'Número de Inspecciones'),
('I003', 'Metros Cuadrados Ocupados');

-- RECURSOS
INSERT INTO recurso (codigo, nombre, cod_prorrateo) VALUES
('R001', 'Maquinaria', 'I001'),
('R002', 'Mano de Obra Inspectores', 'I002'),
('R003', 'Espacio', 'I003');

-- RECURSOS POR PERÍODO
INSERT INTO recurso_periodo (cod_recurso, fecha_periodo, monto) VALUES
('R001', '2025-01-01', 10000.00),
('R002', '2025-01-01', 6000.00),
('R003', '2025-01-01', 3000.00);

-- ACTIVIDAD_RECURSO (cantidad de recurso consumido por actividad)
INSERT INTO actividad_recurso (cod_actividad, cod_recurso, cantidad, fecha_periodo) VALUES
('A001', 'R001', 10000, '2025-01-01'),
('A002', 'R002', 6000, '2025-01-01'),
('A003', 'R003', 3000, '2025-01-01');

-- OBJETOS DE COSTO
INSERT INTO objeto (codigo, nombre) VALUES
('O001', 'Celulares'),
('O002', 'Computadoras');

-- OBJETO_PERIODO (cantidad producida)
INSERT INTO objeto_periodo (cod_objeto, fecha_periodo, cantidad) VALUES
('O001', '2025-01-01', 500),
('O002', '2025-01-01', 300);

-- OBJETO_ACTIVIDAD (cantidad de actividad asignada a cada objeto)
INSERT INTO objeto_actividad (cod_objeto, cod_actividad, cantidad, fecha_periodo) VALUES
('O001', 'A001', 30, '2025-01-01'),
('O002', 'A001', 20, '2025-01-01'),
('O001', 'A002', 70, '2025-01-01'),
('O002', 'A002', 50, '2025-01-01'),
('O001', 'A003', 120, '2025-01-01'),
('O002', 'A003', 80, '2025-01-01');
