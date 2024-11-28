// Función para exportar los datos a un archivo Excel
function exportarExcel(docentes) {
    const wb = XLSX.utils.book_new(); // Crear un nuevo libro de trabajo
  
    for (const [nombre, info] of Object.entries(docentes)) {
      // Preparamos los datos para la hoja del docente
      const datosTabla = info.fechas.map(fechaInfo => ({
        Fecha: fechaInfo.fecha,
        Turno: fechaInfo.turno,
        Entrada: fechaInfo.entrada,
        Salida: fechaInfo.salida,
        "Tiempo Total": fechaInfo.tiempoTotal,
        Diferencia: fechaInfo.diferencia,
        Estado: fechaInfo.estado,
        Observación: fechaInfo.observacion
      }));
  
      // Convertir los datos a una hoja de Excel
      const hoja = XLSX.utils.json_to_sheet(datosTabla);
  
      // Crear un encabezado personalizado para la hoja del docente
      const encabezado = [
        "Fecha", "Turno", "Entrada", "Salida", "Tiempo Total", "Diferencia", "Estado", "Observación"
      ];
  
      // Agregar el encabezado en la parte superior de la hoja
      XLSX.utils.sheet_add_aoa(hoja, [encabezado], { origin: "A1" });
  
      // Agregar la hoja al libro de trabajo
      XLSX.utils.book_append_sheet(wb, hoja, nombre); // Usamos el nombre del docente como nombre de la hoja
    }
  
    // Descargar el archivo Excel con todos los docentes
    XLSX.writeFile(wb, 'Datos_Docentes.xlsx');
  }
  
  
  // Evento para el botón "Exportar a Excel" que solo se activa si hay datos procesados
  document.getElementById('exportButton').addEventListener('click', function() {
    if (docentesData) {
      exportarExcel(docentesData); // Exportar a Excel solo si hay datos procesados
    } else {
      alert("Por favor, procesa el archivo antes de exportar.");
    }
  });
  