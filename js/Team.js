
// REMEMBER TO DIFFERENTIATE BETWEEN CURRENT AND SELECTED VARIABLES;

var ViewMarker = 1;
var Views = ['Days','Weeks','Months'];
var View = 'Weeks';

var Scroll = 0;
var TimeUnitWidth = 91;
var ScrollToday = 0;
var Data;
var CalenderWidth;

// FILTERS
var Research = 0;
var UX = 0;
var Design = 0;
var Dev = 0;
var ZoomRotator = 0;


function LoadTeamView ()
{


    $.ajax({
        type: "POST",
        dataType: "json",
        url: "getTeam.php",
        data: {Research:Research,UX:UX,Design:Design,Dev:Dev},
        success: function(data){

            console.log(data);
            Data = ProcessTeam(data);
            Data = ApplyFilters(Data);
            console.log(Data);
            // LEGEND
            $('#ControlPanel').find('.TeamContainer').html('');
            $('.CalenderInner').find('.LegendUnitHeader').html('');
            $('.CalenderInner').find('.LegendUnit').remove();

            if (View == 'Months')
            {
                ScaleFMonthsTeam(Data)
            }
            if (View == 'Weeks')
            {
                ScaleFWeeksTeam(Data)
            }
            if (View == 'Days')
            {
                ScaleFDaysTeam(Data)
            }

            ReloadTeamDom();
        },

        error:function(data) {

            console.log('ERROR');
            console.log(data);
        }
    });
}

// FOR TO MANY TEAM MEMBER ADD ADDITONAL PAGES
// OR ADD SUBGROUPS

function initTeam ()
{
    $('.Zoom :nth-child(3)').css('background-Color','#7ECEFD');
    $('.Earlier').css('left','235px');
    //$('body, html').css({overflow: 'scroll'});
    //$('#AppViewCont').css({overflow: 'scroll'});

    $('.Later').click(function(e){

        Scroll += TimeUnitWidth-1;
        $(".Calender").scrollLeft(Scroll);
    })

    $('.Earlier').click(function(e){

        Scroll -= TimeUnitWidth+2;
        // ON IPAD 1  ON DESKTOP 2;
        $(".Calender").scrollLeft(Scroll);
    })

    $('.Today').click(function(e){

        $(".Calender").scrollLeft(ScrollToday);
    })


    $('#ControlPanel').find('.SkillsFilter').find('img').click(function(){

        var Type = $(this).attr('data-type');
        var State = parseInt($(this).attr('data-state'));
        console.log(Type+' '+State);
        if (State == 1)
        {
            var src = $(this).attr('src');
            src = src.replace(".svg","");
            src = src+'-off.svg';
            $(this).attr('src', src);
            //$(this).css('-webkit-filter','grayscale(100%)');
            $(this).attr('data-state', 0);
            LoadTeamView();
        }
        else
        {
            var src = $(this).attr('src');
            src = src.replace("-off","");
            $(this).attr('src', src);
            //$(this).css('-webkit-filter','grayscale(0%)');
            $(this).attr('data-state', 1);
            LoadTeamView();

        }
    });


    /*$('.Zoom').find('.Button').click(function(){

        $('.Zoom').find('.Button').css('background-Color','#9c9b9b');

        if ($(this).attr('data-type') == 0)
        {
            $(this).css('background-Color','#7ECEFD');
            View = 'Days';
            LoadTeamView();
        }

        if ($(this).attr('data-type') == 1)
        {
            $(this).css('background-Color','#7ECEFD');
            View = 'Weeks';
            LoadTeamView();
        }

        if ($(this).attr('data-type') == 2)
        {
            $(this).css('background-Color','#7ECEFD');
            View = 'Months';
            LoadTeamView();
        }
    });*/


}

