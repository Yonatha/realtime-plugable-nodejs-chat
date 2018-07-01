// keep chat scrolled to bottom
function updateChat() {
    $(".chat-history").animate({ scrollTop: $('.chat-history').scrollHeight }, 1000);
}

window.addEventListener('focus', function () {
    // document.title = 'focused';
    $('#message').focus();
});

window.addEventListener('blur', function () {
    // document.title = 'not focused';
});

$(function () {
    var socket = io.connect('http://localhost:3001');

    var $messageForm = $('#send-message');
    var $messageBox = $('#message');
    var $recipient = $('#recipient');
    var $chat = $('.chat-history');
    var $nickForm = $('#setNick');
    var $nickname = $('#nickname');
    var $nickError = $('#nickError');
    var $users = $('#users');
    var $tabs_content_list = $('#tabs_content_list');
    var tabs = []

    socket.on('connect', function () {
        $nickError.html('');
    });
    socket.on('disconnect', function () {
        $nickError.html('Desculpe, servidor indisponível, tente novamente mais tarde.');
    });

    socket.on('connectToRoom', function (data) {
        $('.chat-about .chat-with').text(data);
    });

    $nickForm.submit(function (e) {
        e.preventDefault();
        socket.emit('new user', $nickname.val(), function (data) {
            if (data) {
                $('#nickWrap').hide();
            } else {
                $nickError.html('Já existe um usuário com esse nome.');
            }
        });
        $nickname.val('');
    });

    socket.on('usernames', function (data) {
        var html = '';
        for (i = 0; i < data.length; i++) {
            html += '<li name="' + data[i].name + '" id="' + data[i].id + '" class="clearfix tablinks"><img src="assets/img/avatar0.png" alt="avatar" /><div class="about"><div class="name">' + data[i].name + '</div><div class="status"><i class="fa fa-circle online">Online</i></div></div> <span class="notify">1</span> </li>';

            socket.emit("change room", data[i].id);
            $('.chat-history').hide();

            if (!(tabs.find(x => x == data[i].id) === undefined)) {
                $('#tab-content-' + data[i].id + '').show();
            } else {
                $('.tabcontent').hide();
                tab = '<ul id="tab-content-' + data[i].id + '" class="chat-history tabcontent active"></ul>';
                $tabs_content_list.append(tab);
                tabs.push(data[i].id)
            }
            console.log(data[i].id)
            console.log(tabs)
        }


        $users.html(html);
        $('#users li').on('click', function (event) {
            $('.chat-about .chat-with').text($(this).attr('name'));
            $('#recipient').val($(this).attr('id'));

            socket.emit("change room", $(this).attr('id'));

            $("#users li").removeClass('active');
            $(this).addClass('active');

            $('.chat-history').hide();

            if (!(tabs.find(x => x == $(this).attr('id')) === undefined)) {
                $('#tab-content-' + $(this).attr('id')).show();
            } else {
                $('.tabcontent').hide();
                tab = '<ul id="tab-content-' + $(this).attr('id') + '" class="chat-history tabcontent active"></ul>';
                $tabs_content_list.append(tab);
                tabs.push($(this).attr('id'))
            }

            $('#message').focus()
            $('li#' + $(this).attr('id') + ' .notify').hide(400);
        })
    });

    $messageForm.submit(function (e) {
        e.preventDefault();
        socket.emit('send message', { msg: $messageBox.val(), recipient: $recipient.val() }, function (data) {
            // add stuff later
        });
        $messageBox.val('');
    });

    socket.on('new message', function (data) {

        $('#tab-content-' + data.id + '').hide();

        msg = '<li class="clearfix"><div class="' + data.style_class + 'message-data align-right"><span class="message-data-time"></span> &nbsp; &nbsp;<span class="message-data-name" style="color: ' + data.color + '">' + data.nick + '</span><i class="fa fa-circle me"></i></div><div style="background: ' + data.color + '" class="message other-message float-right">' + data.msg + '</div></li>'
        
        if(data.style_class == 'user'){
            $('#tab-content-' + $recipient.val()).append(msg);
            $('li#' + $recipient.val() + ' .notify').show(400);
        } else {
            $('#tab-content-' + data.id).append(msg);
            $('li#' + data.id + ' .notify').show(400);
        }
        updateChat();
        console.log(data)
    });

    socket.on('teste', function (data) {
        result = data.result
        $('#tab-content-' + result.details.id + ' li').remove()
        for (var i = 0; i < result.messages.length; i++) {
            msg = '<li class="clearfix"><div class="message-data align-right"><span class="message-data-time">' + result.messages[i].created_at + '</span> &nbsp; &nbsp;<span class="message-data-name" style="color: ' + result.details.color + '">' + result.messages[i].author + '</span><i class="fa fa-circle me"></i></div><div style="background: ' + result.details.color + '" class="message other-message float-right">' + result.messages[i].content + '</div></li>'
            $('#tab-content-' + result.details.id).append(msg);
        }
        updateChat();
    });

    
})
