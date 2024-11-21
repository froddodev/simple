module.exports = (client, player) => {
    player.events.on('playerStart', (queue, track) => {
        queue.metadata.channel.send(`¡Empezando a reproducir: **${track.title}**!`);
    });

    player.events.on('audioTrackAdd', (queue, track) => {
        queue.metadata.channel.send(`La canción **${track.title}** ha sido añadida a la cola.`);
    });

    player.events.on('audioTracksAdd', (queue, track) => {
        queue.metadata.channel.send(`¡Varias canciones han sido añadidas a la cola!`);
    });

    player.events.on('playerSkip', (queue, track) => {
        queue.metadata.channel.send(`Omitiendo **${track.title}** debido a un problema.`);
    });

    player.events.on('disconnect', (queue) => {
        queue.metadata.channel.send('Parece que mi trabajo aquí ha terminado, ¡me voy ahora!');
    });

    player.events.on('emptyChannel', (queue) => {
        queue.metadata.channel.send(`Me voy porque no ha habido actividad en el canal durante los últimos 5 minutos.`);
    });

    player.events.on('emptyQueue', (queue) => {
        queue.metadata.channel.send('¡La cola ha terminado!');
    });
};
