
<?php
require_once '../config/db.php';

class AsistenciaModel {
  private $conn;

  public function __construct($conn) {
    $this->conn = $conn;
  }

  public function insertarAsistencia($id, $fecha, $entrada, $salida, $estado, $observacion, $diferencia) {
    $sql = "INSERT INTO asistencia (COD_Docente, Fecha, HoraEntrada, HoraSalida, EstadoAsistencia, Observaciones, Diferencia) 
            VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt = $this->conn->prepare($sql);
    $stmt->bind_param("sssssss", $id, $fecha, $entrada, $salida, $estado, $observacion, $diferencia);
    return $stmt->execute();
  }
}
?>