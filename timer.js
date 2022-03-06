// init
var x = null;
var timer = 0;
var minutes = 0;
var hours = 0;
var timeNow = null;
var taskname = "";
var items_array = [];
var item_id = 1;
var delete_confirm = false;
var continue_confirm = false;
var today = new Date().toLocaleDateString()
// Startup
//localStorage.clear();
resetTimer();
loadItems();

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
$('#clear').click(function () {
    resetLocalStorage();
})
$(document).click(function(event){
    if (event.target.closest(".confirm")){
        $('.resume').removeClass('resume');
        return
    }
    if( event.target.closest(".resume")){
        $('.confirm').removeClass('confirm'); 
        return
    }
    $('.confirm').removeClass('confirm'); 
    $('.resume').removeClass('resume');
  })

$('input.item-name').change(function(){
    //on item name change, update the item name in the items array
    let itemname = $(this).val();
    let itemid = $(this).parent().attr('id');
    let item = items_array.find(item => item.id == itemid);
    item.name = itemname;
    saveItems();
});

function startTimer(resume){
    if($('#taskname').val() == ""){
        $('#taskname').focus();
    }
    if(!resume){
        minutes = 0;
        hours = 0;
    }
// Update the count down every 1 second
    x = setInterval(function () {

        // Update timer every second
        timer += 1;
        if(timer < 10){
            $('#seconds').html("0" + timer);
        } else {
            $('#seconds').html(timer);
            if(timer > 59){
                timer = 0;
                minutes += 1;
                if(minutes < 10){
                    $('#minutes').html("0" + minutes);
                } else {
                    $('#minutes').html(minutes);
                    if(minutes > 59){
                        minutes = 0;
                        hours += 1;
                        if(hours < 10){
                            $('#hours').html("0" + hours);
                        } else {
                            $('#hours').html(hours);
                        }
                    }
                }
            }
        } 
    }, 1000);
}
function stopTimer(){
    if($('#taskname').val() != ""){
        $('#start').prop('disabled', false);
        $('#stop').prop('disabled', true);
        $('#taskname_label').text("Task name");
        if($('#items-list-header').hasClass('hide')){
            $('#items-list-header').removeClass('hide');
        }
        
        let taskname = $('#taskname').val()
        // create javascript object from input values, duration in seconds
        let taskduration = parseTime('toseconds');
        createItem(taskname, taskduration, today);
        // create row in items list
        createRow(taskname, taskduration, today);
        $('#taskname').val("");
        resetTimer();
        clearInterval(x);
    }
    else{
        $('#taskname').focus();
        $('#taskname_label').text("Insert task name here");
    }
}
function createItem(taskname, duration, startdate){
    // Add task item to item array
    let item = {
        id: item_id,
        name: taskname,
        duration: duration,
        date: startdate
    }
    items_array.push(item);
    saveItems();
}
function createRow(taskname, duration, startdate){
    let itemrow = $('<div>').addClass('item item-grid');
    itemrow.attr('id', item_id);
    let itemname = $('<input>').addClass('item-name input-neutral');
    let date = $('<div>').addClass('date');
    date.text(startdate);
    let options = createOptions();
    itemname.val(taskname);
    itemrow.append(itemname);
    itemrow.append(date);
    if(parseInt(duration)){
        duration_elem = parseTime('toelement', duration);
    } 
    itemrow.append(duration_elem);
    itemrow.append(options);
    let items_list_container = $('#items-list-container');
    
    item_id += 1;
    itemrow.addClass('hide');
    items_list_container.prepend(itemrow);
    // bit janky but functional :D
    let waiting = 0;
    let wait = setInterval(function () {
        if(waiting = 1){
            $('.hide').removeClass('hide');
            clearInterval(wait);
        }
        waiting += 1;
    }, 50);
} 
function createDuration(timeArray){
    if(!Array.isArray(timeArray)){
        timeArray = parseTime('')
    }
    let duration = $('<div>').addClass('duration');
    let timestr = "";
    if(timeArray[0] > 0){
        timestr += timeArray[0] + "h ";
    }
    if(timeArray[1] > 0){
        timestr += timeArray[1] + "m ";
    }
    if(timeArray[2] > 0){
        timestr += timeArray[2] + "s";
    }
    duration.html(timestr);
    return duration;

}
function resetTimer(){
    timer = 0;
    minutes = 0;
    hours = 0;
    $('#seconds').html(timer);
    $('#minutes').html(minutes);
    $('#hours').html(hours);
}
function continueTimer(elem){
    // continue timer from last item if confirmed
    if(elem.classList.contains('resume') && continue_confirm){
        $('#start').prop('disabled', true);
        $('#stop').prop('disabled', false);
        //resume timer from saved time, using element prop id and items_array
        let itemid = $(elem).parent().parent().attr('id');
        let item = items_array.find(item => item.id == itemid);
        let duration = item.duration;
        let name = item.name;
        $('#taskname').val(name);
        setItemValuesToTimer(duration);
        deleteItem(elem, "resume");
        startTimer(true);
    }
    // set current element to continue_confirm
     else if(continue_confirm && elem.classList.contains('resume') == false){
        $('.resume').removeClass('resume');
        $(elem).addClass('resume');
        continue_confirm = false;
    } 
    // enable continue on current element
    else if(!continue_confirm){
        $('.continue').removeClass('resume');
        $(elem).addClass('resume');
        continue_confirm = true;
    }
}
function parseTime(option,duration){
    let time;

    if(option == "toseconds"){
        let total_seconds = 0;
        if(hours > 0){ 
            total_seconds += hours * 60 * 60;
        }
        if(minutes > 0){
            total_seconds += minutes * 60;
        }
        total_seconds += timer;
        time = total_seconds.toString();
        return time;
    } 

    if(option == "toelement") {
        //convert from seconds to hours, minutes, seconds
        let total_seconds = duration;
        let hours = Math.floor(total_seconds / 3600);
        let minutes = Math.floor((total_seconds - (hours * 3600)) / 60);
        let seconds = total_seconds - (hours * 3600) - (minutes * 60);
        time = [hours, minutes, seconds];
        let element = createDuration(time);
        return element;
    }
    if(option == "toarray"){
        let total_seconds = duration;
        let hours = Math.floor(total_seconds / 3600);
        let minutes = Math.floor((total_seconds - (hours * 3600)) / 60);
        let seconds = total_seconds - (hours * 3600) - (minutes * 60);
        time = [hours, minutes, seconds];
        return time;
    }
}
function setItemValuesToTimer(duration){
    // set hours, minutes, timer according to duration in seconds
    let time = parseTime('toarray', duration);
    hours = time[0];
    minutes = time[1];
    timer = time[2];
    $('#hours').html(hours);
    $('#minutes').html(minutes);
    $('#seconds').html(timer);
}
function createOptions(){
    let options = $('<div>').addClass('item-options');
    let continuebutton = $('<button>').addClass('continue btn-small');
    let deletebutton = $('<button>').addClass('delete btn-small');
    continuebutton.html("Continue");
    continuebutton.attr('onclick', 'continueTimer(this)');
    deletebutton.html("Delete");
    deletebutton.attr('onclick', 'deleteItem(this)');
    options.append(continuebutton);
    options.append(deletebutton);
    return options;
}
function deleteItem(elem, option){
    if((elem.classList.contains('confirm') && delete_confirm) || (option == "resume")){
        //remove item from items_array depending on id
        let id = $(elem).parent().parent().attr('id');
        item_id = 1;
        items_array.forEach(element => {
            if(element.id == id){
                items_array.splice(items_array.indexOf(element), 1);
            }
            else{
                // set id ordering again
                element.id = item_id;
                item_id += 1;
            }
        });
        saveItems();
        $(elem).parent().parent().remove();
        //go through divs with attribute id and reorder them
        let items_list_container = $('#items-list-container');
        let div_id = items_list_container.children().length;
        items_list_container.children().each(function(){
            $(this).attr('id', div_id);
            div_id -= 1;
        });
        delete_confirm = false;
        continue_confirm = false;
        $('.confirm').removeClass('confirm');
        $('.resume').removeClass('resume');
    }
    else if(!delete_confirm ){
        $('.confirm').removeClass('confirm');
        $(elem).addClass('confirm');
        delete_confirm = true;
    }
    else if(delete_confirm && elem.classList.contains('confirm') == false) {
        $('.confirm').removeClass('confirm');
        $(elem).addClass('confirm');
        delete_confirm = false;
    }

}
function saveItems(){
    // Store
    if(items_array.length < 1){
        $('#items-list-header').addClass('hide');
    }
    // loop the items_array and rearrange the id:s of items
    let id = 1;
    items_array.forEach(element => {
        element.id = id;
        id += 1;
    });
    var jsonItems = JSON.stringify(items_array);
    localStorage.setItem("data", jsonItems);

}

function loadItems(){
    if(localStorage.getItem("data") != null){
        // Retrieve
        items_array = JSON.parse(localStorage.getItem("data"));
        if(items_array.length > 0){
            items_array.forEach(element => {
                element.id = item_id;
                createRow(element.name, element.duration, element.date);
            }); 
        }
    }
}
function showTime() {

    // return new date and time
    let dateTime= new Date();

    // return the time
    let timeNow = dateTime.toLocaleTimeString();
    $('#timeNow').html(timeNow);
}
let display = setInterval(showTime, 1000);

function resetLocalStorage(){
    var confirm_clear = confirm("Are you sure you want to clear all entrys?");
    if(confirm_clear){
        localStorage.clear();
        location.reload();
    }
}