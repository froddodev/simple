require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { Player } = require('discord-player');
const { YoutubeiExtractor } = require('discord-player-youtubei');
const commands = require('./src/commands');
const scheduler = require('./src/scheduler');
const events = require('./src/events');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates
    ]
});

const player = new Player(client);
player.extractors.register(YoutubeiExtractor).then(() => {
    console.log('Youtube started');
}).catch(e => console.log(e));

events(client, player);
scheduler(client);
commands(client, player);

client.login(process.env.TOKEN);
