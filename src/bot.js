const Discord = require('discord.js');
const {BOT_CONFIG, DB_CONFIG} = require('./config/config.json');
const path = require('path');
const CmdHandler = require('./services/commandHandler');
const Database = require('./services/databaseHandler');
const Economy = require('./services/economyService');
const embedTemplates = require('./services/embedTemplates');


const client = new Discord.Client();
const db = new Database(DB_CONFIG.USERNAME, DB_CONFIG.PASSWORD,
    DB_CONFIG.HOST, DB_CONFIG.DATABASE, DB_CONFIG.TABLES);

const economy = new Economy(db);

let Services = {
    prefix: BOT_CONFIG.PREFIX,
    footerlong: embedTemplates.footerlong,
    footershort: embedTemplates.footershort,
    Discord: Discord,
    database: db,
    economy: economy,

    CommandErrorEmbed: embedTemplates.cmderrEmbed,
    CommandSuccessEmbed: embedTemplates.cmdsuccessEmbed,
    InfoEmbed: embedTemplates.infoEmbed,
    HelpEmbed: embedTemplates.helpEmbed,
    GameEmbed: embedTemplates.gameEmbed
}

const commandHandler = new CmdHandler(client, Services);
commandHandler.registerCommandsAsync(path.join(__dirname, 'commands'));

client.once('ready', () => {
    client.user.setActivity(`prefix: ${BOT_CONFIG.PREFIX} | ${BOT_CONFIG.PREFIX}help | I am best girl`, {type: 'LISTENING'});
    console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
    console.log(`Serving ${client.users.cache.size} users in ${client.channels.cache.size} channels on ${client.guilds.cache.size} servers!`)
});

client.on('message', message => {
    if (message.content.toLowerCase().startsWith(BOT_CONFIG.PREFIX) && !message.author.bot){
        if(BOT_CONFIG.PREFIX == 'm.' && message.author.id != 464149197533216779){message.reply('This bot is a development instance. Please use <@736561416344961105> with prefix \'k.\''); return;}
        
        commandHandler.executeCommandAsync(message);
    }
});

client.on('error', console.error);

client.login(BOT_CONFIG.TOKEN);

process.on('SIGINT', function() {
    console.log("Caught interrupt signal");
    client.destroy();
    console.log("Client Dead");
    db.endConnection();
});