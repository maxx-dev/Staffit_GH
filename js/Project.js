
// REMEMBER TO DIFFERENTIATE BETWEEN CURRENT AND SELECTED VARIABLES;
var lbubb;
var View = 'Months';
var ProjectType = 'Past';

var Scroll = 0;
var TimeUnitWidth = 91;
var ScrollToday = 0;
var Data;
var CalenderWidth;
var HandleDrag = false;



function LoadProjectView ()
{
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "getProjects.php",
        data: {ProjectType:ProjectType},
        success: function(data){

            console.log(data);
            Data = ProcessProjects(data);

            // LEGEND
            $('#ControlPanel').find('.ProjectsContainer').html('');
            $('.CalenderInner').find('.LegendUnitHeader').html('');
            $('.CalenderInner').find('.LegendUnit').remove();

            if (View == 'Months')
            {
                ScaleFMonthsProject(Data);
            }
            if (View == 'Weeks')
            {
                ScaleFWeeksProject(Data);
            }
            if (View == 'Days')
            {
                ScaleFDaysProject(Data);
            }

            ReloadProjectDom();
        }
    });
}

function initProjects ()
{
    $('.Zoom :nth-child(3)').css('background-Color','#7ECEFD');
    $('#ControlPanel').find('.ProjectType[data-type="'+ProjectType+'"]').css('background-Color','transparent');
    $('.Earlier').css('left','235px');
    $(this).css('color','black');

    $('body').mousemove(function(e){

      /*  if (HandleDrag)
        {
            console.log(e);
            $(HandleDrag).css('background-Color','red');
        }*/

    })

    $('.Later').click(function(e){

        Scroll += TimeUnitWidth+2;

        console.log($(".CalenderInner")[0].scrollHeight);
        console.log($(".CalenderInner").css('width'))
        console.log($("body").css('width'))
        console.log($(".CalenderInner")[0].scrollWidth)
        if (Scroll >= $(".CalenderInner")[0].scrollWidth)
        {
            Scroll = $(".CalenderInner")[0].scrollWidth;
        }
        console.log(Scroll);
        $(".Calender").scrollLeft(Scroll);
    })

    $('.Earlier').click(function(e){

        Scroll -= TimeUnitWidth-1;

        if (Scroll <= 0)
        {
            Scroll = 0;
        }
        console.log(Scroll);

        // ON IPAD 1  ON DESKTOP 2;
        $(".Calender").scrollLeft(Scroll);
    })

    $('.Today').click(function(e){

        $(".Calender").scrollLeft(ScrollToday);
    })


    $('#ControlPanel').find('.ProjectType').click(function(){

        $('#ControlPanel').find('.ProjectType').css('background-Color','#3C3C3B');
        $('#ControlPanel').find('.ProjectType').css('color','white');


        if ($(this).attr('data-type') == 'Past')
        {
            $(this).css('background-Color','transparent');
            $(this).css('color','black');
            ProjectType = 'Past';
            LoadProjectView();
        }

        if ($(this).attr('data-type') == 'Current')
        {
            $(this).css('background-Color','transparent');
            $(this).css('color','black');
            ProjectType = 'Current';
            LoadProjectView();
        }

        if ($(this).attr('data-type') == 'Future')
        {
            $(this).css('background-Color','transparent');
            $(this).css('color','black');
            ProjectType = 'Future';
            LoadProjectView();
        }
    });
}

