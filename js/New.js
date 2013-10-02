var WeekDays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var Months = ['January','February','March','April','Mai','June','July','August','September','October','November','December'];

Vacations = true;
Projects = true;
SearchStartDate = false;
SearchEndDate = false;

var SwipeControlPanel = 0;
var SwipeSeletedCont = 0;


function initNew ()
{


    $('#ControlPanel, #SelectedCont, #HeaderBar').bind('touchmove',function(e) {
            e.preventDefault();
        }
    );

    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {

    }



    $$('body').swipeRight(function(e){

        if (SwipeControlPanel == 0 && SwipeSeletedCont == 0)
        {
            e.preventDefault();
            $('#ControlPanel').css('left','0%');
            SwipeControlPanel = 1;
        }
    })

    $$('body').swipeLeft(function(e){

        if (SwipeControlPanel == 0 && SwipeSeletedCont == 0)
        {
            e.preventDefault();
            $('#SelectedCont').css('left','0%');
            SwipeSeletedCont = 1;
        }
    })

    $$('#ControlPanel').swipeLeft(function(e){

        e.preventDefault();
        $('#ControlPanel').css('left','-100%');
        SwipeControlPanel = 0;
    })

    $$('#SelectedCont').swipeRight(function(e){

        e.preventDefault();
        $('#SelectedCont').css('left','100%');
        SwipeSeletedCont = 0;
    })




    $('.DateContainer').append(Today);

    $('.Filter').children().click(function(){

        var Type = $(this).attr('class');
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
            StartSearch();
        }
        else
        {
            var src = $(this).attr('src');
            src = src.replace("-off","");
            $(this).attr('src', src);
            //$(this).css('-webkit-filter','grayscale(0%)');
            $(this).attr('data-state', 1);
            StartSearch();
        }
    });

    // IPAD 1 FALLBACK INSTEAD OFF CHANGE EVENT
    $('#StartSearchDate').blur(function(e) {

        var Value = $(this).val();
        Value = Value.replace('-','/'); // IOS BUG
        Value = Value.replace('-','/'); // IOS BUG
        var date = StringToDate(Value);
        SearchStartDate = date;
        StartSearch();

    });

    // IPAD 1 FALLBACK INSTEAD OFF CHANGE EVENT
    $('#EndSearchDate').blur(function(e) {

        var Value = $(this).val();
        Value = Value.replace('-','/'); // IOS BUG
        Value = Value.replace('-','/'); // IOS BUG
        var date = StringToDate(Value);
        SearchEndDate = date;
        StartSearch();
    });

    $('.SelectedButton').click(function(){

        $('.SelectedLayer').show();
        $('.SelectedConfirm').show();
        var Selected = $('#SelectedCont').html();
        $('.SelectedConfirm').find('.TeamMember').html(Selected);
        $('.SelectedConfirm').find('.TeamMember').find('.SelectedButton').hide();
        $('.SelectedConfirm').find('.TeamMember').find('.Delete').hide();
        $('.SelectedConfirm').find('.TimeRange').html(SearchStartDate.getDate()+' '+Months[SearchStartDate.getMonth()]+' '+SearchStartDate.getFullYear()+' - '+SearchEndDate.getDate()+' '+Months[SearchEndDate.getMonth()]+' '+SearchEndDate.getFullYear());
        $('.SelectedConfirm').find('input').focus();
    })

    $('.SelectedConfirm').find('.Quit').click(function(){

        $('.SelectedConfirm').hide();
        $('.SelectedLayer').hide();
    })

    $('.SelectedLayer').click(function(){

        $('.SelectedConfirm').hide();
        $('.SelectedLayer').hide();
    })

    $('.SelectedConfirm').find('.Confirm').click(function(){

        var Project = $('.SelectedConfirm').find('.Title').find('input').val();
        var TimeRange = $('.SelectedConfirm').find('.TimeRange').html();
        var Team = $('.SelectedConfirm').find('.TeamMember').html();
        var Notes = $('.SelectedConfirm').find('.Notes').val();
        $('.SelectedConfirm').hide();
        $('.SelectedLayer').hide();

        $.ajax({
            type: "POST",
            url: 'sendMail.php',
            data: {Project:Project,TimeRange:TimeRange,Team:Team,Notes:Notes},
            success: function(data){

                console.log(data);
                // alert('CONFIRMED');

            },
            error: function(data) {

                alert('ERROR');
                console.log(data);
            }
        });


    })


    $('.SendMail').click(function(){

        if ($(this).attr('data-state') == '0')
        {
            $(this).css('background-image','url(img/icons/close.svg)');
            $(this).attr('data-state','1');
        }
        else
        {
            $(this).css('background-image','');
            $(this).attr('data-state','0');
        }
    })

    $('.UnAvailableCont').find('.Displayer').click(function(){

        if ( $(this).attr('data-state') == '0')
        {
            $(this).find('img').attr('src','img/icons/na-opened.svg');
            $(this).attr('data-state','1');
            $('.UnAvailableCont').find('.UnAvailable').show();
        }
        else
        {
            $(this).find('img').attr('src','img/icons/na-closed.svg');
            $(this).attr('data-state','0');
            $('.UnAvailableCont').find('.UnAvailable').hide();
        }

    })


}

