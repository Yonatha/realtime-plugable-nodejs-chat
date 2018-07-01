window.addEventListener('focus', function () {
    $('#message').focus();
});

$(function() {

    $("#chat-circle").toggle('scale');
    $(".chat-box").toggle('scale');
    setTimeout(function() {
        sendMessage('Olá! Posso ajudar?', 'user');
    }, 500)

    var socket = io.connect('http://localhost:3001');
    var $chat = $('.chat-logs');
    var $nickForm = $('#setNick');
    var $nickname = $('#nickname');
    var $nickError = $('#nickError');
    var $users = $('#users');

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

                socket.on('userProtocol', function (user) {
                    $('#recipient').val(user.protocol);

                    socket.emit("change room", user.protocol);

                    setTimeout(function() {
                        sendMessage('Ok ' + user.name + ', qual a sua dúvida?', 'user');
                    }, 500)
                });

            } else {
                $nickError.html('Já existe um usuário com esse nome.');
            }
        });

        $('#setNick').hide();
        $('#send-message').show();
        $nickname.val('');
    });

    socket.on('new message', function (data) {
        console.log(data.msg)
        sendMessage(data.msg, data.style_class);
    })

    $('#send-message').submit(function (e) {
        e.preventDefault();
        socket.emit('send message', {msg: $('#chat-input').val(), recipient: $('#recipient').val()}, function (data) {
            // add stuff later
        });
        console.log($('#recipient').val())
        $('#chat-input').val('');
    });

    var INDEX = 0;
    function sendMessage(msg, type) {

        var avatar = (type == 'self' ? 'avatar2.png' : 'avatar1.png')

        INDEX++;
        var str="";
        str += "<div id='cm-msg-"+INDEX+"' class=\"chat-msg "+type+"\">";
        str += "          <span class=\"msg-avatar\">";
        str += "            <img src='assets/img/"+avatar+"'>";
        str += "          <\/span>";
        str += "          <div class=\"cm-msg-text\">";
        str += msg;
        str += "          <\/div>";
        str += "        <\/div>";
        $(".chat-logs").append(str);
        $("#cm-msg-"+INDEX).hide().fadeIn(300);
        if(type == 'self'){
            $("#chat-input").val('');
        }
        $(".chat-logs").stop().animate({ scrollTop: $(".chat-logs")[0].scrollHeight}, 1000);
    }

    $("#chat-circle").click(function() {
        $("#chat-circle").toggle('scale');
        $(".chat-box").toggle('scale');
    })

    $(".chat-box-header").click(function() {
        $("#chat-circle").toggle('scale');
        $(".chat-box").toggle('scale');
    })
})