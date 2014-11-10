/**
 * Created by cxa70 on 11/10/2014.
 */
function doAjaxGet(url, callback){
    $.ajax({
        cache: false,
        type: "get",
        url: url,
        success: function(data){
            // do stuff here...
            callback(data);
        },
        error: function(jqXHR, textStatus, errorThrown){
            callback("Error: " + errorThrown);
        }
    });
}

function doAjaxDelete(url, callback){
    $.ajax({
        cache: false,
        type: "delete",
        url: url,
        success: function(data){
            callback(data);
        },
        error: function(jqXHR, textStatus, errorThrown){
            callback("Error: " + errorThrown);
        }
    });
}

function doAjaxPost(eventTarget, callback) {
    var theform = __getForm(eventTarget);
    var formData = $(theform).serialize();
    $.ajax({
        cache: false,
        type: "post",
        url: $(theform).attr("action"),
        data: formData,
        contentType: false,
        success: function (msg) {
            callback(msg);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            callback("Server side call failed. " + errorThrown);
        }
    });
}

function doAjaxPut(eventTarget, callback){
    var theForm = __getForm(eventTarget);
    var formData = $(theForm).serialize();
    $.ajax({
        cache: false,
        type: "put",
        url: $(theForm).attr("action"),
        data: formData,
        success: function(msg){
            callback(msg);
        },
        error: function(jqXhr, textStatus, errorThrown){
            callback("Server side call failed. " + errorThrown);
        }
    });
}

function __getForm(eventTarget) {
    var element = __getElement(eventTarget);
    return $(element).closest('form').first();
}
function __getElement(eventTarget) {
    var element;
    if (eventTarget.split) {
        element = $(eventTarget);
        if (element.size() == 0 && /^(\w|-)+$/.test(eventTarget)) {
            //extra help for callers that don't make a valid selector => look by id and then by name
            element = $("#" + eventTarget);
            if (element.size() == 0) {
                element = $('[name=' + eventTarget + "]");
            }
        }
    } else {
        element = $(eventTarget);
    }
    return element;
}