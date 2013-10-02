<!doctype html>
<html lang="en">
<head>
    <title>Daniels App</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />

    <script src="js/jquery-2.0.3.min.js"></script>
    <script src="http://code.jquery.com/ui/1.10.3/jquery-ui.js"></script>
    <link rel="stylesheet" href="http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css" />
    <script src="js/quo.js"></script>
    <script src="js/New.js"></script>
    <script src="js/Project.js"></script>
    <script src="js/Team.js"></script>
    <script src="js/Analytics.js"></script>
    <script src="js/Global.js"></script>

    <script src="js/jquery.ui.touch-punch.js"></script>

    <link rel="stylesheet" type="text/css" href="Global.css">
    <link rel="stylesheet" type="text/css" href="New.css">


    <script>

        var AppView = 'Projects';
        Time = new Date();
        var CurrentMonth = Time.getMonth()-1;
        var WeekDays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        var Months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

        var Today = '<div class="Day">'+Time.getDate()+'</div><div class="Weekday">'+WeekDays[Time.getDay()]+'</div><div class="MonthYear">'+Months[Time.getMonth()]+', '+Time.getFullYear()+'</div>'


        $(document).ready(function(){


            $('#NavCont').find('.Date').html(Today);
            $('#NavCont').find('.Menu').children('div[data-type="'+AppView+'"]').children('div').css('color','rgba(126,206,253,1)');

            $('#NavCont').find('.Menu').find('.Element').click(function(){

                $('#NavCont').find('.Menu').children('div').children('div').css('color','white');


                $('#NavCont').find('.Menu').children('div[data-type="New"]').find('img').attr('src','img/icons/nav-new0.svg');
                $('#NavCont').find('.Menu').children('div[data-type="Projects"]').find('img').attr('src','img/icons/nav-projects0.svg');
                $('#NavCont').find('.Menu').children('div[data-type="Team"]').find('img').attr('src','img/icons/nav-people0.svg');
                $('#NavCont').find('.Menu').children('div[data-type="Analytics"]').find('img').attr('src','img/icons/nav-analytics0.svg');

                var src =  $(this).find('img').attr('src');
                src = src.substr(0,src.length-5);
                $(this).find('img').attr('src',src+'1.svg');
                $(this).find('div').css('color','rgba(126,206,253,1)');

                var img = new Image();
                img.src = 'img/icons/nav-analytics0.svg';
                AppView = $(this).attr('data-type');
                img.onload = function(){


                    LoadAppView();

                };

            })

            $('.ZoomButton').find('div').click(function(e){


                var Type = $(this).attr('data-type');
                View = Type;

                if (AppView == 'Team')
                {
                   LoadTeamView();
                }
                else if (AppView == 'Projects')
                {
                    LoadProjectView();
                }
            });


           $$('body').pinchIn(function(e){

                console.log(e);
                //alert('pinchout')
                ChangeZoom('-')

            });

            $$('body').pinchOut(function(){

                //alert('pinchin')
                ChangeZoom('+')

            });


            // ZOOM SWITCHER
            /*$$('.OuterCircle, .InnerCircle').rotateLeft(function(){

                ChangeZoom('-');
             })

             $$('.OuterCircle, .InnerCircle').rotateRight(function(){

                ChangeZoom('+');
             })*/

            $('.OuterCircle').click(function(e){
                console.log(e.pageX);
                var OffX = $(this).offset().left;
                var Width =  parseInt($(this).css('width'));

                if(e.pageX  < OffX + Width/2)
                {
                    ChangeZoom('+');
                }
                else
                {
                    ChangeZoom('-');
                }

            });

            LoadAppView();
        })

        function LoadAppView ()
        {
            $.ajax({
                type: "POST",
                url: AppView+".php",
                data: {AppView:AppView},
                success: function(data){

                    console.log('LOADED APPVIEW: '+AppView);
                    $('#AppViewCont').html(data);

                    if (AppView == 'Projects')
                    {
                        initProjects(); // CREATE EVENTS
                        LoadProjectView();
                    }

                    if (AppView == 'New')
                    {
                        initNew(); // CREATE EVENTS
                        // INIT AUTO SEARCH TO DISPLAY ALL RES
                        LoadNewView();
                    }

                    if (AppView == 'Team')
                    {
                        initTeam(); // CREATE EVENTS
                        LoadTeamView();
                    }

                    if (AppView == 'Analytics')
                    {

                        LoadAnalyticsView();
                    }

                }
            });
        }


    function ChangeZoom (Zoom)
    {
        if (Zoom == '+')
        {
            console.log('left')
            ZoomRotator += 60;
            $('.OuterCircle').css('-webkit-transform','rotate('+ZoomRotator+'deg)');

            ViewMarker--;
            if (ViewMarker < 0)
            {
                ViewMarker = 0;
            }
            View = Views[ViewMarker];

            if (AppView == 'Team')
            {
                LoadTeamView();
            }
            if (AppView == 'Projects')
            {
                LoadProjectView();
            }
        }
        else
        {
            console.log('right')
            ZoomRotator -= 60;
            $('.OuterCircle').css('-webkit-transform','rotate('+ZoomRotator+'deg)');

            ViewMarker++;
            if (ViewMarker >= Views.length)
            {
                ViewMarker = 2;
            }
            View = Views[ViewMarker];

            if (AppView == 'Team')
            {
                LoadTeamView();
            }
            if (AppView == 'Projects')
            {
                LoadProjectView();
            }
        }
    }

    </script>

</head>


<body>


<div id="NavCont">

    <div class="Date"></div>

    <div class="Menu">

        <div data-type="New" class="Element">
            <img src="img/icons/nav-new0.svg">
            <div>NEW</div>
        </div>

        <div data-type="Projects" class="Element">
            <img src="img/icons/nav-projects0.svg">
            <div>PROJECTS</div>
        </div>

        <div data-type="Team" class="Element">
            <img src="img/icons/nav-people1.svg">
            <div>TEAM</div>
        </div>

        <div data-type="Analytics" class="Element">
            <img src="img/icons/nav-analytics0.svg">
            <div>ANALYTICS</div>
        </div>

    </div>

    <div class="User">

        <div class="Title">Design & Co-Innovation Center</div>
        <div class="Location">North America</div>
        <img src="img/team/kumar-janaki.png">

    </div>
</div>

<div id="AppViewCont"></div>

<div id="ZoomCont">
    <img class="OuterCircle" src="img/icons/circle-big.svg">
    <img class="InnerCircle" src="img/icons/circle-small.svg">
</div>


<div class="ZoomButton">
    <div data-type="Days" class="Button">Days</div>
    <div data-type="Weeks" class="Button">Weeks</div>
    <div data-type="Months" class="Button">Months</div>
</div>


</body>
</html>