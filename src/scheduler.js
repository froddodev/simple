const moment = require('moment-timezone');
const fs = require('fs');

module.exports = (client) => {
    const responses = JSON.parse(fs.readFileSync('responses.json', 'utf8'));
    
    client.on('ready', () => {
        const guild = client.guilds.cache.first();
        if (!guild) return console.log("Server not found.");

        const textChannels = guild.channels.cache;
        
        responses.program.forEach((program) => {
            const targetChannelName = program.channel; 
            const targetHour = program.hour;          
            const targetMinute = program.minute;        
            const targetChannel = textChannels.find(channel => channel.name === targetChannelName);
            
            if (!targetChannel) return console.log(`Canal ${targetChannelName} no encontrado.`);

            const chileTimezone = "America/Santiago";
            const now = moment.tz(chileTimezone); 
            let targetTime = moment.tz({ hour: targetHour, minute: targetMinute }, chileTimezone);

            if (now.isAfter(targetTime)) {
                targetTime.add(1, 'days');
            }

            const delay = targetTime.diff(now);

            console.log(`Mensaje programado para el canal ${targetChannelName} a las ${targetTime.format('YYYY-MM-DD HH:mm:ss')}`);

            setTimeout(() => {
                program.messages.forEach(message => {
                    targetChannel.send(message);
                });
                console.log(`Mensajes enviados al canal ${targetChannelName}.`);
            }, delay);
        });
    });
};
