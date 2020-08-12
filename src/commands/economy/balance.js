let BalanceAsync = async(client, message, args, services) =>{
    let queryResult = await services.database.query(`SELECT value FROM currency WHERE guildID = ${message.guild.id} AND userID = ${message.author.id}`);
    if(!queryResult) {
        await message.channel.send(services.CommandErrorEmbed(`You are not registered!\n Do '${services.prefix}register' to be able to take part in the economy.`));
        return;
    }

    let embed = services.InfoEmbed()
    .setTitle(`Wallet for ${message.author.tag}`)
    .setDescription(`Balance: ${queryResult.value}`)
    .setFooter('');

    await message.channel.send(embed);
}

module.exports = {
    run: BalanceAsync,
    command: 'wallet',
    alias: ['balance', 'bal', 'funds', 'money'],
    perms: [],
    argsmin: 0,
    argsmax: 0,  
    
    description: 'Shows balance of yourself or another user.',
    example: ['balance', 'bal <user>']
}