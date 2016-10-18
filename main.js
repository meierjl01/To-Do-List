var container = $('.container');

//to show the list and the ability to delete or click on a particular task
function renderList() {
    container.empty();
    var ul = $('<ul class="to-do-list"></ul>');
    var settings = {
        url: 'https://tiny-za-server.herokuapp.com/collections/to_do_list/',
        type: 'GET',
        success: function(data) {
            data.sort();
            data.forEach(function(item, i, arr) {
                var li = $('<li><a href="#tasks/' + item._id + '">' + item.task + '</a></li>');
                ul.append(li);
            });
        },
        error: function(error) {
            console.log('getting list items from server failed');
        }
    };
    $.ajax(settings);
    container.append(ul);
}

//to write a new task item and save it to the list:
function saveItem(e, form) {
    e.preventDefault();
    var item = {
        task: form.find('.task').val(),
        notes: form.find('.notes').val(),
    };
    var settings = {
        url: 'https://tiny-za-server.herokuapp.com/collections/to_do_list/',
        type: 'POST',
        success: function(data) {
            location.hash = '';
        },
        error: function(error) {
            console.log('putting list items into server failed');
        },
        contentType: 'application/json',
        data: JSON.stringify(item)
    };
    $.ajax(settings);
}

function renderForm() {
    container.empty();
    var form = $('<form>' + '<input class="task" type="text" placeholder="New Task">' + '<textarea class="notes" placeholder="Task Notes/Reminders"></textarea>' + '<input class="submit" type="submit" value="Add New Task">' + '</form>');
    form.find('.submit').on('click', function(e) {
        saveItem(e, form);
    });
    container.append(form);
}

// function to show specific to-do item - item and any notes/reminders for that item:
function renderTask() {
    container.empty();

    var itemID = location.hash.split('/');

    var settings = {
        url: 'http://tiny-za-server.herokuapp.com/collections/to_do_list/' + itemID[1],
        type: 'GET',
        success: function(data) {

            //other divs to style
            var div = $('<div class="single-task">' + data.task + '</div>' + '<div class="single-notes">' + data.notes + '</div><div><i class="fa fa-trash" aria-hidden="true"></i></div>');

            container.append(div);
            var trash = $('.fa-trash');
            console.log(trash);
            trash.on('click', deleteTask);
        }
    };
    $.ajax(settings);
}


function deleteTask(e) {
    var itemID = location.hash.split('/');
    var settings = {
        url: 'http://tiny-za-server.herokuapp.com/collections/to_do_list/' + itemID[1],
        type: 'DELETE',
        success: function(data) {
            location.hash = '';
        }
    };
    $.ajax(settings);
}
//have to have if/else if statemnet for hash change events:
function hashChangeEvent(e) {
    var siteLocation = location.hash;

    if (siteLocation === '') {
        renderList();
    } else if (siteLocation === '#create') {
        renderForm();
    } else if (siteLocation.indexOf('#tasks/') > -1) {
        renderTask();
    }
}


$(window).on('hashchange', hashChangeEvent);

hashChangeEvent();