function LoadNewView()
{
    $.ajax({
        type: "POST",
        dataType: 'json',
        url: 'getTeam.php',
        data: {},
        success: function(data){

            var data = ProcessTeam(data);
            console.log(data[0].projects[0].StartDate);

            for (x in data)
            {
                CreateAvailable (1,data[x]);
            }


            $('.AvailableCont').css('opacity', 1);
        },
        error: function(data) {

            alert('ERROR');
            console.log(data);
        }
    });
}

function StartSearch()
{
    if (SearchStartDate && SearchEndDate) // NO SEARCH WITHOUT DATE!!!
    {

        $('.Available').remove();
        $('.UnAvailable').remove();
        $('.Selected').remove();
        //console.log(SearchStartDate.getTime()+' '+SearchEndDate.getTime());

        $.ajax({
            type: "POST",
            dataType: 'json',
            url: 'getTeam.php',
            data: {},
            success: function(data){

                var data = ProcessTeam(data);
                console.log(data)

                // DETAIL CONTROLS RIGHT NOW NOT USED IN SEARCH
                var Dev =       parseInt($('.Filter').find('.Dev').attr('data-state'));
                var Ixd =       parseInt($('.Filter').find('.Ixd').attr('data-state'));
                var Research =  parseInt($('.Filter').find('.Research').attr('data-state'));
                var Vd =        parseInt($('.Filter').find('.Vd').attr('data-state'));

                for (x in data)
                {
                    data[x].Available = 0;

                    for (v in data[x].vacations)
                    {
                        console.log(data[x].vacations[v].EndDate)
                        //alert(data[x].vacations[v].startDate);

                        // VACACTIONS
                        var DB_EndDate =   data[x].vacations[v].EndDate;
                        var DB_StartDate = data[x].vacations[v].StartDate;


                        var Overlaap = false;
                        data[x].vacations[v].overlaap = false;
                        if (SearchStartDate.getTime() < DB_StartDate.getTime() && SearchEndDate.getTime() > DB_StartDate.getTime() )
                        {
                            //console.log('OVERLAAP EARLIER');
                            Overlaap = true;
                            data[x].vacations[v].overlaap = true;
                        }

                        if (SearchStartDate.getTime() < DB_EndDate.getTime() && SearchEndDate.getTime() > DB_EndDate.getTime())
                        {
                            //console.log('OVERLAAP LATER');
                            Overlaap = true;
                            data[x].vacations[v].overlaap = true;
                        }

                        if (SearchStartDate.getTime() < DB_StartDate.getTime() && SearchEndDate.getTime() > DB_EndDate.getTime())
                        {
                            //console.log('OVERLAAP TOTAL');
                            Overlaap = true;
                            data[x].vacations[v].overlaap = true;
                        }

                        if (SearchStartDate.getTime() > DB_StartDate.getTime() && SearchEndDate.getTime() < DB_EndDate.getTime())
                        {
                            //console.log('OVERLAAP WITHIN');
                            Overlaap = true;
                            data[x].vacations[v].overlaap = true;
                        }

                        if (Overlaap)
                        {
                            if (Vacations)
                            {
                            data[x].Available -= 3;
                            }
                        }

                    }


                    for (v in data[x].projects)
                    {
                        //console.log(data[x].projects[v])
                        //console.log(StringToDate(data[x].projects[v].startDate));
                        var DB_EndDate =  data[x].projects[v].EndDate;
                        var DB_StartDate = data[x].projects[v].StartDate;

                        var Overlaap = false;
                        if (SearchStartDate.getTime() < DB_StartDate.getTime() && SearchEndDate.getTime() > DB_StartDate.getTime() )
                        {
                            //console.log('OVERLAAP EARLIER');
                            Overlaap = true;
                            data[x].projects[v].overlaap = true;
                        }

                        if (SearchStartDate.getTime() < DB_EndDate.getTime() && SearchEndDate.getTime() > DB_EndDate.getTime())
                        {
                            //console.log('OVERLAAP LATER');
                            Overlaap = true;
                            data[x].projects[v].overlaap = true;
                        }

                        if (SearchStartDate.getTime() < DB_StartDate.getTime() && SearchEndDate.getTime() > DB_EndDate.getTime())
                        {
                            console.log('OVERLAAP TOTAL');
                            Overlaap = true;
                            data[x].projects[v].overlaap = true;
                        }

                        if (SearchStartDate.getTime() > DB_StartDate.getTime() && SearchEndDate.getTime() < DB_EndDate.getTime())
                        {
                            //console.log('OVERLAAP WITHIN');
                            Overlaap = true;
                            data[x].projects[v].overlaap = true;
                        }

                        if (Overlaap)
                        {
                            if (Projects)
                            {
                            data[x].Available -= 1;
                            }
                        }
                    }

                    data[x].Skill = 0;

                    if (Dev)
                    {
                        if (data[x].Dev == '0')
                        {
                            data[x].Skill = -1;
                        }
                    }

                    if (Research)
                    {
                        if (data[x].Research == '0')
                        {
                            data[x].Skill = -1;
                        }
                    }

                    if (Ixd)
                    {
                        if (data[x].UX == '0')
                        {
                            data[x].Skill = -1;
                        }
                    }

                    if (Vd)
                    {
                        if (data[x].Design == '0')
                        {
                            data[x].Skill = -1;
                        }
                    }

                }
                console.log(data);




                var Available = 0;
                var PAvailable = 0;
                var UnAvailable = 0;
                var WrongSkills = 0;

                for (x in data)
                {
                    //console.log(data[x].Skill);
                    if (data[x].Skill == 0)
                    {
                        if (data[x].Available == 0) //AVAILABLE
                        {
                            CreateAvailable (1,data[x])
                            Available++;
                        }

                        if (data[x].Available <= -3) // NOT AVAILABLE
                        {
                            CreateUnAvailable (0.2,data[x])
                            UnAvailable++;
                        }
                    }
                    else
                    {
                        //alert ('NOT THE RIGHT SKILL');
                        WrongSkills++;
                    }
                }

                for (x in data)
                {
                    if (data[x].Skill == 0)
                    {
                        if (data[x].Available == -1 || data[x].Available == -2) // PARTIALLY AVAILABLE
                        {
                            CreatePAvailable (0.4,data[x])
                            PAvailable++;
                        }
                    }
                }

                // ADD TO QUICK RES IN CONTROL PANEL
                $('.QuickSearchRes').find('.QuickAvailable').html(Available);
                $('.QuickSearchRes').find('.QuickPAvailable').html(PAvailable);
                $('.QuickSearchRes').find('.QuickUnAvailable').html(UnAvailable);
                $('.QuickSearchRes').find('.QuickWrongSkills').html(WrongSkills);
                ReloadDom();

                $('.AvailableCont').css('opacity', 1);

            }

        });



    }
}

