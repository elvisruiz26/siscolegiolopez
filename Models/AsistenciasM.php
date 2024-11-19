<?php
class AsistenciaModel {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function registrarAsistencias($asistencias) {
        foreach ($asistencias as $asistencia) {
            $id = $this->conn->real_escape_string($asistencia['id']);
            $fecha = $this->conn->real_escape_string($asistencia['fecha']);
            $entrada = $this->conn->real_escape_string($asistencia['entrada']);
            $salida = $this->conn->real_escape_string($asistencia['salida']);
            $estado = $this->conn->real_escape_string($asistencia['estado']);
            
            $sql = "INSERT INTO asistencia (COD_Docente, Fecha, HoraEntrada, HoraSalida, ID_EstadoAsistencia)
                    VALUES ('$id', '$fecha', '$entrada', '$salida', '$estado')";

            if (!$this->conn->query($sql)) {
                return false;
            }
        }
        return true;
    }
}
?>
