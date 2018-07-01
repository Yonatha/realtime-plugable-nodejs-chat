var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    users = {};

global.db = require('./db');

server.listen(3001);
console.log('Server listening on port 3001')

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/server.html');
});

// Recebendo informações do cliente
io.sockets.on('connection', function (client) {
    // Novo usuário
    client.on('new user', function (data, callback) {
        // Check if nickname exists
        if (isValidNickname(data)) {
            callback(false);
        } else {
            callback(true);

            if (data == 'administrador') {
                color = '#86BB71'
            } else {
                // color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16)
                color = '#5A5EB9'
            }

            user = {
                id: client.id,
                name: data,
                color: color,
            }

            users[client.id] = user
            client.nickname = user
            updateNickName();
            client.join(client.id);
            client.emit(
                'userProtocol',
                {
                    name: users[client.id].name,
                    protocol: client.id,
                }
            );
            // Registrando usuário
            if (data != 'administrador') {
                global.db.registerAtendimento({ _id: client.id, details: user }, (err, result) => {
                    if (err) {
                        return console.log(err);
                    } else {
                        console.log('Usuário registrado com sucesso.');
                    }

                })
            }
        }
    });

    client.on("change room", function (data) {
        var user = users[data]
        client.join(data);
        global.db.findSpecificAtendimento(user.id, (err, result) => {
            if (err) {
                return console.log(err);
            } else {
                var result = result[0]
                client.emit(
                    'teste',
                    {
                        result: result
                    }
                );
            }
        })
        //updateNickName()
    });

    function updateNickName() {
        io.sockets.emit('usernames', Object.values(users));
    }

    function isValidNickname(newnickname) {
        res = false
        var user_array = Object.values(users)
        for (i = 0; i < user_array.length; i++) {
            if (user_array[i].name === newnickname) {
                res = true
            }
        }
        return res;
    }

    // Mensagem
    client.on('send message', function (data) {
        var sender = users[client.nickname.id]
        var recipient = users[data.recipient]
        io.sockets.in(data.recipient).emit(
            'new message',
            {
                id:  sender.id,
                msg: data.msg,
                nick: sender.name,
                color: sender.color,
                style_class: (data.recipient == client.nickname.id ? 'self' : 'user')
            }
        );

        global.db.registerAtendimentoMessage(recipient.id, {
            author: sender.name,
            content: data.msg
        }, (e, result) => {
            if (e) { return console.log(e); }
            console.log('Menssagem registrada com sucesso.')
        });
    });

    client.on('disconnect', function (data) {
        if (!client.nickname) return;
        delete users[client.nickname.id]
        updateNickName();
    });
});