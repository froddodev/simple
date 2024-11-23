const fs = require('fs');

module.exports = (client, player) => {
    const prefix = '#';
    const responses = JSON.parse(fs.readFileSync('responses.json', 'utf8'));
    const responseWait = 7000;
    let lastResponse = {};

    client.on('messageCreate', message => {
        if (message.author.bot) return;

        // Si el mensaje no empieza con el prefijo, seleccionamos un mensaje aleatorio para responder
        if (!message.content.startsWith(prefix)) {
            const username = message.author.username.toLowerCase();
            let responsesArray = [];  
            if (responses.user && responses.user[username]) {
                responsesArray = responses.user[username];
            }

            if (responsesArray.length > 0) {
                const now = Date.now();
                if (lastResponse[message.author.id] && now - lastResponse[message.author.id].timestamp < responseWait) {
                    return;
                }

                let randomResponse;
                do {
                    randomResponse = responsesArray[Math.floor(Math.random() * responsesArray.length)];
                } while (lastResponse[message.author.id] && lastResponse[message.author.id].response === randomResponse);

                randomResponse = randomResponse.replace(/<@([^>]+)>/g, (match, alias) => {
                    if (alias === "name") {
                        return `<@${message.author.id}>`; 
                    }
                    return match;
                });

                message.channel.reply({ content: randomResponse });
                lastResponse[message.author.id] = { response: randomResponse, timestamp: now };
            }
        }

        // Comandos con prefijo '#'
        if (message.content.startsWith(prefix)) {
            const args = message.content.slice(prefix.length).trim().split(/ +/);
            const command = args.shift().toLowerCase();
            const voiceChannel = message.member.voice.channel;
            const queue = player.queues.get(message.guild);

            switch (command) {
                case 'simple':
                    message.channel.send({
                        content: `Soy **Simple**, mi creado es froddo. Aquí están los comandos disponibles:\n\n**#info** - Muestra información sobre el servidor.\n**#music** - Muestra los comandos de música.\n`
                    });
                    break;
                case 'info':
                    message.channel.send({ content: `No hay información disponible en este servidor.` });
                    break;
                case 'music':
                    message.channel.send({
                        content: `**Comandos de música disponibles:**\n\n1. **#play <enlace de YouTube>** - Reproduce una canción desde YouTube.\n2. **#stop** - Detiene la reproducción de música y el bot abandona el canal de voz.\n3. **#queue** - Muestra las canciones en la cola de reproducción.\n4. **#resume** - Reanuda la reproducción de música.\n5. **#pause** - Pausa la reproducción de música.\n6. **#skip** - Omite la canción actual y reproduce la siguiente en la cola.`
                    });
                    break;
                case 'play':
                    const result = args.join(' ');

                    if (!voiceChannel) {
                        message.channel.send({ content: 'No estás conectado a un canal de voz.' });
                        return;
                    }

                    if (!result || !/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(.*)/.test(result)) {
                        message.channel.send({ content: 'Por favor ingresa un enlace válido de YouTube.' });
                        return;
                    }

                    player.play(voiceChannel, result, {
                        nodeOptions: {
                            metadata: {
                                channel: message.channel
                            },
                            selfDeaf: true,
                            volume: 80,
                            leaveOnEmpty: true,
                            leaveOnEmptyCooldown: 300000,
                            leaveOnEnd: true,
                            leaveOnEndCooldown: 300000,
                        }
                    });
                    break;
                case 'stop':
                    if (!voiceChannel) {
                        message.channel.send({ content: 'No estás conectado a un canal de voz.' });
                        return;
                    }

                    if (!queue) {
                        message.channel.send({ content: 'No hay una lista reproduciendose.' });
                        return;
                    }

                    queue.delete();
                    queue.node.stop();
                    message.channel.send('Musica detenida.');
                    break;
                case 'queue':
                    if (!voiceChannel) {
                        message.channel.send({ content: 'No estás conectado a un canal de voz.' });
                        return;
                    }

                    if (!queue) {
                        message.channel.send({ content: 'No hay una lista reproduciendose.' });
                        return;
                    }

                    const history = queue.history.tracks.data.map(x => x.title);
                    const nextSongs = queue.tracks.data.map(x => x.title);
                    const list = [...history, queue.currentTrack.title, ...nextSongs];

                    message.channel.send(`Lista de servidor ${message.guild.name}\n${list.join('\n')}`);
                    break;
                case 'resume':
                    if (!voiceChannel) {
                        message.channel.send({ content: 'No estás conectado a un canal de voz.' });
                        return;
                    }

                    if (!queue) {
                        message.channel.send({ content: 'No hay una lista reproduciendose.' });
                        return;
                    }

                    if (!queue.node.isPaused()) {
                        message.channel.send('La musica ya se esta reproduciendo.');
                        return;
                    }
                    queue.node.resume();
                    message.channel.send('Musica reproduciendose.');
                    break;
                case 'pause':
                    if (!voiceChannel) {
                        message.channel.send({ content: 'No estás conectado a un canal de voz.' });
                        return;
                    }

                    if (!queue) {
                        message.channel.send({ content: 'No hay una lista reproduciendose.' });
                        return;
                    }

                    if (queue.node.isPaused()) {
                        message.channel.send('La musica ya esta pausada.');
                        return;
                    }
                    queue.node.pause();
                    message.channel.send('Musica pausada.');
                    break;
                case 'skip':
                    if (!voiceChannel) {
                        message.channel.send({ content: 'No estás conectado a un canal de voz.' });
                        return;
                    }

                    if (!queue) {
                        message.channel.send({ content: 'No hay una lista reproduciendose.' });
                        return;
                    }

                    queue.node.skip();
                    message.channel.send({ content: 'Siguiente cancion.' });
                    break;
                default:
                    message.channel.send({ content: `Comando no reconocido.` });
                    break;
            }
        }
    });
};