function ReloadTeamDom ()
{

    $('#ControlPanel').find('.Team').children('.Title, .Displayer').click(function(){

        var ID = $(this).parent().attr('data-id');

        if ( $(this).parent().attr('data-state') == '0')
        {
            $(this).parent().find('.Displayer').css('webkit-transform','rotate(90deg)')
            $(this).parent().attr('data-state','1');
            $(this).parent().css('height',150);

            $('.LegendUnit[data-id="'+ID+'"]').css('height',150);
            $('.LegendUnit[data-id="'+ID+'"]').find('.SepWrapper').css('height',150);
            $('.LegendUnit[data-id="'+ID+'"]').find('.PDur').css('height','+=10');
            var count = 0;
            $('.LegendUnit[data-id="'+ID+'"]').find('.PDur').each(function(){

                $(this).css('top','+='+count);
                count += 10;
            });
            $('.LegendUnit[data-id="'+ID+'"]').find('.PDur').find('.Name').show();
            $(this).parent().find('.SkillsCont').show();

        }
        else
        {
            $(this).parent().find('.Displayer').css('webkit-transform','rotate(0deg)')
            $(this).parent().attr('data-state','0');
            $(this).parent().css('height',70);

            $('.LegendUnit[data-id="'+ID+'"]').css('height',70);
            $('.LegendUnit[data-id="'+ID+'"]').find('.SepWrapper').css('height',70);
            $('.LegendUnit[data-id="'+ID+'"]').find('.PDur').css('height','-=10');
            var count = 0;
            $('.LegendUnit[data-id="'+ID+'"]').find('.PDur').each(function(){

                $(this).css('top','-='+count);
                count += 10;
            });
            $('.LegendUnit[data-id="'+ID+'"]').find('.PDur').find('.Name').hide();
            $(this).parent().find('.SkillsCont').hide();

        }
    });



    $('#ControlPanel').find('.Team').find('.UserImage').click(function(e){


        $('.StaffDetailsCont').find('.Projects').find('.Project').remove();
        $('.StaffDetailsCont').find('.PastProjects').find('.PastProject').remove();
        $('.StaffDetailsCont').find('.Vacations').find('.Vacation').remove();

        e.stopPropagation();
        if ( $('.StaffDetailsCont').attr('data-state') == 0)
        {
            var ID = $(this).parent().attr('data-id');
            var Team = $(this).parent().find('.Team').html();

            var Data = GetProject(ID);

            $('.StaffDetailsCont').find('.Name').html(Data.LastName[0]+' '+Data.FirstName);
            $('.StaffDetailsCont').find('.Image').find('img').attr('src',Data.URL);

            var Skills = CheckSkills(Data.Research,Data.UX,Data.Dev,Data.Design);
            $('.StaffDetailsCont').find('.Skills').find('.Dev').css('display',Skills.Dev);
            $('.StaffDetailsCont').find('.Skills').find('.UX').css('display',Skills.UX);
            $('.StaffDetailsCont').find('.Skills').find('.Design').css('display',Skills.Design);
            $('.StaffDetailsCont').find('.Skills').find('.Research').css('display',Skills.Research);

            for (s in Data.projects)
            {
                if (Data.projects[s].EndDate.getTime() > Time.getTime())
                {
                    $('.StaffDetailsCont').find('.Projects').append('<div class="Project">'+Data.projects[s].Name+'</div>')
                }
                else
                {
                    $('.StaffDetailsCont').find('.PastProjects').append('<div class="PastProject">'+Data.projects[s].Name+'</div>')
                }
            }

            for (s in Data.vacations)
            {
                var MonthS = Data.vacations[s].StartDate.getMonth()+1;
                var MonthE = Data.vacations[s].EndDate.getMonth()+1;
                $('.StaffDetailsCont').find('.Vacations').append('<div class="Vacation">'+MonthS+'/'+Data.vacations[s].StartDate.getDate()+'/'+Data.vacations[s].StartDate.getFullYear()+' - '+MonthE+'/'+Data.vacations[s].EndDate.getDate()+'/'+Data.vacations[s].EndDate.getFullYear()+'</div>')
            }

            $('.StaffDetailsCont').css('right','1%');
            $('.StaffDetailsCont').attr('data-state','1')
        }
        else
        {
            $('.StaffDetailsCont').css('right','-51%');
            $('.StaffDetailsCont').attr('data-state','0')
        }


    })


    $(function() {
        $( ".PDur" ).draggable({

             axis: "x" ,


            start: function( event, ui ) {

            },

            drag: function( event, ui ) {

                //console.log(ui);
                var Move = ui.position.left;
                var Init = ui.originalPosition.left;
               // $(event.target).find('.EditStart').find('.HelperLabel').html(Month);
            },

            stop: function( event, ui ) {

                console.log(ui)
            }

        });
    });


    $('#ControlPanel').scroll(function(e){

        //console.log(e);
        //console.log($(this).scrollTop());
        $('.LegendUnit').css('top',-$(this).scrollTop());
    });

}



