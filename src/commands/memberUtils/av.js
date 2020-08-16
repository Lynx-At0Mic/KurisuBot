let avatarAsync = async(client, message, args, services) => {
    let url;
    let user;
    if(args.length === 0){
        user = message.author;
        url = await user.displayAvatarURL();
    }
    else{
        try{
            user = await message.mentions.users.first();
            url = await user.displayAvatarURL();
        }
        catch{}
    }

    if(!url){
        await message.channel.send(services.CommandErrorEmbed('Invalid user!'));
        return;
    }
    let displayName;
    if(message.guild !== null){displayName = await client.guilds.resolve(message.guild.id).member(user).nickname || user.username;}
    else{displayName = user.username;}

    await message.channel.send(`${displayName}'s avatar`, {files: [url]});
}

module.exports = {
    run: avatarAsync,
    command: 'av',
    alias: ['avatar', 'useravatar'],
    perms: [],
    argsmin: 0,
    argsmax: 1,
    guildOnly: false,
    timeout: 0,
    
    description: 'Gets a user\'s avatar.',
    example: [`av`, `av <user>`]
}