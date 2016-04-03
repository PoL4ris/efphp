<?php $u->loginSecurity();?>
<!doctype html>
	<html lang="es">
	<head>
		<meta charset="utf-8">
		<title>:: EPHP ADMIN ::</title>
		<meta name="description" content="EPHP">
		<meta name="author" content="Pedro Laris">
		<link rel="stylesheet" href="../css/reset.css">
		<link rel="stylesheet" href="../css/style_admin.css?v=1.0">
        <link rel="stylesheet" href="../css/data_table.css?v=1.0">
        <link rel="stylesheet" href="../css/jquery-ui.css?v=1.0">
	</head>
	<body>
		<?php

			$a = new Administrador();
			$a->controles();
			$title = $a->menu();
            $msj = new Messages();
            echo $msj->parseMessage($msj->getMessage());
            $msj->initMessages();
            if(!$a->renderAdmin($title))
                include("vistas/" . $u->incluirSeccionAdmin($cuerpo));
		?>

		<div id="disclaimer"><?php echo date("Y") . " - ";?> Powered by efphp</div>
        <script src="../js/jquery.js"></script>
        <script src="../js/jquery-ui.min.js"></script>
        <script src="../js/jquery.ajaxData.js"></script>
        <script src="../js/jquery.dataTables.min.js"></script>
        <script src="../js/lib.js"></script>
        <script src="../js/init.js"></script>
        <script src="../js/vistas_admin.js"></script>
	</body>
</html>