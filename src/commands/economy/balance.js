let BalanceAsync = async(client, message, args, services) =>{
    let balance = await services.economy.getFunds(message.guild.id, message.author.id);

    let embed = services.InfoEmbed()
    .setTitle(`Wallet for ${message.author.tag}`)
    .setDescription(`Balance: ${balance}`)
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
    guildOnly: true,
    
    description: 'Shows balance of yourself or another user.',
    example: ['balance', 'bal <user>']
}