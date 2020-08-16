let NukeAsync = async(client, message, args, services) =>{

    if(!message.channel.deletable){
        let embed = services.CommandErrorEmbed()
            .setDescription('Bot does no have permission to delete this channel.');
            await message.channel.send(embed);
    }

    let channelName = message.channel.name;
    let parent = message.channel.parent;
    let topic = message.channel.topic;
    let position = message.channel.position;

    let guild = message.guild

    let embed = services.InfoEmbed()
    .setTitle('NUKING CHANNEL!')
    .setDescription('The channel will be nuked in 3 secconds!');

    await message.channel.send(embed);
    setTimeout(async function(){
        await message.channel.delete();
        if(!message.channel.deleted){
            let embed = services.CommandErrorEmbed()
            .setDescription('Error deleting channel!');
            await message.channel.send(embed);
        }
        await guild.channels.create(channelName, {parent: parent});
    }, 3000);
}

module.exports = {
    run: NukeAsync,
    command: 'nuke',
    alias: ['fuck,keeganpostedsomefuckingweirdshitnuke#media'],
    perms: ['ADMINISTRATOR'],
    argsmin: 0,
    argsmax: 0,
    guildOnly: true,
    timeout: 0,
    
    description: 'Deletes the current channel and creates it again',
    example: ['nuke']
}