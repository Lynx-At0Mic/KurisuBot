let avatarAsync = async(client, message, args, services) => {
    let guild = await client.guilds.resolve(message.guild.id);
    let member;
    let username;
    let avURL;

    if (args.length === 0){
        member = await guild.member(message.author);
        username = message.author.username;
        avURL = await message.author.displayAvatarURL();
    }
    else {
        try{
            member = await guild.member(message.mentions.members.first());
            username = message.mentions.users.first().username;
            avURL = await message.mentions.users.first().displayAvatarURL();
        }
        catch{
            await message.channel.send('Sorry, i can\'t find that user');
            return;
        }

    }

    let nickname = member.nickname;
    if (nickname === undefined || nickname === null){ nickname = username; }
    await message.channel.send(`${nickname}'s avatar`);
    await message.channel.send(avURL);
}

module.exports = {
    run: avatarAsync,
    command: 'av',
    alias: ['avatar', 'useravatar'],
    perms: [],
    argsmin: 0,
    argsmax: 1,  
    
    description: 'Gets a user\'s avatar.',
    example: [`av`, `av <user>`]
}