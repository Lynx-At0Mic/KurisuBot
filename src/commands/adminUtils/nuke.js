let NukeAsync = async(client, message, args, services) =>{
    let channelName = message.channel.name;
    let parent = message.channel.parent;
    let topic = message.channel.topic;
    let position = message.channel.position;

    let guild = message.guild

    let embed = services.InfoEmbed()
    .setTitle('NUKING CHANNEL!')
    .setDescription('The channel will be nuked in 5 secconds');

    await message.channel.send(embed);
    setTimeout(async function(){
        await message.channel.delete();
        if(!message.channel.deleted){await message.channel.send('Error deleting channel');}
        await guild.channels.create(channelName, {parent: parent});
    }, 5000);
}

module.exports = {
    run: NukeAsync,
    command: 'nuke',
    alias: ['fuck,keeganpostedsomefuckingweirdshitnuke#media'],
    perms: ['ADMINISTRATOR'],
    argsmin: 0,
    argsmax: 0,  
    
    description: 'Deletes the current channel and creates it again',
    example: ['nuke']
}