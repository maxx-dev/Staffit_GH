

$(document).ready(function(){

    InitData ();



})


function ReloadDom ()
{
    $('.UserTile').find('.Edit').click(function(){


        if ( $(this).parent().attr('data-expand') == '0')
        {
            $(this).parent().animate({height:230});
            $(this).parent().attr('data-expand','1');
        }
        else
        {
            $(this).parent().animate({height:115});
            $(this).parent().attr('data-expand','0');
        }

    })
}

function InitData ()
{
    $.ajax({
        type: "POST",
        dataType: 'json',
        url: "GetData.php",
        data: {},
        success: function(data){

            var data = ProcessData(data);
            console.log(data);

            for (x in data)
            {
                CreateAvailable (1,data[x]);
            }

            ReloadDom ();
        }

    });
}


function CreateAvailable (Availability,data)
{

    var Skills = CheckSkills(data.Research,data.UX,data.Dev,data.Design);
    var VacationsString = CheckVacations(data);
    var ProjectsString = CheckProjects(data);

    $('#BContent').append('' +
        '<div data-expand="0" data-id="'+data.ID+'" class="UserTile">' +
        '<div class="SkillsCont">' +
        '<div style="display:'+Skills.Research+'" class="Skill"><img src="img/icons/skills-rs.svg"></div>' +
        '<div style="display:'+Skills.UX+'" class="Skill"><img src="img/icons/skills-ixd.svg"></div>' +
        '<div style="display:'+Skills.Dev+'" class="Skill"><img src="img/icons/skills-dev.svg"></div>' +
        '<div style="display:'+Skills.Design+'" class="Skill"><img src="img/icons/skills-vd.svg"></div>' +
        '</div>' +
        '<img class="MemberImg" style="opacity:'+Availability+'" src="'+data.URL+'">' +
        '<div class="Name"><div>'+data.LastName[0]+' '+data.FirstName+'</div></div>' +
        '<div class="Details">'+VacationsString+ProjectsString+'</div>' +
        '<div class="Edit">+</div>' +
        '</div>');
}


function CheckSkills (research,ux,dev,design)
{

    if (research == '1') {research = 'block';}
    else { research = 'none';}

    if (ux == '1') {ux = 'block';}
    else { ux = 'none';}

    if (dev == '1') {dev = 'block';}
    else { dev = 'none';}

    if (design == '1') {design = 'block';}
    else { design = 'none';}

    return { 'Research': research, 'UX': ux, 'Dev': dev,'Design': design}
}

function CheckVacations (member)
{
    var String = '';
    for (s in member.vacations)
    {
        if (member.vacations[s].overlaap)
        {
            //String += '<span class="Busy">'+member.vacations[s].StartDate+' - '+member.vacation[s].EndDate+'</span>';
            //String += '<span class="Busy"><img src="img/icons/plant2.png">'+member.vacations[s].StartDate+' - '+member.vacations[s].EndDate+'</span>';
        }
        else
        {
            //String += '<span class="Free"><img src="img/icons/plant2.png">'+member.vacations[s].StartDate+' - '+member.vacations[s].EndDate+'</span>';
        }
    }
    return String;
}

function CheckProjects (member)
{
    var String = '';

    var Year = 1000*60*60*24*365;
    var UI_Width = 180;
    var Now = new Date();

    var Start = new Date();
    Start.setDate(1);
    Start.setMonth(0);
    Start.setHours(0);
    Start.setMinutes(0);
    Start.setSeconds(0);
    Start.setMilliseconds(0);

    Now = ((Now.getTime() -Start.getTime())/ Year) *UI_Width;
    //console.log(Start.getTime())
    //console.log(Year);

    for (s in member.projects)
    {
        var StartDate = SQLToDate(member.projects[s].StartDate);
        var EndDate   = SQLToDate(member.projects[s].EndDate);

        var Dur =  EndDate.getTime() - StartDate.getTime();
        var Dur_Rel = Dur/Year;
        var Dur_Abs = Dur_Rel *UI_Width;
        var Left = StartDate.getTime() - Start.getTime();
        var Left_Rel = Left /Year;
        var Left_Abs =  Left_Rel *UI_Width;

        console.log(Left);

        //String += '<span class="Free"><img src="img/icons/skills-dev.svg"> '+member.projects[s].StartDate+' - '+member.projects[s].EndDate+'</span>';
        String += '<div class="DurationCont">' +
            '<div style=" left:'+Left_Abs+'px; width:'+Dur_Abs+'px" class="Duration"></div>' +
            '<div style=" left:'+Now+'px;" class="Now"></div>' +
            '</div>';

    }
    return String;
}



function ProcessData (data)
{
    var dataP = data[0];
    var dataV = data[1];
    var NewData = [];
    //console.log(data[0]);

    // PROJECTS
    for (s in dataP)
    {
        var Check = false;
        for (p in NewData)
        {
            if (dataP[s]['ID'] == NewData[p].ID)
            {
                //console.log('DOUBLE');
                Check = true;
            }
        }

        if (Check == false)
        {
            NewData.push(new Staff(dataP[s]))
        }
        else
        {
            NewData[NewData.length-1].projects.push(new Project(dataP[s].Name,dataP[s].StartDate,dataP[s].EndDate))
        }
    }

    // VACATIONS
    for (s in NewData)
    {
        for (p in dataV)
        {
            if (NewData[s].ID == dataV[p].Staff_ID)
            {
                NewData[s].vacations.push(new Vacation(dataV[p].StartDate,dataV[p].EndDate));
            }
        }
    }

    return NewData;
}

function SQLToDate (String)
{
    return new Date(String);
}

function Project (Name,Start,End)
{
    this.Name = Name;
    this.StartDate = Start;
    this.EndDate = End;
    return this;
}

function Vacation (Start,End)
{
    this.StartDate = Start;
    this.EndDate = End;
    return this;
}

function Staff (data)
{
    this.ID = data.ID;
    this.FirstName = data.FirstName;
    this.LastName = data.LastName;
    this.URL = data.URL;
    this.projects = [new Project(data.Name,data.StartDate,data.EndDate)];
    this.vacations = [];
    this.Dev = data.Dev;
    this.Design = data.Design;
    this.UX = data.UX;
    this.Research = data.Research
}