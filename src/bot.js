const Discord = require('discord.js');
//const Canvas = require('canvas');
const {BOT_CONFIG} = require('./config/config.json');
const path = require('path');
const Handler = require('./services/commandHandler');
const embedTemplates = require('./services/embedTemplates');

let Services = {
    prefix: BOT_CONFIG.PREFIX,
    footerlong: 'I am best girl. "But Moeka is.." Nope yandere-esk types are bad.\nNow that\'s a science fact for you.',
    footershort: 'I am best girl',
    Discord: Discord,

    CommandErrorEmbed: embedTemplates.cmderrEmbed,
    CommandSuccessEmbed: embedTemplates.cmdsuccessEmbed,
    InfoEmbed: embedTemplates.infoEmbed,
    HelpEmbed: embedTemplates.helpEmbed,
    GameEmbed: embedTemplates.gameEmbed
}

const client = new Discord.Client();
let handler = new Handler(client, Services);
handler.registerCommandsAsync(path.join(__dirname, 'commands'));

client.once('ready', () => {
    client.user.setActivity(`prefix: ${BOT_CONFIG.PREFIX} | ${BOT_CONFIG.PREFIX}help | I am best girl`, {type: 'LISTENING'});
    console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
    console.log(`Serving ${client.users.cache.size} users in ${client.channels.cache.size} channels on ${client.guilds.cache.size} servers!`)
});

client.on('message', message => {
    if (message.content.toLowerCase().startsWith(BOT_CONFIG.PREFIX) && !message.author.bot){
        if(BOT_CONFIG.PREFIX == 'm.' && message.author.id != 464149197533216779){message.reply('This bot is a development instance. Please use <@736561416344961105> with prefix \'k.\''); return;}
        
        handler.executeCommandAsync(message);
    }
});

client.on('error', console.error);

client.login(BOT_CONFIG.TOKEN);

process.on('SIGINT', function() {
    console.log("Caught interrupt signal");
    client.destroy();
    console.log("Client Dead");
});