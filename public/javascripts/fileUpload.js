/**
 * Created by cxa70 on 11/11/2014.
 */
$(document).ready(function () {
    $('uploadForm').submit(function (event) {
        event.preventDefault();
    });
    var uploadButton = $('<button/>').addClass("btn")
        .prop('disabled', true)
        .text('Processing...')
        .click(function (event) {
            var $this = $(this),
                data = $this.data();
            $this.off('click')
                .text('Abort')
                .on('click', function () {
                    $this.remove();
                    data.abort()
                });
            data.submit().always(function () {
                $this.remove();
            });
        });

    $('#fileUpload').fileupload({
        dataType: 'json',
        autoUpload: false,
        add: function (e, data) {
            data.context = $('<div/>').appendTo("#files");
            $.each(data.files, function (index, file) {
                var node = $('<p/>').append($('<span/>').text(file.name));
//                    if (!index) {
//                        node.append('<br>')
//                                .append(uploadButton.clone(true).data(data));
//                    }
                node.appendTo(data.context);
                if (file.preview) {
                    node.prepend('<br>')
                        .prepend(file.preview);
                }
                if (file.error) {
                    node.prepend('<br>').prepend(file.error);
                }
                if (index + 1 === data.files.length) {
                    data.context.find('button').text('Upload')
                        .prop('disabled', !!data.files.error);
                }
            });

            data.submit();
        },
        progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progress .bar').css('width', progress + '%');
            $('#progress .percent').html(progress + '%');
        },
        done: function (e, data) {
            $.each(data.result.files, function (index, file) {
                var link = $('<a>')
                    .attr('target', '_blank')
                    .prop('href', file.name);
                $(data.context.children()[index])
                    .wrap(link);
            });
        },
        fail: function (e, data) {
            $.each(data.result.files, function (index, file) {
                var error = $('<span/>').text(file.error);
                $(data.context.children()[index])
                    .append('<br>')
                    .append(error);
            });
        }
    }).prop('disabled', !$.support.fileInput)
        .parent().addClass($.support.fileInput ? undefined : 'disabled');
});