function ScaleFMonthsTeam (data)
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
        if (data[d].Skill != -1) // FILTERING
        {
            CreateTeamLabel(data[d],25);

            var offsetY = 10;
            data[d].projects.sort(CompareMemberProjects); // SORT FOR OFFSETTING BELOW

            for ( p in data[d].projects)
            {
                //console.log('ID: '+d)
                //console.log(data[d].projects[p]);
                //var Dur = data[d].EndDate.getTime() -  data[d].StartDate.getTime();
                var Start =  data[d].projects[p].StartDate;
                var End   =  data[d].projects[p].EndDate;

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

                // CALCS OFFSET FOR CORRECT POSITIONING BY CHECK FOR OVERLAAPS
                if (p >= 1)
                {

                    if (data[d].projects[p-1].EndDate.getTime() > Start.getTime())
                    {
                        offsetY+= 15;
                    }
                    else
                    {
                        offsetY = 10;
                    }
                }
                CreateTeamProjects(data[d].ID,data[d].projects[p],Left,Width,offsetY)

            }

            offsetY = 10;
            for ( p in data[d].vacations)
            {
                //console.log('ID: '+d)
                //console.log(data[d]);
                //var Dur = data[d].EndDate.getTime() -  data[d].StartDate.getTime();
                var Start =  data[d].vacations[p].StartDate;
                var End   =  data[d].vacations[p].EndDate;

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
                CreateTeamVacations(data[d].ID,data[d].vacations[p],Left,Width,offsetY)
            }
     }
    }
}



function ScaleFWeeksTeam (data)
{

    CalenderWidth = TimeUnitWidth*53;
    $('.CalenderInner').css('width',CalenderWidth);
    var ScaleTime = new Date();
    ScaleTime.setMonth(ScaleTime.getMonth()-5);

    for ( var x = 0;x<52;x++)
    {
        var Days =  ScaleTime.getDate();
        var WeekofMonth = parseInt(ScaleTime.getDate()/7)+1;
        if (WeekofMonth > 4)
        {
            WeekofMonth = 4;
        }
        if (ScaleTime.getWeek() == 1)
        {
            ScaleTime.setYear(ScaleTime.getFullYear());
            $('.LegendUnitHeader').append('<div data-date="'+ScaleTime.getFullYear()+'-'+ScaleTime.getWeek()+'" style="'+TimeUnitWidth+'px;" class="TimeUnit"><div style="text-align:left">'+Months[ScaleTime.getMonth()]+' '+ScaleTime.getDate()+'</div></div>');
        }
        else
        {
            $('.LegendUnitHeader').append('<div data-date="'+ScaleTime.getFullYear()+'-'+ScaleTime.getWeek()+'" style="'+TimeUnitWidth+'px;" class="TimeUnit"><div style="text-align:left">'+Months[ScaleTime.getMonth()]+' '+ScaleTime.getDate()+'</div></div>');
        }
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
        if (data[d].Skill != -1) // FILTERING
        {
            CreateTeamLabel(data[d],52);

            var offsetY = 10;
            data[d].projects.sort(CompareMemberProjects); // SORT FOR OFFSETTING
            //data[d].vacations.sort(CompareMemberProjects);

            for ( p in data[d].projects)
            {
                var Start =  data[d].projects[p].StartDate;
                var End   =  data[d].projects[p].EndDate;

                var PosStart = $('.TimeUnit[data-date="'+Start.getFullYear()+'-'+Start.getWeek()+'"]').position();
                var PosEnd = $('.TimeUnit[data-date="'+End.getFullYear()+'-'+End.getWeek()+'"]').position();

                if (PosStart != undefined && PosEnd != undefined) // CHECK IF DATES IN DISPLAYED RANGE OF CALENDERCONTAINER
                {
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

                    if (p >= 1)
                    {
                        if (data[d].projects[p-1].EndDate.getTime() > Start.getTime())
                        {
                            offsetY+= 15;
                        }
                        else
                        {
                            offsetY = 10;
                        }
                    }

                    CreateTeamProjects(data[d].ID,data[d].projects[p],Left,Width,offsetY)
                }
            }


            offsetY = 10;
            for ( p in data[d].vacations)
            {
                var Start =  data[d].vacations[p].StartDate;
                var End   =  data[d].vacations[p].EndDate;

                var PosStart = $('.TimeUnit[data-date="'+Start.getFullYear()+'-'+Start.getWeek()+'"]').position();
                var PosEnd = $('.TimeUnit[data-date="'+End.getFullYear()+'-'+End.getWeek()+'"]').position();

                if (PosStart != undefined && PosEnd != undefined) // CHECK IF DATES IN DISPLAYED RANGE OF CALENDERCONTAINER
                {
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

                    CreateTeamVacations(data[d].ID,data[d].vacations[p],Left,Width,offsetY)
                }
            }
        }
    }



}

