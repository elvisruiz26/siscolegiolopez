document.getElementById('exportPdfButton').addEventListener('click', function () {
  const resultTable = document.getElementById('result');

  if (!resultTable || resultTable.innerHTML.trim() === "") {
    alert("No hay datos para exportar. Procesa un archivo primero.");
    return;
  }

  const rows = resultTable.querySelectorAll('tr');
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF('l', 'mm', 'a4'); // 'l' es para orientación landscape (horizontal)

  let currentDocente = "";
  let currentRows = [];

  rows.forEach((row, index) => {
    // Saltar la fila de encabezado de la tabla
    if (index === 0) {
      return;
    }

    const nombreDocente = row.cells[0]?.textContent.trim();

    // Si cambiamos de docente o es el final de la tabla
    if (nombreDocente && nombreDocente !== currentDocente) {
      if (currentRows.length > 0) {
        agregarPaginaDocenteAPdf(currentRows, pdf);
        pdf.addPage();
        currentRows = [];
      }
      currentDocente = nombreDocente;
    }

    currentRows.push(row);

    if (index === rows.length - 1 && currentRows.length > 0) {
      agregarPaginaDocenteAPdf(currentRows, pdf);
    }
  });

  pdf.save('Datos_Docentes.pdf');
});

function agregarPaginaDocenteAPdf(rows, pdf) {
  let y = 20;

  // Nombre del docente y encabezado de la tabla
  const nombreDocente = rows[0].cells[0].textContent.trim();
  const idDocente = rows[0].cells[1].textContent.trim();

  pdf.setFontSize(16);
  pdf.text(`Docente: ${nombreDocente} (ID: ${idDocente})`, 10, y);
  y += 10;

  pdf.setFontSize(12);
  pdf.text("Fecha", 10, y);
  pdf.text("Turno", 40, y);
  pdf.text("Entrada", 80, y);
  pdf.text("Salida", 100, y);
  pdf.text("Tiempo Total", 120, y);
  pdf.text("Diferencia", 150, y);
  pdf.text("Estado", 180, y);
  pdf.text("Observación", 210, y);
  y += 10;

  // Agregar filas de la tabla con mayor espacio entre columnas
  rows.forEach((row) => {
    const fecha = row.cells[2]?.textContent.trim() || "";
    const turno = row.cells[3]?.textContent.trim() || "";
    const entrada = row.cells[4]?.textContent.trim() || "";
    const salida = row.cells[5]?.textContent.trim() || "";
    const tiempoTotal = row.cells[6]?.textContent.trim() || "";
    const diferencia = row.cells[7]?.textContent.trim() || "";
    const estado = row.cells[8]?.textContent.trim() || "";
    const observacion = row.cells[9]?.textContent.trim() || "";

    pdf.setFontSize(10);
    pdf.text(fecha, 10, y);
    pdf.text(turno, 40, y);
    pdf.text(entrada, 80, y);
    pdf.text(salida, 100, y);
    pdf.text(tiempoTotal, 120, y);
    pdf.text(diferencia, 150, y);
    pdf.text(estado, 180, y);
    pdf.text(observacion, 210, y);

    y += 10;

    // Si la posición actual se acerca al final de la página, agregar una nueva página
    if (y > 190) { // Ajustar límite para orientación horizontal
      pdf.addPage();
      y = 20;
    }
  });
}
