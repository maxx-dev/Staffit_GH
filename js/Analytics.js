
function LoadAnalyticsView ()
{
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "getProjects.php",
        data: {ProjectType:ProjectType},
        success: function(data){


            Data = ProcessProjects(data);
            console.log(Data);
            ShowAnalytics();
            ReloadAnalyticsDom();
        }
    });
}

function ReloadAnalyticsDom ()
{

    $('.ProjectsOverview').find('.Project').click(function(){

        if ( $(this).attr('data-state') == 0)
        {
            $(this).find('.Displayer').attr('src','img/icons/na-opened.png');
            $(this).attr('data-state','1');
            $(this).find('.Team').show();
            $(this).css('height',80);

        }
        else
        {
            $(this).find('.Displayer').attr('src','img/icons/na-closed.png');
            $(this).attr('data-state','0');
            $(this).find('.Team').hide();
            $(this).css('height',20);
        }
    })



}

function ShowAnalytics ()
{
    for ( s in Data)
    {
        $('.ProjectsOverview').append('<div data-state="0" class="Project">' +
            '<img class="Displayer" src="/img/icons/na-closed.png">' +
            '<div class="Name">'+Data[s].Name+'</div>' +
            '<div class="Team">'+CreateTeamMember(Data[s].Team)+'</div>'+
            '</div>')
    }

}