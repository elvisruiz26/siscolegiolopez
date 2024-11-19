
function openModal()
{
    rowTable = "";
    document.querySelector('#idAsistencias').value ="";
    document.querySelector('.modal-header').classList.replace("headerUpdate", "headerRegister");
    document.querySelector('#btnActionForm').classList.replace("btn-info", "btn-primary");
    document.querySelector('#btnText').innerHTML ="Guardar";
    document.querySelector('#titleModal').innerHTML = "Cargar Asistencias Docentes";
    document.querySelector("#formAsistencias").reset();
    $('#modalFormAsistencia ').modal('show');
}