<!doctype html>
<html lang="">
  <head>
    <meta charset="utf-8">
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>test2 gulp</title>

    <link rel="stylesheet" href="libs/mainLibs.css">
    <link rel="stylesheet" href="styles/styles.css">
    
  </head>
  <body>


<?php
function fibonacii($n)
{
if($n == 0)
    return 0;
else if($n == 1)
  return 1;
else
{
	return (fibonacii($n-1) + fibonacii($n-2));
}
}

for ($i=0; $i<30; $i++)
	print fibonacii($i).'<br />';

phpinfo();
?>

</body>
</html>