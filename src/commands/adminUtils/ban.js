let banAsync = async(client, message, args, services) =>{
    
    let mentionMatch;
    try{ mentionMatch = args[0].match(/^<@!?(\d+)>$/); }
    catch{ }

    if(!mentionMatch){
        let embed = services.CommandErrEmbed()
        .setDescription('No member sepcified');

        await message.channel.send(embed);
        return;
    }
    let banReason = args.slice(1).join(' ');
    let guilduser;
    try{ guilduser = message.guild.members.cache.get(mentionMatch[1]); }
    catch{
        let embed = services.CommandErrEmbed()
        .setDescription('Invalid user');

        await message.channel.send(embed);
        return;
    }

    if(!guilduser.bannable){
        let embed = services.CommandErrorEmbed()
        .setDescription('Bot has insufficient permissions to ban that user');

        await message.channel.send(embed);
        return;
    }

    await guilduser.ban({reason: banReason});

    let embed = services.CommandSuccessEmbed()
    .setTitle('✅ User banned successfully!')
    .addField('User', guilduser, true)
    .addField('User ID', guilduser.id, true);

    if(banReason != []){ embed.addField('Reason', banReason);}
    else{embed.addField('Reason', 'None');}

    await message.channel.send(embed);
}

module.exports = {
    run: banAsync,
    command: 'ban',
    alias: ['banhammer'],
    perms: ['BAN_MEMBERS'],
    argsmin: 1,
    argsmax: -1,
    guildOnly: true,
    
    description: 'Bans the target member from the server. Reason is optional.',
    example: ['ban <user> <reason>','ban @catte#1111 being a weeb']
}