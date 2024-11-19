<?php 
class Asistencias extends Controllers{	
	public function __construct()
	{
		parent::__construct();
		session_start();
		if(empty($_SESSION['login']))
		{
			header('Location: '.base_url().'/login');
			die();
		}
		getPermisos(MPEDIDOS);
	}

	public function Asistencias()
	{
		if(empty($_SESSION['permisosMod']['r'])){
			header("Location:".base_url().'/dashboard');
		}
		$data['page_tag'] = "Asistencia";
		$data['page_title'] = "Asistencia <small>I.E Lopez Albujar</small>";
		$data['page_name'] = "Asistencias";
		$data['page_functions_js'] = "functions_asistencias.js";
		$this->views->getView($this,"Asistencias",$data);
	}

	
}
 ?>