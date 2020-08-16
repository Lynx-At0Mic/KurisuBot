let latencyAsync = async(client, message, args, services) =>{
    let pingmsg;
    try{
        pingmsg = await client.channels.cache.get('739678850182676510').send('pingTest');
    }
    catch{
        message.channel.send('There is a problem, tell catte his ping server is down.');
    }

    // await message.channel.send(`ping is ${pingmsg.createdAt - message.createdAt}`);

    let pingEmbed = services.InfoEmbed()
    .setTitle('Pong! 🏓')
    // .addField(`Latency is ${pingmsg.createdAt - message.createdAt}ms`, '\u200B')
    .setDescription(`Latency is ${pingmsg.createdAt - message.createdAt}ms`)
    .setFooter(services.footershort);

    await message.channel.send(pingEmbed);
    
}

module.exports = {
    run: latencyAsync,
    command: 'ping',
    alias: ['latency'],
    perms: [],
    argsmin: 0,
    argsmax: 0,
    guildOnly: false,
    timeout: 0,
    
    description: 'Returns the bot\'s ping in milliseconds.',
    example: ['ping']
}