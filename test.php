<!DOCTYPE HTML>
<html>
<head>
    <style>
        body {
            margin: 0px;
            padding: 0px;
        }
    </style>
</head>
<body>
<canvas id="myCanvas" width="778" height="600"></canvas>
<script>
    var canvas = document.getElementById('myCanvas');
    var ctx= canvas.getContext('2d');


    var cx = 150;
    var cy  =150;

    // in case you like using degrees
    function toRadians(deg) {
        return deg * Math.PI / 180
    }




    ctx.fillStyle = 'lightblue';

    ctx.beginPath();
    ctx.moveTo(cx,cy);
    ctx.arc(cx,cy,100,toRadians(180),toRadians(210));
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(cx,cy);
    ctx.arc(cx,cy,100,toRadians(215),toRadians(325));
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(cx,cy);
    ctx.arc(cx,cy,100,toRadians(330),toRadians(360));
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'white';


    ctx.beginPath();
    ctx.moveTo(cx,cy);
    ctx.arc(cx,cy,50,toRadians(180),toRadians(360));
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'black';
    ctx.font="20px Georgia";

    ctx.fillText('M',cx-80,cy-10);
    ctx.fillText('W',cx-10,cy-70);
    ctx.fillText('D',cx+70,cy-10);
</script>
</body>
</html>