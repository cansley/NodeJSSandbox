/**
 * Created by cxa70 on 11/11/2014.
 */
function initializeList(){
    doAjaxGet("http://localhost:3000/todo", function(msg){
        var itemList = $("#itemList");
        itemList.empty();
        var ul = $('<ul/>').appendTo("#itemList");
        if (msg.items.length == 0){
            $('<li/>').appendTo(ul).html("<i>No Items Found</i>");
        }
        msg.items.forEach(function(item){
            var html = item.Value + '<img id="' + item.idx + '" src="/images/delete.png" class="itemDelete"/>';
            $('<li/>').appendTo(ul).attr('id', item.idx).attr('name', item.idx).html(html);
        });

        $('.itemDelete').unbind('click');
        $('.itemDelete').click(deleteItem);
        var input = $('#newItem');
        input.val('');
        input.focus();
    });
}

function deleteItem(event){
    var item = event.target.id;
    var url = "http://localhost:3000/todo/" + item;
    doAjaxDelete(url, function(msg){
        // should check for errors here...
        initializeList();
    });
}

$(document).ready(function(){
    initializeList();
    $('addForm').submit(function(event){
        event.preventDefault();
    });
    $('#addBtn').click(function(event){
        event.preventDefault();
        doAjaxPost("addForm", function(msg){
            initializeList();
        });
    });
});