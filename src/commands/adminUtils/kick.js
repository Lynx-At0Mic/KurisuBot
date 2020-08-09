let KickAsync = async(client, message, args, services) =>{
    let mentionMatch;
    try{ mentionMatch = args[0].match(/^<@!?(\d+)>$/); }
    catch{ }

    if(!mentionMatch){
        let embed = services.CommandErrEmbed()
        .setDescription('No member sepcified');

        await message.channel.send(embed);
        return;
    }
    let kickReason = args.slice(1).join(' ');
    let guilduser;
    try{ guilduser = message.guild.members.cache.get(mentionMatch[1]); }
    catch{
        let embed = services.CommandErrEmbed()
        .setDescription('Invalid user');

        await message.channel.send(embed);
        return;
    }

    if(!guilduser.kickable){
        let embed = services.CommandErrorEmbed()
        .setDescription('Bot has insufficient permissions to kick that user');

        await message.channel.send(embed);
        return;
    }

    await guilduser.kick({reason: kickReason});

    let embed = services.CommandSuccessEmbed()
    .setTitle('✅ User kicked successfully!')
    .addField('User', guilduser, true)
    .addField('User ID', guilduser.id, true);

    if(kickReason != []){ embed.addField('Reason', kickReason);}
    else{embed.addField('Reason', 'None');}

    await message.channel.send(embed);
}

module.exports = {
    run: KickAsync,
    command: 'kick',
    alias: [''],
    perms: ['KICK_MEMBERS'],
    argsmin: 1,
    argsmax: -1,
    
    description: 'Kicks a member. Reason is optional.',
    example: ['kick <user> <reason>', 'kick @catte#1111', 'kick @Keegan yanderes...']
}