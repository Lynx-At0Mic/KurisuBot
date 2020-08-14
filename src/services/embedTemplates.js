const Discord = require('discord.js');
const footerlong = 'I am best girl. "But Moeka is.." Nope yandere-esk types are bad.\nNow that\'s a science fact for you.';
const footershort = 'I am best girl';

module.exports = {
    footershort: footershort,
    footerlong: footerlong,

    cmderrEmbed: function(reason=null){
        embed = new Discord.MessageEmbed()
        .setTitle('Command Error')
        .setColor('#FF0000')
        .setDescription(reason);
        return embed;
    },
    cmdsuccessEmbed: function(reason=null){
        embed = new Discord.MessageEmbed()
        .setTitle('Success')
        .setColor('#08FF00')
        .setDescription(reason);
        return embed;
    },
    infoEmbed: function(){
        let embed = new Discord.MessageEmbed()
        .setColor('#00A3F5')
        .setFooter(footerlong);
        return embed;
    },
    helpEmbed: function(){
        let embed = new Discord.MessageEmbed()
        .setColor('#9CF6F6')
        .setFooter(footershort);
        return embed;
    },
    gameEmbed: function(){
        let embed = new Discord.MessageEmbed()
        .setColor('#4F359B')
        .setFooter(footershort);
        return embed;
    }
}