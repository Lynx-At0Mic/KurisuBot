const Discord = require('discord.js');
const footerlong = 'I am best girl. "But Moeka is.." Nope yandere-esk types are bad.\nNow that\'s a science fact for you.';
const footershort = 'I am best girl';

function CommandErrorEmbed(){
    embed = new Discord.MessageEmbed()
    .setTitle('Command Error')
    .setColor('#FF0000')
    .setFooter(footershort);
    return embed;
}

function CommandSuccessEmbed(){
    embed = new Discord.MessageEmbed()
    .setTitle('Success')
    .setColor('#08FF00')
    .setFooter(footershort);
    return embed;
}

function InfoEmbed() {
    let embed = new Discord.MessageEmbed()
    .setColor('#00A3F5')
    .setFooter(footerlong);
    return embed;
}

function HelpEmbed(){
    let embed = new Discord.MessageEmbed()
    .setColor('#9CF6F6')
    .setFooter(footershort);
    return embed;
}

function GameEmbed(){
    let embed = new Discord.MessageEmbed()
    .setColor('#4F359B')
    .setFooter(footershort);
    return embed;
}

module.exports = {
    cmderrEmbed: CommandErrorEmbed,
    cmdsuccessEmbed: CommandSuccessEmbed,
    infoEmbed: InfoEmbed,
    helpEmbed: HelpEmbed,
    gameEmbed: GameEmbed
}