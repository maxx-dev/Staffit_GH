
<div id="ControlPanel">

   
    <div class="Controls">

        <input class="ProjectTitle" placeholder="Title" type="text">
        <div class="TimeControl">
        <label>Start Date:</label>
        <input id="StartSearchDate" type="date">
        <label>End Date:</label>
        <input id="EndSearchDate" type="date">
        </div>

        <div class="Filter">

            <img data-state='0' class="Research" src="img/icons/filter-rs-off.svg">
            <img data-state='0' class="Ixd" src="img/icons/filter-ixd-off.svg">
            <img data-state='0' class="Vd" src="img/icons/filter-vd-off.svg">
            <img data-state='0' class="Dev" src="img/icons/filter-dev-off.svg">

        </div>

        <!--<div data-state="0" class="Vacations">OFF</div>!-->
        <!--<div data-state="0" class="Projects">OFF</div>!-->

        <div class="QuickSearchRes">

            <div class="QuickBox">
                <div class="QuickAvailable"></div>
                <label>Available</label>
            </div>

            <div class="QuickBox">
                <div class="QuickPAvailable"></div>
                <label>Busy</label>
            </div>

            <div class="QuickBox">
                <div class="QuickUnAvailable"></div>
                <label>Unavailable</label>
            </div>


        </div>
       </div>

</div>

<div id="Content">

    <div class="AvailableCont">


    </div>



    <div class="UnAvailableCont">
        <div data-state='0' class="Displayer">
            <label>Not Available<span></span></label>
            <img src="img/icons/na-closed.svg">
        </div>

        <div class="AvailabilitySepLine"></div>
    </div>


</div>

<div id="SelectedCont">
    <div class="SelectedButton">Save Project</div>
</div>


<div class="SelectedLayer"></div>
<div class="SelectedConfirm">


    <div class="Title"><input type="text"></div>
    <div class="TimeRange"></div>
    <div class="TeamMember"></div>
    <textarea class="Notes"></textarea>
    <div class="SendMail"></div>
    <label class="SendMailLabel">Send Mail</label>
    <div class="Quit">Quit</div>
    <div class="Confirm">Confirm</div>

</div>

