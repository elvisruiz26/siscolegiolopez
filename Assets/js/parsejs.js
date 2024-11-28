let docentesData = null; // Variable global para almacenar los datos procesados

// Función para procesar el archivo CSV
function procesarArchivo() {
  const input = document.getElementById('csvFile');
  if (input.files.length === 0) {
    alert("Por favor, selecciona un archivo CSV.");
    return;
  }

  const reader = new FileReader();

  reader.onload = function(event) {
    const text = event.target.result;
    const data = parseCSV(text);
    if (data && Object.keys(data).length > 0) { // Verifica si data no es null y tiene contenido
      docentesData = data; // Guarda los datos procesados en la variable global
      mostrarDatos(data); // Muestra los datos procesados en la tabla
    } else {
      alert("No se encontraron datos válidos en el archivo.");
    }
  };

  reader.readAsText(input.files[0]);
}

// Función para analizar el contenido CSV y transformarlo en un objeto de datos
function parseCSV(text) {
  const lines = text.split('\n');
  const docentes = {};
  let currentDocente = null;
  let currentID = null;

  lines.forEach(line => {
    const columns = line.split(';');

    if (columns[0].startsWith('Nombre')) {
      currentDocente = columns[3].trim();
      currentID = "";
      docentes[currentDocente] = { id: currentID, fechas: [] };
    } else if (currentDocente && columns[0] && columns[0] !== 'ID') {
      const id = columns[0].trim();
      const date = formatDate(columns[2].trim());
      const turno = columns[3].trim();
      const entry = columns[4].trim() || "";
      const exit = columns[5].trim() || "";

      if (date && turno) {
        if (!docentes[currentDocente].id) {
          docentes[currentDocente].id = id;
        }

        // Extraer horas de turno, entrada y salida
        const turnoHoras = turno.match(/\((\d{2}:\d{2})-(\d{2}:\d{2})\)/);
        const turnoInicio = turnoHoras ? turnoHoras[1] : null;
        const turnoFin = turnoHoras ? turnoHoras[2] : null;

        // Calcular el tiempo total de instancia y diferencia
        const totalTiempo = calcularTiempo(entry, exit);
        const turnoTiempo = calcularTiempo(turnoInicio, turnoFin);
        const diferenciaTiempo = totalTiempo && turnoTiempo ? totalTiempo - turnoTiempo : null;

        // Determinar el estado de asistencia
        let estado;
        if (!entry && !exit) {
          estado = 'Faltó';
        } else if (!entry || !exit) {
          estado = 'Observado';
        } else if (diferenciaTiempo < 0) {
          estado = 'Tardanza';
        } else {
          estado = 'Asistió';
        }

        let observacion = "";
          if (estado === 'Faltó') {
            observacion = "No marcó entrada, ni salida";
          } else if (estado === 'Observado') {
            if (!entry) {
              observacion = "No marcó entrada";
            } else if (!exit) {
              observacion = "No marcó salida";
            }
          }

        docentes[currentDocente].fechas.push({
          fecha: date,
          turno: turno,
          entrada: entry,
          salida: exit,
          tiempoTotal: totalTiempo ? formatoHoras(totalTiempo) : '',
          diferencia: diferenciaTiempo ? formatoHoras(diferenciaTiempo) : '',
          estado: estado,
          observacion: observacion
        });
      }
    }
  });

  return docentes || {};
}

// Función para formatear la fecha en "YYYY-MM-DD"
function formatDate(dateStr) {
  const [day, month, year] = dateStr.split('/');
  return `${year}-${month}-${day}`;
}

// Función para calcular minutos entre dos tiempos (HH:MM)
function calcularTiempo(inicio, fin) {
  if (!inicio || !fin) return null;
  const [horaInicio, minutoInicio] = inicio.split(':').map(Number);
  const [horaFin, minutoFin] = fin.split(':').map(Number);
  const totalMinutosInicio = horaInicio * 60 + minutoInicio;
  const totalMinutosFin = horaFin * 60 + minutoFin;
  return totalMinutosFin - totalMinutosInicio;
}

// Formato de horas en "HH:MM:SS"
function formatoHoras(minutos) {
  const horas = Math.floor(Math.abs(minutos) / 60);
  const mins = Math.abs(minutos) % 60;
  const segs = 0; // Asumiendo que no tienes segundos en tus datos
  const signo = minutos < 0 ? '-' : '';
  return `${signo}${horas.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
}

// Función para mostrar los datos procesados en la tabla
function mostrarDatos(docentes) {
  if (!docentes || Object.keys(docentes).length === 0) {
    console.warn("No hay datos para mostrar.");
    return;
  }

  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = "<tr><th>Docente</th><th>ID</th><th>Fecha</th><th>Turno</th><th>Entrada</th><th>Salida</th><th>Tiempo Total</th><th>Diferencia</th><th>Estado</th><th>Observación</th></tr>";

  for (const [nombre, info] of Object.entries(docentes)) {
    info.fechas.forEach(fechaInfo => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${nombre}</td>
        <td>${info.id}</td>
        <td>${fechaInfo.fecha}</td>
        <td>${fechaInfo.turno}</td>
        <td>${fechaInfo.entrada}</td>
        <td>${fechaInfo.salida}</td>
        <td>${fechaInfo.tiempoTotal}</td>
        <td>${fechaInfo.diferencia}</td>
        <td>${fechaInfo.estado}</td>
        <td>${fechaInfo.observacion}</td>
      `;
      resultDiv.appendChild(row);
    });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('uploadButton').addEventListener('click', subirDatos);
});

function subirDatos() {
  if (!docentesData || Object.keys(docentesData).length === 0) {
    alert("No hay datos para subir.");
    return;
  }

  const stateMapping = JSON.parse(document.getElementById('stateMapping').value);
  const docenteID = document.getElementById('docenteID').value; // Add this line

  fetch(base_url + '/Asistencias/subirDatos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ docentesData, stateMapping, docenteID }) // Add docenteID to the request body
  })
  .then(response => response.text())
  .then(text => {
    console.log('Response text:', text); // Log the response text for debugging
    try {
      const data = JSON.parse(text);
      if (data.success) {
        alert("Datos subidos exitosamente.");
      } else {
        alert("Error al subir los datos: " + data.error);
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
      alert("Error al subir los datos.");
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert("Error al subir los datos.");
  });
}