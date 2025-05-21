-- CENTROS DE COSTO
INSERT INTO centro (codigo, nombre) VALUES
('C001', 'Centro de Producción'),
('C002', 'Centro de Logística');

-- ACTIVIDADES
INSERT INTO actividad (codigo, nombre, cod_centro) VALUES
('A001', 'Corte de Material', 'C001'),
('A002', 'Empaque Final', 'C001'),
('A003', 'Distribución', 'C002');

-- INDUCTORES
INSERT INTO inductor (codigo, nombre) VALUES
('I001', 'Horas Máquina'),
('I002', 'Número de Unidades');

-- RECURSOS
INSERT INTO recurso (codigo, nombre, cod_prorrateo) VALUES
('R001', 'Energía Eléctrica', 'I001'),
('R002', 'Material de Empaque', 'I002');

-- RECURSOS POR PERÍODO
INSERT INTO recurso_periodo (cod_recurso, fecha_periodo, monto) VALUES
('R001', '2024-12-01', 2000.00),
('R002', '2024-12-01', 1500.00);

-- INDUCTOR EN CENTROS (Cantidad disponible por centro y período)
-- Inductor I001 usado en 1 centro para Producto A y en 2 centros para Producto B
INSERT INTO inductor_centro (cod_inductor, cod_centro, cantidad_inductor, fecha_periodo) VALUES

-- Para Producto B (dos centros)
('I001', 'C001', 70.00, '2024-12-01'),
('I001', 'C002', 30.00, '2024-12-01'),

('I002', 'C002', 500.00, '2024-12-01'); -- No cambia para I002

-- PORCENTAJE DEL INDUCTOR UTILIZADO EN CADA ACTIVIDAD
-- Añadí actividad A003 para el centro C002
INSERT INTO inductor_actividad (cod_actividad, cod_inductor, porcentaje, fecha_periodo) VALUES
('A001', 'I001', 100.00, '2024-12-01'), -- Corte de Material usa I001 en C001 para Producto A
('A002', 'I001', 60.00, '2024-12-01'),  -- Empaque Final usa I001 parcialmente (porcentaje puede ser menos de 100)
('A003', 'I001', 40.00, '2024-12-01'),  -- Distribución usa I001 en otro centro
('A002', 'I002', 100.00, '2024-12-01');

-- OBJETOS DE COSTO
INSERT INTO objeto (codigo, nombre) VALUES
('O001', 'Producto A'),
('O002', 'Producto B');

-- OBJETOS DE COSTO POR PERÍODO (cantidad producida)
INSERT INTO objeto_periodo (cod_objeto, fecha_periodo, cantidad) VALUES
('O001', '2024-12-01', 200),
('O002', '2024-12-01', 300);

-- DISTRIBUCIÓN DE ACTIVIDADES A OBJETOS
INSERT INTO actividad_objeto (cod_actividad, cod_objeto, porcentaje, fecha_periodo) VALUES
-- Producto A solo usa el inductor I001 en 1 centro (actividad A001)
('A001', 'O001', 100.00, '2024-12-01'),

-- Producto B usa actividades en 2 centros (A002 y A003)
('A002', 'O002', 60.00, '2024-12-01'),
('A003', 'O002', 40.00, '2024-12-01');