function ReloadProjectDom ()
{

    $('#ControlPanel').find('.Project').click(function(){

        if ( $(this).attr('data-state') == '0')
        {
            $(this).find('.Displayer').attr('src','img/icons/na-opened.png');
            $(this).attr('data-state','1');

            console.log($(this).find('.Team').children().length);
            if ($(this).find('.Team').children().length >= 5)
            {
                $(this).css('height',150);
                var ID = $(this).attr('data-id');
                $('.LegendUnit[data-id="'+ID+'"]').css('height',150);
                $('.LegendUnit[data-id="'+ID+'"]').find('.SepWrapper').css('height',150);
                $(this).find('.Team').show();
            }
            else
            {
                $(this).css('height',100);
                var ID = $(this).attr('data-id');
                $('.LegendUnit[data-id="'+ID+'"]').css('height',100);
                $('.LegendUnit[data-id="'+ID+'"]').find('.SepWrapper').css('height',100);
                $(this).find('.Team').show();
            }
        }
        else
        {
            $(this).find('.Displayer').attr('src','img/icons/na-closed.png');
            $(this).attr('data-state','0');
            $(this).css('height',50);
            var ID = $(this).attr('data-id');
            $('.LegendUnit[data-id="'+ID+'"]').css('height',50);
            $('.LegendUnit[data-id="'+ID+'"]').find('.SepWrapper').css('height',50);

            $(this).find('.Team').hide();
        }


    })

    $('#ControlPanel').find('.Project').find('.Details').click(function(e){


        e.stopPropagation();
        if ( $('.ProjectDetailsCont').attr('data-state') == 0)
        {
            var ID = $(this).parent().attr('data-id');
            var Team = $(this).parent().find('.Team').html();

            var Data = GetProject(ID);

            $('.ProjectDetailsCont').attr('data-id',ID);
            $('.ProjectDetailsCont').find('.ProjectName').html(Data.Name);
            $('.ProjectDetailsCont').find('.Team').find('.Member').remove();
            $('.ProjectDetailsCont').find('.Team').prepend(Team);
            $('.ProjectDetailsCont').find('.Notes').html(Data.Notes);

            var Start = Data.StartDate;
            var End = Data.EndDate;
            if (Time.getTime() > Start.getTime() && Time.getTime() < End.getTime())
            {
                console.log('Current');
                var Progress = (Time.getTime() - Start.getTime())/(End.getTime() - Start.getTime()) *100;
            }
            else if (Time.getTime() < Start.getTime())
            {
                console.log('Future');
                var Progress = 0;
            }
            else if (Time.getTime() > End.getTime())
            {
                console.log('Past');
                var Progress = '100';
            }

            $('.ProjectDetailsCont').find('.ProgressBarCont').find('.Progress').css('width',Progress+'%');
            $('.ProjectDetailsCont').find('.ProgressBarCont').find('.StartDate').val(Start.getDate()+' '+Months[Start.getMonth()]+' '+Start.getFullYear());
            $('.ProjectDetailsCont').find('.ProgressBarCont').find('.EndDate').val(End.getDate()+' '+Months[End.getMonth()]+' '+End.getFullYear());

            $('.ProjectDetailsCont').css('right','1%');
            $('.ProjectDetailsCont').attr('data-state','1')
        }
        else
        {
            $('.ProjectDetailsCont').css('right','-51%');
            $('.ProjectDetailsCont').attr('data-state','0')
        }


    })

    // EDITING MODE
    $('.ProjectDetailsCont').find('.ProjectName, .Notes').click(function(e){

        e.stopPropagation();

        if ( $(this).attr('contenteditable') == 'false')
        {
            $(this).attr('contenteditable','true');
            $(this).focus();
            $(this).css('border','1px #ccc solid;');
        }
        else
        {
            //$(this).attr('contenteditable','false');
            //$(this).css('border','0px #ccc solid;');
        }

    });

    $('.ProjectDetailsCont').click(function(e){

        $(this).find('.ProjectName, .Notes').attr('contenteditable','false');
        $(this).find('.ProjectName, .Notes').css('border','0px #ccc solid;');
    })

    $('.ProjectDetailsCont').find('.ProjectName, .Notes').keyup(function(){

        var Type = $(this).attr('data-type');
        var Val = $(this).text();
        var P_ID = $(this).parent().parent().attr('data-id');

        console.log(P_ID+' '+Val+' '+Type);

        $.ajax({
            type: "POST",
            url: "setProjects.php",
            data: {Type:Type,Val:Val,P_ID:P_ID},
            success: function(data){

                console.log(data);
            }
        });

    });

    $(function()
    {
        $('.ProjectDetailsCont').find('.StartDate , .EndDate').datepicker({
            showWeek:true,
            dateFormat: "yyyy-mm-dd",
            monthNames: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec" ],

            onSelect: function (date,obj){

                var Type = $(this).attr('data-type');
                var Val = date;
                var P_ID = $(this).parent().parent().parent().attr('data-id');

                console.log(P_ID+' '+Val+' '+Type);
               /* $.ajax({
                    type: "POST",
                    url: "setProjects.php",
                    data: {Type:Type,Val:Val,P_ID:P_ID},
                    success: function(data){

                        console.log(data);
                    }
                });*/


            }


        });

    });




    $(function() {
        $( ".PDur" ).draggable({

             axis: "x" ,


            start: function( event, ui ) {
3
            },

            drag: function( event, ui ) {

                console.log(ui);
                var Move = ui.position.left;
                var Init = ui.originalPosition.left;
               // $(event.target).find('.EditStart').find('.HelperLabel').html(Month);
            },

            stop: function( event, ui ) {

                //console.log(ui)
            }

        });
    });

    $(function() {
        $( ".PDur").find('.EditStart, .EditEnd').draggable({

            axis: "x" ,

            start: function( event, ui ) {

            },

            drag: function( event, ui ) {

                console.log(ui);
                var Move = ui.position.left;
                var Init = ui.originalPosition.left;
                // $(event.target).parent().
            },

            stop: function( event, ui ) {

                //console.log(ui)
            }

        });
    });


    $('.CalenderInner').find('.PDur').find('.EditEnd').mousedown(function(e){

        e.preventDefault();
        $(this).css('border','1px black solid');
        $(this).find('.EditEnd, .EditStart').find('.Helper').show();
        HandleDrag = $(this).parent();

    })


    $('.CalenderInner').find('.PDur').mousedown(function(){

        $(this).css('border','1px black solid');
        $(this).find('.EditEnd, .EditStart').find('.Helper').show();

    })


    $('.CalenderInner').find('.PDur').mouseup(function(){

        $(this).css('border','0px black solid');
        HandleDrag = false;

    })

    $('.CalenderInner').find('.PDur').find('.EditEnd, .EditStart').mousedown(function(e){

        e.stopPropagation();
        $(this).css('background-color','rgba(203, 204, 198,1)');
        $(this).find('.Helper').show();

    })

    $('body').mouseup(function(e){

        $('.CalenderInner').find('.PDur').css('border','0px black solid');
        $('.CalenderInner').find('.PDur').find('.EditEnd, .EditStart').css('background-color','rgba(203, 204, 198,0.6)')
        $('.CalenderInner').find('.PDur').find('.EditEnd, .EditStart').find('.Helper').hide();
    })


}




