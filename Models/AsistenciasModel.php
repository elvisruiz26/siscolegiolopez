<?php
class AsistenciasModel extends Mysql
{
    private $intIdAsistencias;
    private $strNombre;
    private $strApellido;
    private $intCodDocente;
    private $intFecha;
    private $intHoraEntrada;
    private $intHoraSalida;
    private $strEstadoAsistencia;
    private $strObservaciones;

    public function __construct()
    {
        parent::__construct();
    }

    public function insertarAsistencia($id, $fecha, $entrada, $salida, $estado, $observacion, $diferencia) {
        // Fetch idpersona from persona table using COD_Docente
        $sqlPersona = "SELECT idpersona FROM persona WHERE codigoasistencia = ?";
        $stmtPersona = $this->conexion->prepare($sqlPersona);
        $stmtPersona->execute([$id]);
        $idpersona = $stmtPersona->fetchColumn();

        // Insert into asistencia table including idpersona
        $sql = "INSERT INTO asistencia (COD_Docente, Fecha, HoraEntrada, HoraSalida, EstadoAsistencia, Observaciones, Diferencia, idpersona) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->conexion->prepare($sql);
        return $stmt->execute([$id, $fecha, $entrada, $salida, $estado, $observacion, $diferencia, $idpersona]);
    }

    public function selectAsistencia($idpersona = null){
        $where = "";
        if($idpersona != null){
            $where = " WHERE p.personaid = ".$idpersona;
        }
        $sql = "SELECT p.idpedido,
                        p.referenciacobro,
                        p.idtransaccionpaypal,
                        DATE_FORMAT(p.fecha, '%d/%m/%Y') as fecha,
                        p.monto,
                        tp.tipopago,
                        tp.idtipopago,
                        p.status 
                FROM pedido p 
                INNER JOIN tipopago tp
                ON p.tipopagoid = tp.idtipopago $where ";
        $request = $this->select_all($sql);
        return $request;

    }

    public function selectAsistencias(){
        $sql = "SELECT a.ID_Asistencias,
                        p.nombre as nombre,
                        p.apellidos as apellidos,
                        a.COD_Docente,
                        a.Fecha,
                        a.HoraEntrada,
                        a.HoraSalida,
                        a.Observaciones
                FROM asistencia a 
                INNER JOIN persona p
                ON a.COD_Docente = p.codigoasistencia";
                $request = $this->select_all($sql);
        return $request;
    }	

    public function updateProducto(int $idproducto, string $nombre, string $descripcion, int $codigo, int $categoriaid, string $precio, int $stock, string $ruta, int $status){
        $this->intIdProducto = $idproducto;
        $this->strNombre = $nombre;
        $this->strDescripcion = $descripcion;
        $this->intCodigo = $codigo;
        $this->intCategoriaId = $categoriaid;
        $this->strPrecio = $precio;
        $this->intStock = $stock;
        $this->strRuta = $ruta;
        $this->intStatus = $status;
        $return = 0;
        $sql = "SELECT * FROM producto WHERE codigo = '{$this->intCodigo}' AND idproducto != $this->intIdProducto ";
        $request = $this->select_all($sql);
        if(empty($request))
        {
            $sql = "UPDATE producto 
                    SET categoriaid=?,
                        codigo=?,
                        nombre=?,
                        descripcion=?,
                        precio=?,
                        stock=?,
                        ruta=?,
                        status=? 
                    WHERE idproducto = $this->intIdProducto ";
            $arrData = array($this->intCategoriaId,
                            $this->intCodigo,
                            $this->strNombre,
                            $this->strDescripcion,
                            $this->strPrecio,
                            $this->intStock,
                            $this->strRuta,
                            $this->intStatus);

            $request = $this->update($sql,$arrData);
            $return = $request;
        }else{
            $return = "exist";
        }
        return $return;
    }

    public function selectProducto(int $idproducto){
        $this->intIdProducto = $idproducto;
        $sql = "SELECT a.idproducto,
                        a.codigo,
                        a.nombre,
                        a.descripcion,
                        a.precio,
                        a.stock,
                        a.categoriaid,
                        c.nombre as categoria,
                        a.status
                FROM producto p
                INNER JOIN categoria c
                ON a.categoriaid = c.idcategoria
                WHERE idproducto = $this->intIdProducto";
        $request = $this->select($sql);
        return $request;

    }

    public function insertImage(int $idproducto, string $imagen){
        $this->intIdProducto = $idproducto;
        $this->strImagen = $imagen;
        $query_insert  = "INSERT INTO imagen(productoid,img) VALUES(?,?)";
        $arrData = array($this->intIdProducto,
                        $this->strImagen);
        $request_insert = $this->insert($query_insert,$arrData);
        return $request_insert;
    }

    public function selectImages(int $idproducto){
        $this->intIdProducto = $idproducto;
        $sql = "SELECT productoid,img
                FROM imagen
                WHERE productoid = $this->intIdProducto";
        $request = $this->select_all($sql);
        return $request;
    }

    public function deleteImage(int $idproducto, string $imagen){
        $this->intIdProducto = $idproducto;
        $this->strImagen = $imagen;
        $query  = "DELETE FROM imagen 
                    WHERE productoid = $this->intIdProducto 
                    AND img = '{$this->strImagen}'";
        $request_delete = $this->delete($query);
        return $request_delete;
    }

    public function deleteProducto(int $idproducto){
        $this->intIdProducto = $idproducto;
        $sql = "UPDATE producto SET status = ? WHERE idproducto = $this->intIdProducto ";
        $arrData = array(0);
        $request = $this->update($sql,$arrData);
        return $request;
    }
}
?>
