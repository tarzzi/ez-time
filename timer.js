 
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
$('.continue').click(function () {
    continueTimer();
})
$('.delete:button').click(function () {
    console.log("pressed");
    deleteItem(this);
})

var x = null;
var timer = 0;
var minutes = 0;
var hours = 0;
var timeNow = null;
var taskname = "";
var items_array = [];
resetTimer();

function deleteItem(elem){
    console.log("delete");
    $(elem).parent().parent().remove();
}
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
    }, 50);
}

function stopTimer(){
    if($('#taskname').val() != ""){
        $('#start').prop('disabled', false);
        $('#stop').prop('disabled', true);
        
        let taskname = $('#taskname').val()
        let taskduration = hours+":"+minutes+":"+timer;
        createItem(taskname, taskduration);

        let tdr = parseTime();
        createRow(taskname, tdr);

        $('#taskname').val("");
        resetTimer();
        clearInterval(x);
    }
}

function createItem(taskname, duration){
    // Add task item to item array
    let taskduration = duration;
    let item = {
        name: taskname,
        duration: taskduration
    }
    items_array.push(item);
    console.log("create item");
}

function createRow(taskname, duration){
    let itemrow = $('<div>').addClass('item item-grid');
    let itemname = $('<input>').addClass('item-name input-neutral');
    let itemduration = $('<input>').addClass('item-duration input-neutral');
    let options = createOptions();
    itemname.val(taskname);
    itemduration.val(duration);
    itemrow.append(itemname);
    itemrow.append(itemduration);
    itemrow.append(options);
    let header = $('#items-list-header');
    header.append(itemrow);
    console.log("create row");
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
    deletebutton.attr('onclick', 'deleteItem(this)');
    options.append(continuebutton);
    options.append(deletebutton);
    return options;
}

function saveItems(){
    // Store

    var divs_json = JSON.stringify(items_array);
    console.log(divs_json);
    localStorage.setItem("data", divs_json);

}
function loadItems(){
    // Retrieve
    var div_data = JSON.parse(localStorage.getItem("data"));
    console.log(div_data);
    $('#items-list-header').html(div_data);
}