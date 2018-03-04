<?php
  require_once "vendor/autoload.php";

  $loader = new Twig_Loader_Filesystem('templates');
  $twig = new Twig_Environment($loader, array(
      //'cache' => './compilation_cache',
  ));

  echo $twig->render('showpage.twig', array());

?>