function ScaleFDaysTeam (data)
{
    CalenderWidth = TimeUnitWidth*184;
    $('.CalenderInner').css('width',CalenderWidth);
    var ScaleTime = new Date();
    ScaleTime.setMonth(ScaleTime.getMonth()-2);

    console.log(ScaleTime);
    for ( var x = 0;x<183;x++)
    {
        var Days =  ScaleTime.getDate();
        if (ScaleTime.getWeek() == 1)
        {
            ScaleTime.setYear(ScaleTime.getFullYear());
        }
        $('.LegendUnitHeader').append('<div data-date="'+ScaleTime.getFullYear()+'-'+ScaleTime.getMonth()+'-'+ScaleTime.getDate()+'" style="'+TimeUnitWidth+'px;" class="TimeUnit"><div style="text-align:center">'+ScaleTime.getMonth()+'/'+ScaleTime.getDate()+'</div></div>');
        ScaleTime.setDate(Days+1);
    }

    //console.log(Time.getFullYear()+'-'+Time.getWeek());
    $('.TimeUnit[data-date="'+Time.getFullYear()+'-'+Time.getMonth()+'-'+Time.getDate()+'"]').css('border-right','3px red solid');
    var Pos = $('.TimeUnit[data-date="'+Time.getFullYear()+'-'+Time.getMonth()+'-'+Time.getDate()+'"]').position();

    var ControlPanelWidth = parseInt($('#ControlPanel').css('width'));
    $(".Calender").scrollLeft(Pos.left-ControlPanelWidth);
    Scroll = Pos.left-ControlPanelWidth;
    ScrollToday = Scroll;

    for ( d in data)
    {
        if (data[d].Skill != -1) // FILTERING
        {
            CreateTeamLabel(data[d],183);

            var offsetY = 10;
            data[d].projects.sort(CompareMemberProjects); // SORT FOR OFFSETTING

            for ( p in data[d].projects)
            {
                var Start =  data[d].projects[p].StartDate;
                var End   =  data[d].projects[p].EndDate;

                //console.log(Start)
                var PosStart = $('.TimeUnit[data-date="'+Start.getFullYear()+'-'+Start.getMonth()+'-'+Start.getDate()+'"]').position();
                var PosEnd =   $('.TimeUnit[data-date="'+End.getFullYear()+'-'+End.getMonth()+'-'+End.getDate()+'"]').position();

                if (PosStart != undefined && PosEnd != undefined) // CHECK IF DATES IN DISPLAYED RANGE OF CALENDERCONTAINER
                {
                    // DAY PRECISION
                    var DayPrecStart = Start.getDay()/7 * TimeUnitWidth;
                    var DayPrecEnd = End.getDay()/7 * TimeUnitWidth;
                    //console.log(DayPrecEnd);
                    var Width = PosEnd.left - PosStart.left;
                    var Left = PosStart.left;

                    if (p >= 1)
                    {
                        if (data[d].projects[p-1].EndDate.getTime() > Start.getTime())
                        {
                            offsetY+= 15;
                        }
                        else
                        {
                            offsetY = 10;
                        }
                    }

                    CreateTeamProjects(data[d].ID,data[d].projects[p],Left,Width,offsetY)
                }
            }

            offsetY = 10;
            for ( p in data[d].vacations)
            {
                var Start =  data[d].vacations[p].StartDate;
                var End   =  data[d].vacations[p].EndDate;

                //console.log(Start)
                var PosStart = $('.TimeUnit[data-date="'+Start.getFullYear()+'-'+Start.getMonth()+'-'+Start.getDate()+'"]').position();
                var PosEnd =   $('.TimeUnit[data-date="'+End.getFullYear()+'-'+End.getMonth()+'-'+End.getDate()+'"]').position();

                if (PosStart != undefined && PosEnd != undefined) // CHECK IF DATES IN DISPLAYED RANGE OF CALENDERCONTAINER
                {
                    // DAY PRECISION
                    var DayPrecStart = Start.getDay()/7 * TimeUnitWidth;
                    var DayPrecEnd = End.getDay()/7 * TimeUnitWidth;
                    //console.log(DayPrecEnd);
                    var Width = PosEnd.left - PosStart.left;
                    var Left = PosStart.left;

                    CreateTeamVacations(data[d].ID,data[d].vacations[p],Left,Width,offsetY)
                }
            }
        }
    }


}