function StaffProject (data)
{
    this.ID = data.ID;
    this.FirstName = data.FirstName;
    this.LastName = data.LastName;
    this.URL = data.URL;
    this.Dev = data.Dev;
    this.Design = data.Design;
    this.UX = data.UX;
    this.Research = data.Research
}



function ScaleFMonthsProject (data)
{
    CalenderWidth = TimeUnitWidth*26;
    $('.CalenderInner').css('width',CalenderWidth);
    var count = CurrentMonth;
    var CurYear = Time.getFullYear();
    CurYear--; // START FROM LAST YEAR;

    for ( var x = 0;x<25;x++)
    {
        count++;
        if (count == 12)
        {
            count = 0;
            CurYear++;
        }
        $('.LegendUnitHeader').append('<div data-date="'+CurYear+'-'+count+'" class="TimeUnit"><div style="text-align:center">'+Months[count]+' '+CurYear+'</div></div>');
    }

    $('.TimeUnit[data-date="'+Time.getFullYear()+'-'+Time.getMonth()+'"]').css('border-right','3px red solid');
    var Pos = $('.TimeUnit[data-date="'+Time.getFullYear()+'-'+Time.getMonth()+'"]').position();

    var ControlPanelWidth = parseInt($('#ControlPanel').css('width'));
    $(".Calender").scrollLeft(Pos.left-ControlPanelWidth);
    Scroll = Pos.left-ControlPanelWidth;
    ScrollToday = Scroll;

    for ( d in data)
    {
        //var Dur = data[d].EndDate.getTime() -  data[d].StartDate.getTime();
        var Start =  data[d].StartDate;
        var End   =  data[d].EndDate;

        var PosStart = $('.TimeUnit[data-date="'+Start.getFullYear()+'-'+Start.getMonth()+'"]').position();
        var PosEnd = $('.TimeUnit[data-date="'+End.getFullYear()+'-'+End.getMonth()+'"]').position();

        // DAY PRECISION
        var DayPrecStart = Start.getDate()/31 * TimeUnitWidth;
        var DayPrecEnd = End.getDate()/31 * TimeUnitWidth;
        //console.log(DayPrecEnd);
        var Width = PosEnd.left - PosStart.left;
        var Left = PosStart.left+DayPrecStart;

        if (Start.getMonth() != End.getMonth())
        {
            Width = Width -DayPrecStart+ DayPrecEnd;
        }

        if (Start.getMonth() == End.getMonth())
        {
            Width = DayPrecEnd-DayPrecStart;
        }

        CreateProjectEl(data[d],Left,Width,25);
    }
}


