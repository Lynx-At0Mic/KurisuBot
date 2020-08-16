let UserInfoAsync = async(client, message, args, services) =>{
    console.log(message.guild === null);
    if(message.guild !== null){await GuildUserInfo(message, args, services)}
    else{await DmUserInfo(message, args, services)}
}

async function GuildUserInfo(message, args, services){
    let guildUser;
    if(args != ''){
        if(!message.mentions.members.first()){
            let embed = services.CommandErrorEmbed()
            .setDescription('Invalid User');

            await message.channel.send(embed);
            return;
        }
        else{guildUser = message.mentions.members.first();}
    }

    else{guildUser = message.guild.members.cache.get(message.author.id);}
    
    let nickname = guildUser.nickname;
    let activity = guildUser.user.presence.activities[0];
    let roles = guildUser.roles.cache;
    let rolestring = '';
    let rolecount = 0;
    for(role of roles){
        if(rolecount == 3) {rolecount = 0;}
        usrRole = role.toString().split(',')[1];
        if(rolecount == 0){rolestring += `${usrRole} `;}
        else if(rolecount == 2){rolestring += `| ${usrRole} \n`;}
        else{rolestring += `| ${usrRole}`;}
        rolecount++;
    }

    if(nickname == undefined){ nickname = 'None';}
    if(activity == undefined){ activity = 'None';}
    else{ activity = activity.name}
    if(rolestring.trim() == ''){rolestring = 'None';}


    let embed = services.InfoEmbed()
    .setTitle('User Info')
    .setDescription(guildUser)
    .setThumbnail(guildUser.user.displayAvatarURL())
    .addField('Username', guildUser.user.username, true)
    .addField('Tag', guildUser.user.discriminator, true)
    .addField('Nickname', nickname, true)
    .addField('Status', guildUser.user.presence.status, true)
    .addField('Activity', activity, true)
    .addField('Bot?', guildUser.user.bot, true)
    .addField('Roles', rolestring, false)
    .addField(`Date joined '${message.guild.name}'`, guildUser.joinedAt)
    .addField('Account created at', guildUser.user.createdAt)
    .addField('ID', guildUser.id);

    await message.channel.send(embed);
    return;
}

async function DmUserInfo(message, args, services){
    let user;
    if(args != ''){
        if(!message.mentions.users.first()){
            let embed = services.CommandErrorEmbed()
            .setDescription('Invalid User');

            await message.channel.send(embed);
            return;
        }
        else{user = message.mentions.users.first();}
    }
    else{user = message.author;}

    let activity = user.presence.activities[0];

    if(activity == undefined){ activity = 'None';}
    else{ activity = activity.name}

    let embed = services.InfoEmbed()
    .setTitle('User Info')
    .setDescription(user)
    .setThumbnail(user.displayAvatarURL())
    .addField('Username', user.username, true)
    .addField('Tag', user.discriminator, true)
    .addField('Status', user.presence.status, true)
    .addField('Activity', activity, true)
    .addField('Bot?', user.bot, true)
    .addField('Account created at', user.createdAt)
    .addField('ID', user.id);

    await message.channel.send(embed);
    return;

}

module.exports = {
    run: UserInfoAsync,
    command: 'user',
    alias: ['userinfo'],
    perms: [],
    argsmin: 0,
    argsmax: 1,
    guildOnly: false,
    timeout: 0,
    
    description: 'Gets information about the specified user.',
    example: ['user <user>', 'user @catte#1111', 'user']
}