function CreateAvailable (Availability,data)
{
    console.log(data);

    var Skills = CheckSkills(data.Research,data.UX,data.Dev,data.Design);
    var VacationsString = CheckVacations(data);
    var ProjectsString = CheckProjects(data);

    //console.log(Skills);
   $('.AvailableCont').append('' +
        '<div data-type="Available" data-selected="0" data-id="'+data.ID+'" class="Available">' +
        '<div class="Front">' +
        '<div class="SkillsCont">' +
        '<div style="display:'+Skills.Research+'" class="Skill"><img src="img/icons/skills-rs.svg"></div>' +
        '<div style="display:'+Skills.UX+'" class="Skill"><img src="img/icons/skills-ixd.svg"></div>' +
        '<div style="display:'+Skills.Dev+'" class="Skill"><img src="img/icons/skills-dev.svg"></div>' +
        '<div style="display:'+Skills.Design+'" class="Skill"><img src="img/icons/skills-vd.svg"></div>' +
        '</div>' +
        '<img class="MemberImg" style="opacity:'+Availability+'" src="'+data.URL+'">' +
        '<div class="Name"><div>'+data.FirstName+' '+data.LastName[0]+'</div></div>' +
        '<img style="display:none" class="DetailsButton" src="img/icons/Details.svg">' +
        '</div>'+
        '<div class="Back">' +
        '<div class="Details">'+VacationsString+ProjectsString+'</div>' +
        '</div>'+
        '</div>');

}


