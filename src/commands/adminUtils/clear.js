let purgeAsync = async(client, message, args, services) =>{
    if(isNaN(args[0]) || args[0] > 100 || args[0] < 1){
        let embed = services.CommandErrorEmbed()
        .setDescription('Invald value, please enter a number between 1 and 100.');

        await message.channel.send(embed);
        return;
    }

    await message.channel.messages.fetch({ limit: parseInt(args[0]) + 1})
    .then(messages => {
        message.channel.bulkDelete(messages);
    })
    .catch();

    let embed = services.CommandSuccessEmbed()
    .setTitle(`✅ Chat cleared!`)
    .setDescription(`Successfully deleted ${args[0]} messages.`);

    let confirmMsg = await message.channel.send(embed);

    await confirmMsg.delete({timeout: 5000})
}

module.exports = {
    run: purgeAsync,
    command: 'clear',
    alias: ['purge', 'cls'],
    perms: ['MANAGE_MESSAGES'],
    argsmin: 1,
    argsmax: 1,
    guildOnly: true,
    
    description: 'Deletes the last number of messages specified. Max value is 100.',
    example: ['clear 50', 'purge 100', 'cls 5']
}