function ApplyFilters (data)
{
    var Research = parseInt($('.SkillsFilter').find('.Research').attr('data-state'));
    var UX =       parseInt($('.SkillsFilter').find('.UX').attr('data-state'));
    var Design =   parseInt($('.SkillsFilter').find('.Design').attr('data-state'));
    var Dev =      parseInt($('.SkillsFilter').find('.Dev').attr('data-state'));

    for (x in data)
    {

     if (Dev)
        {
            if (data[x].Dev == '0')
            {
                data[x].Skill = -1;
            }
        }

     if (Research)
        {
            if (data[x].Research == 0)
            {
                data[x].Skill = -1;
            }
        }

        if (UX)
        {
            if (data[x].UX == 0)
            {
                data[x].Skill = -1;
            }
        }

        if (Design)
        {
            if (data[x].Design == 0)
            {
                data[x].Skill = -1;
            }
        }
    }

    return data;
}


function CreateTeamLabel (data,SepWrapper) {

    //console.log(data);
    // CONTROL PANEL ELEMENT

    var Skills = CheckSkills(data.Research,data.UX,data.Dev,data.Design);

    $('#ControlPanel').find('.TeamContainer').append('<div style="height:70px" data-state="0" data-id="'+data.ID+'" class="Team">' +
        '<img class="Displayer" src="img/icons/arrow.svg"> ' +
        '<div class="Title">'+data.FirstName+' '+data.LastName[0]+'</div>' +
        '<img class="UserImage" src="'+data.URL+'"">' +
        '<div data-state="0" class="SkillsCont">' +
           '<img style="display:'+Skills.Dev+'" class="Dev" src="img/icons/filter-dev.svg">' +
           '<img style="display:'+Skills.UX+'" class="Ixd" src="img/icons/filter-ixd.svg">' +
           '<img style="display:'+Skills.Research+'" class="Research" src="img/icons/filter-rs.svg">' +
           '<img style="display:'+Skills.Design+'" class="Vd" src="img/icons/filter-vd.svg">' +
        '</div>' +
        '<img class="Details" src="img/icons/details.svg">' +
        '</div>');

    $('.CalenderInner').append('<div data-id="'+data.ID+'" style="height:70px" class="LegendUnit">'+CreateSepWrapper (SepWrapper,100) +'</div>');
}


function CreateTeamProjects (ID,data,Left,Width,offsetY) {

    $('.LegendUnit[data-id="'+ID+'"]').append('<div style="left:'+Left+'px; top:'+offsetY+'px; width:'+Width+'px; height:8px;" class="PDur">' +
        '<div class="Name">'+data.Name+'</div>' +
        '<div class="EditStart"><div class="Helper"><div class="HelperLabel"></div></div></div>' +
     '<div class="EditEnd"><div class="Helper"><div class="HelperLabel"></div></div></div>' +
     '</div>');
}

function CreateTeamVacations (ID,data,Left,Width,offsetY) {


    $('.LegendUnit[data-id="'+ID+'"]').append('<div style="left:'+Left+'px; top:'+offsetY+'px; width:'+Width+'px; height:8px; background-Color:rgba(255,220,215,1);" class="PDur">' +
        '<div class="Name">'+Months[data.StartDate.getMonth()]+' '+data.StartDate.getDate()+' - '+Months[data.EndDate.getMonth()]+' '+data.EndDate.getDate()+'</div>' +
        '<div class="EditStart"><div class="Helper"><div class="HelperLabel"></div></div></div>' +
        '<div class="EditEnd"><div class="Helper"><div class="HelperLabel"></div></div></div>' +
        '</div>');
}

function CreateTeamProjectsList (data)
{
    var Projects = '';
    for (var x= 0;x<data.length;x++)
    {
        Projects += '<div class="Project">'+data[x].Name+'</div>';
    }
    return Projects;
}

function CreateTeamVacationsList (data)
{
    var Vacations = '';
    for (var x= 0;x<data.length;x++)
    {
        Vacations += '<div class="Vacation">'+data[x].StartDate+' - '+data[x].EndDate+'</div>';
    }
    return Vacations;
}

function CompareMemberProjects(a,b) {
    if (a.StartDate.getTime() < b.StartDate.getTime())
        return -1;
    if (a.StartDate.getTime() > b.StartDate.getTime())
        return 1;
    return 0;
}