function CreatePAvailable (Availability,data)
{
    var Skills = CheckSkills(data.Research,data.UX,data.Dev,data.Design);
    var VacationsString = CheckVacations(data);
    var ProjectsString = CheckProjects(data);

    //console.log(Skills);
    $('.AvailableCont').append('' +
        '<div data-type="PAvailable" data-selected="0" data-id="'+data.ID+'" class="Available">' +
        '<div style="opacity:'+Availability+'" class="Front">' +
        '<div class="SkillsCont">' +
        '<div style="display:'+Skills.Research+'" class="Skill"><img src="img/icons/skills-rs.svg"></div>' +
        '<div style="display:'+Skills.UX+'" class="Skill"><img src="img/icons/skills-ixd.svg"></div>' +
        '<div style="display:'+Skills.Dev+'" class="Skill"><img src="img/icons/skills-dev.svg"></div>' +
        '<div style="display:'+Skills.Design+'" class="Skill"><img src="img/icons/skills-vd.svg"></div>' +
        '</div>' +
        '<img class="MemberImg" src="'+data.URL+'">' +
        '<div class="Name"><div>'+data.LastName[0]+' '+data.FirstName+'</div></div>' +
        '<img class="DetailsButton" src="img/icons/Details.svg">' +
        '</div>'+
        '<div class="Back">' +
        '<div class="Details">'+VacationsString+ProjectsString+'</div>' +
        '</div>'+
        '</div>');
}

function CreateUnAvailable (Availability,data)
{
    var Skills = CheckSkills(data.Research,data.UX,data.Dev,data.Design);
    var VacationsString = CheckVacations(data);
    var ProjectsString = CheckProjects(data);

    $('.UnAvailableCont').append('' +
        '<div data-type="UnAvailable" data-selected="0" data-id="'+data.ID+'" class="UnAvailable">' +
        '<div style="opacity:'+Availability+'" class="Front">' +
        '<div class="SkillsCont">' +
        '<div style="display:'+Skills.Research+'" class="Skill"><img src="img/icons/skills-rs.svg"></div>' +
        '<div style="display:'+Skills.UX+'" class="Skill"><img src="img/icons/skills-ixd.svg"></div>' +
        '<div style="display:'+Skills.Dev+'" class="Skill"><img src="img/icons/skills-dev.svg"></div>' +
        '<div style="display:'+Skills.Design+'" class="Skill"><img src="img/icons/skills-vd.svg"></div>' +
        '</div>' +
        '<img class="MemberImg" src="'+data.URL+'">' +
        '<div class="Name"><div>'+data.LastName[0]+' '+data.FirstName+'</div></div>' +
        '<img class="DetailsButton" src="img/icons/Details.svg">' +
        '</div>'+
        '<div class="Back">' +
        '<div class="Details">'+VacationsString+ProjectsString+'</div>' +
        '</div>'+
        '</div>');
}


// ********EVALUATE SEARCH RES START********** //


function CheckVacations (member)
{
    var String = '';
    for (s in member.vacations)
    {
        if (member.vacations[s].overlaap)
        {
            var StartMonth = member.vacations[s].StartDate.getMonth()+1;
            var EndMonth =   member.vacations[s].EndDate.getMonth()+1
            //String += '<span class="Busy">'+member.vacations[s].StartDate+' - '+member.vacation[s].EndDate+'</span>';
            String += '<span class="Busy">'+StartMonth+'/'+member.vacations[s].StartDate.getDate()+' - '+EndMonth+'/'+member.vacations[s].EndDate.getDate()+'</span>';
        }
        else
        {
            //String += '<span class="Free">'+member.vacations[s].StartDate+' - '+member.vacations[s].EndDate+'</span>';
        }
    }
    return String;
}

