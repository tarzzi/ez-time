 
$('#start').click(function () {
    $('#start').prop('disabled', true);
    $('#stop').prop('disabled', false);
    startTimer();
})
$('#stop').click(function () {
    stopTimer();
})
$('#save').click(function () {
    saveItems();
})
$('#load').click(function () {
    loadItems();
})


var x = null;
var timer = 0;
var minutes = 0;
var hours = 0;
var timeNow = null;
var taskname = "";
resetTimer();

function startTimer(){
    
    console.log("start");
// Update the count down every 1 second
    x = setInterval(function () {
        if(timer < 59){
            timer += 1;
            $('#seconds').html(timer);
        }
        else{
            timer = 0;
            if(minutes < 59){
                minutes += 1;
                $('#minutes').html(minutes);
            }
            else{
                hours += 1;
                minutes = 0;
                $('#hours').html(hours);
                $('#minutes').html(minutes);
            }
            $('#seconds').html(timer);
        }
    }, 200);
}

function stopTimer(){
    if($('#taskname').val() != ""){
        $('#start').prop('disabled', false);
        $('#stop').prop('disabled', true);
        createRow();
        $('#taskname').val("");
        resetTimer();
        clearInterval(x);
    }
}

function resetTimer(){
    console.log("reset");
    timer = 0;
    minutes = 0;
    hours = 0;
    $('#seconds').html(timer);
    $('#minutes').html(minutes);
    $('#hours').html(hours);
}

function continueTimer(){
    console.log("continue");
}


function createRow(){
    $('taskname').html("");
    console.log("create");
    let itemrow = $('<div>').addClass('item item-grid');
    let itemname = $('<input>').addClass('item-name input-neutral');
    let itemduration = $('<input>').addClass('item-duration input-neutral');
    let options = createOptions();
    itemname.val($('#taskname').val());
    itemduration.val(parseTime());
    itemrow.append(itemname);
    itemrow.append(itemduration);
    itemrow.append(options);
    let header = $('#items-list-header');
    itemrow.insertAfter(header);
} 

function parseTime(){
    let time = "";
    if(hours > 0){ 
        time += hours + "h ";
    }
    if(minutes > 0){
        time += minutes + "m ";
    }
    time += timer + "s";
    return time;
}

function createOptions(){
    console.log("create options");
    let options = $('<div>').addClass('item-options');
    let continuebutton = $('<button>').addClass('continue btn-small');
    let deletebutton = $('<button>').addClass('delete btn-small');
    continuebutton.html("Continue");
    deletebutton.html("Delete");
    options.append(continuebutton);
    options.append(deletebutton);
    return options;
}

function saveItems(){
    // Store
    var divs = document.getElementsByClassName("item");
    var divs_data = [];
    for(var i = 0; i < divs.length; i++){
        var item = divs[i];
        var data = item.innerHTML;
        divs_data.push(data);
    }
    var divs_json = JSON.stringify(divs_data);
    console.log(divs_json);
    localStorage.setItem("data", divs_json);

}
function loadItems(){
    // Retrieve
    var divs = JSON.parse(localStorage.getItem("data"));
    console.log(divs);
    for(var i = 0; i < divs.length; i++){
        var div = divs[i];
        div.insertAfter($('#items-list-header'));
    }
}