function ScaleFWeeksProject (data)
{

    CalenderWidth = TimeUnitWidth*106;
    $('.CalenderInner').css('width',CalenderWidth);
    var ScaleTime = new Date();
    ScaleTime.setYear(ScaleTime.getFullYear()-1);

    for ( var x = 0;x<104;x++)
    {
        var Days =  ScaleTime.getDate();
        if (ScaleTime.getWeek() == 1)
        {
            ScaleTime.setYear(ScaleTime.getFullYear());
        }
        $('.LegendUnitHeader').append('<div data-date="'+ScaleTime.getFullYear()+'-'+ScaleTime.getWeek()+'" style="'+TimeUnitWidth+'px;" class="TimeUnit"><div style="text-align:left">'+Months[ScaleTime.getMonth()]+' '+ScaleTime.getDate()+'</div></div>');
        ScaleTime.setDate(Days+7);
    }

    $('.TimeUnit[data-date="'+Time.getFullYear()+'-'+Time.getWeek()+'"]').css('border-right','3px red solid');
    var Pos = $('.TimeUnit[data-date="'+Time.getFullYear()+'-'+Time.getWeek()+'"]').position();

    var ControlPanelWidth = parseInt($('#ControlPanel').css('width'));
    $(".Calender").scrollLeft(Pos.left-ControlPanelWidth);
    Scroll = Pos.left-ControlPanelWidth;
    ScrollToday = Scroll;

    for ( d in data)
    {
        var Start =  data[d].StartDate;
        var End   =  data[d].EndDate;

        //console.log(Start)
        var PosStart = $('.TimeUnit[data-date="'+Start.getFullYear()+'-'+Start.getWeek()+'"]').position();
        var PosEnd = $('.TimeUnit[data-date="'+End.getFullYear()+'-'+End.getWeek()+'"]').position();

        // DAY PRECISION
        var DayPrecStart = Start.getDay()/7 * TimeUnitWidth;
        var DayPrecEnd = End.getDay()/7 * TimeUnitWidth;
        //console.log(DayPrecEnd);
        var Width = PosEnd.left - PosStart.left;
        var Left = PosStart.left +DayPrecStart;

        if (Start.getWeek() == End.getWeek())
        {
            Width = DayPrecEnd-DayPrecStart;
        }

        CreateProjectEl(data[d],Left,Width,104);
    }
}

function ScaleFDaysProject (data)
{
    CalenderWidth = TimeUnitWidth*701;
    $('.CalenderInner').css('width',CalenderWidth);
    var ScaleTime = new Date();
    ScaleTime.setYear(ScaleTime.getFullYear()-1);

    for ( var x = 0;x<700;x++)
    {
        var Days =  ScaleTime.getDate();
        if (ScaleTime.getWeek() == 1)
        {
            ScaleTime.setYear(ScaleTime.getFullYear());
        }
        $('.LegendUnitHeader').append('<div data-date="'+ScaleTime.getFullYear()+'-'+ScaleTime.getMonth()+'-'+ScaleTime.getDate()+'" style="'+TimeUnitWidth+'px;" class="TimeUnit"><div style="text-align:center">'+ScaleTime.getMonth()+'/'+ScaleTime.getDate()+'</div></div>');
        ScaleTime.setDate(Days+1);
    }

    console.log(Time.getFullYear()+'-'+Time.getWeek());
    $('.TimeUnit[data-date="'+Time.getFullYear()+'-'+Time.getMonth()+'-'+Time.getDate()+'"]').css('border-right','3px red solid');
    var Pos = $('.TimeUnit[data-date="'+Time.getFullYear()+'-'+Time.getMonth()+'-'+Time.getDate()+'"]').position();

    var ControlPanelWidth = parseInt($('#ControlPanel').css('width'));
    $(".Calender").scrollLeft(Pos.left-ControlPanelWidth);
    Scroll = Pos.left-ControlPanelWidth;
    ScrollToday = Scroll;

    for ( d in data)
    {
        var Start = data[d].StartDate;
        var End =   data[d].EndDate;

        //console.log(Start)
        var PosStart = $('.TimeUnit[data-date="'+Start.getFullYear()+'-'+Start.getMonth()+'-'+Start.getDate()+'"]').position();
        var PosEnd =   $('.TimeUnit[data-date="'+End.getFullYear()+'-'+End.getMonth()+'-'+End.getDate()+'"]').position();

        // DAY PRECISION
        var DayPrecStart = Start.getDay()/7 * TimeUnitWidth;
        var DayPrecEnd = End.getDay()/7 * TimeUnitWidth;
        //console.log(DayPrecEnd);
        var Width = PosEnd.left - PosStart.left;
        var Left = PosStart.left;

        CreateProjectEl(data[d],Left,Width,700);
    }
}



function CreateProjectEl (data,Left,Width,SepWrapper) {

    // CONTROL PANEL ELEMENT
    $('#ControlPanel').find('.ProjectsContainer').append('<div data-state="0" data-id="'+data.ID+'" class="Project">' +
        '<img class="Displayer" src="img/icons/na-closed.png"> ' +
        '<div class="Title">'+data.Name+'</div>' +
        '<img src="img/icons/details.svg" class="Details">'+
        '<div class="Team">'+CreateTeamMember(data.Team)+'</div>'+
        '</div>');

    // DURATION ELEMENT
    $('.CalenderInner').append('<div data-id="'+data.ID+'" class="LegendUnit"><div style="left:'+Left+'px; width:'+Width+'px" class="PDur">' +
        '<div class="EditStart"><div class="Helper"><div class="HelperLabel"></div></div></div>' +
        '<div class="EditEnd"><div class="Helper"><div class="HelperLabel"></div></div></div>' +
        '</div>' +
        CreateSepWrapper (SepWrapper,50) +
        '</div>');
}

