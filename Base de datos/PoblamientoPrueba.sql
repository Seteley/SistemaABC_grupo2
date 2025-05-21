-- Tabla recursos
INSERT INTO recursos (codigo, nombre, monto) VALUES
('R001', 'Energía eléctrica', 5000.00),
('R002', 'Mano de obra indirecta', 8000.00),
('R003', 'Mantenimiento equipos', 3000.00);

-- Tabla centros_actividad
INSERT INTO centros_actividad (nombre_centro) VALUES
('Producción'),
('Mantenimiento'),
('Administración');

-- Tabla actividades
INSERT INTO actividades (nombre_actividad, id_centro) VALUES
('Corte de materiales', 1),
('Montaje', 1),
('Revisión de equipos', 2),
('Supervisión', 3);

-- Tabla objetos_costo
INSERT INTO objetos_costo (codigo, nombre_objeto, cantidad) VALUES
('P001', 'Producto A', 100),
('P002', 'Producto B', 150);

-- Tabla inductores
INSERT INTO inductores (nombre_inductor) VALUES
('Horas máquina'),
('Número de inspecciones'),
('Horas hombre');

-- Tabla recurso_centro
INSERT INTO recurso_centro (id_recurso, id_centro, monto_asignado, fecha_periodo) VALUES
(1, 1, 3000.00, '2025-05-01'),
(1, 2, 2000.00, '2025-05-01'),
(2, 1, 4000.00, '2025-05-01'),
(2, 3, 4000.00, '2025-05-01'),
(3, 2, 3000.00, '2025-05-01');

-- Tabla actividad_inductor
INSERT INTO actividad_inductor (id_actividad, id_inductor, cantidad_usada, fecha_periodo) VALUES
(1, 1, 100.0, '2025-05-01'),
(2, 1, 150.0, '2025-05-01'),
(3, 2, 80.0, '2025-05-01'),
(4, 3, 120.0, '2025-05-01');

-- Tabla actividad_objeto
INSERT INTO actividad_objeto (id_actividad, id_objeto, monto_asignado, fecha_periodo) VALUES
(1, 1, 2000.00, '2025-05-01'),
(1, 2, 1000.00, '2025-05-01'),
(2, 1, 2500.00, '2025-05-01'),
(2, 2, 1500.00, '2025-05-01'),
(3, 1, 1000.00, '2025-05-01'),
(3, 2, 1000.00, '2025-05-01'),
(4, 1, 500.00, '2025-05-01'),
(4, 2, 500.00, '2025-05-01');