function CheckProjects (member)
{
    var String = '';
    for (s in member.projects)
    {
        if (member.projects[s].overlaap)
        {
            //String += '<span class="Busy">'+member.projects[s].StartDate+' - '+member.projects[s].EndDate+'</span>';
            String += '<span class="Busy">'+member.projects[s].Name+'</span>';
        }
        else
        {
            //String += '<span class="Free">'+member.projects[s].StartDate+' - '+member.projects[s].EndDate+'</span>';
            //String += '<span class="Free">'+member.projects[s].Name+'</span>';
        }
    }
    return String;
}

// ********EVALUATE SEARCH RES END********** //

function ReloadDom ()
{
    // SELECT
    $('.Available').click(function(e){

        var Parent = $(this);

        if ($(Parent).attr('data-selected') == 1)
        {
            if ($(Parent).attr('data-type') == 'PAvailable')
            {
                $(Parent).find('.Front').css('opacity','0.4');
            }
            $(Parent).attr('data-selected',0);
            $(Parent).find('.Name').css('background-color','rgba(41, 39, 38,0.7)');

            var ID = $(Parent).attr('data-id');
            $('.Selected[data-id="'+ID+'"]').remove();
        }
        else
        {
            //console.log('ADD TO SELECTION');
            $(Parent).attr('data-selected',1);
            var ID = $(Parent).attr('data-id');
            $(Parent).find('.Front').css('opacity','1');
            $(Parent).find('.Name').css('background-color','rgba(255,255,255,0.7)');
            $(Parent).find('.MemberImg').css('-webkit-filter','grayscale(0%)');
            var html = $(Parent).html();

            $(Parent).find('.Name').css('background-color','rgba(145, 196, 108,0.7)');

            $('#SelectedCont').append('<div data-id="'+ID+'" class="Selected">'+html+'<img class="Delete" src="img/icons/delete.svg"></div>');
        }
    });

    // DESELECT
    $('#SelectedCont').on( 'click', '.Selected', function(){

        var ID = $(this).attr('data-id')
        $('.Available[data-id="'+ID+'"]').attr('data-selected',0);

        $('.Available[data-id="'+ID+'"]').find('.Name').css('background-color','rgba(41, 39, 38,0.7)');
        $(this).remove();
    });

    // FLIPPING
    $('.Available, .UnAvailable').find('.Name').click(function(e){


        if ($(this).parent().parent().attr('data-type')  != 'Available')
        {
            e.stopPropagation();
            $(this).parent().parent().css('-webkit-transform','rotateY(180deg)');

        }
    });

    $('.Available, .UnAvailable').find('.Details').click(function(e){
        e.stopPropagation();
        $(this).parent().parent().css('-webkit-transform','rotateY(0deg)');
       // $(this).parent().parent().css('width','300px');
    })



}

function ResetSearch ()
{
    $('.Available').remove();
    $('.UnAvailable').remove();
    $('.Selected').remove();
    $('#StartSearchDate').val('');
    $('#EndSearchDate').val('');

    $('.Filter').children(':nth-child(1)').attr('src','img/icons/filter-dev-off.svg');
    $('.Filter').children(':nth-child(2)').attr('src','img/icons/filter-ixd-off.svg');
    $('.Filter').children(':nth-child(3)').attr('src','img/icons/filter-rs-off.svg');
    $('.Filter').children(':nth-child(4)').attr('src','img/icons/filter-vd-off.svg');
}

if (typeof window.DeviceMotionEvent != 'undefined') {
    // Shake sensitivity (a lower number is more)
    var sensitivity = 20;

    var x1 = 0, y1 = 0, z1 = 0, x2 = 0, y2 = 0, z2 = 0;
    window.addEventListener('devicemotion', function (e) {
        x1 = e.accelerationIncludingGravity.x;
        y1 = e.accelerationIncludingGravity.y;
        z1 = e.accelerationIncludingGravity.z;
    }, false);

    setInterval(function () {
        var change = Math.abs(x1-x2+y1-y2+z1-z2);

        if (change > sensitivity) {
            //alert('Shake!');
            ResetSearch();

        }

        // Update new position
        x2 = x1;
        y2 = y1;
        z2 = z1;
    }, 150);
}






// HELPER FUNCTIONS
