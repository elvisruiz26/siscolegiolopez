ALTER TABLE contacto 
ADD COLUMN usuario_id INT NOT NULL,
ADD COLUMN archivo VARCHAR(255) NULL,
ADD COLUMN nombre_archivo VARCHAR(255) NULL;

ALTER TABLE contacto 
DROP COLUMN archivo_contenido;

-- Si deseas crear la relación con la tabla de usuarios
-- ALTER TABLE contacto ADD FOREIGN KEY (usuario_id) REFERENCES usuarios(id);