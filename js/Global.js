
// HELPER
function CreateSepWrapper (Num,height)
{
    var Wrapper = '';
    for (var x= 0;x<Num;x++)
    {
        Wrapper += '<div style="height:'+height+'px" class="SepWrapper"></div>';
    }

    return Wrapper;
}

function CreateTeamMember (Team)
{
    var Wrapper = '';
    for (var x= 0;x<Team.length;x++)
    {
        Wrapper += '<div class="Member">' +
            '<img src="'+Team[x].URL+'"> ' +
            '</div>';
    }

    return Wrapper;
}


function StringToDate (String)
{
    while (String.search("-") != -1) // DUE TO IPAD DATE FUNCTION BUG WITH '-'
    {
        String = String.replace("-","/");
    }
    return new Date(String);
}

Date.prototype.getWeek = function (dowOffset) {

    dowOffset = typeof(dowOffset) == 'int' ? dowOffset : 0; //default dowOffset to zero
    var newYear = new Date(this.getFullYear(),0,1);
    var day = newYear.getDay() - dowOffset; //the day of week the year begins on
    day = (day >= 0 ? day : day + 7);
    var daynum = Math.floor((this.getTime() - newYear.getTime() -
        (this.getTimezoneOffset()-newYear.getTimezoneOffset())*60000)/86400000) + 1;
    var weeknum;
    //if the year starts before the middle of a week
    if(day < 4) {
        weeknum = Math.floor((daynum+day-1)/7) + 1;
        if(weeknum > 52) {
            nYear = new Date(this.getFullYear() + 1,0,1);
            nday = nYear.getDay() - dowOffset;
            nday = nday >= 0 ? nday : nday + 7;
            /*if the next year starts before the middle of
             the week, it is week #1 of that year*/
            weeknum = nday < 4 ? 1 : 53;
        }
    }
    else {
        weeknum = Math.floor((daynum+day-1)/7);
    }
    return weeknum;
};


function GetProject (ID)
{
    for (s in Data)
    {
        if (Data[s].ID == ID)
        {
            return Data[s];
        }
    }
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
    this.projects = [new Project(data.Name,StringToDate(data.StartDate),StringToDate(data.EndDate))];
    this.vacations = [];
    this.Dev = data.Dev;
    this.Design = data.Design;
    this.UX = data.UX;
    this.Research = data.Research
}



// USED IN TEAM AND NEW
function ProcessTeam (data)
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
            NewData[NewData.length-1].projects.push(new Project(dataP[s].Name,StringToDate(dataP[s].StartDate),StringToDate(dataP[s].EndDate)))
        }
    }

    // VACATIONS
    for (s in NewData)
    {
        for (p in dataV)
        {
            if (NewData[s].ID == dataV[p].Staff_ID)
            {
                NewData[s].vacations.push(new Vacation(StringToDate(dataV[p].StartDate),StringToDate(dataV[p].EndDate)));
            }
        }
    }


    NewData.sort(Compare);
    //NewData.reverse();

    return NewData;
}


function Compare(a,b) {
    if (a.FirstName < b.FirstName)
        return -1;
    if (a.FirstName > b.FirstName)
        return 1;
    return 0;
}

// USED IN PROJECTS AND OVERVIEW
function ProcessProjects (data)
{
    var Projects = data[0];
    var Members = data[1];

    for (var s in Projects)
    {
        Projects[s].StartDate = StringToDate(Projects[s].StartDate);
        Projects[s].EndDate = StringToDate(Projects[s].EndDate);
    }

    for (var s in Members)
    {
        for (var p in Projects)
        {
            if (Members[s].P_ID == Projects[p].ID)
            {
                if (!Projects[p].Team)
                {
                    Projects[p].Team = [];
                }
                Projects[p].Team.push(new StaffProject(Members[s]));
            }
        }
    }
    console.log(Projects);
    return Projects;
}