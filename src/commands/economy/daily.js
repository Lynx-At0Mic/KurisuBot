let DailyAsync = async(client, message, args, services) =>{
    const dailyamount = 500;
    let isSuccess = await services.economy.addFunds(message.guild.id, message.author.id, dailyamount);
    if(isSuccess === true){await message.channel.send(services.CommandSuccessEmbed(`You collected your daily reward of ${dailyamount}!`));}
    else{
        await message.channel.send(services.CommandErrorEmbed('Something went wrong...'));
        return true;
    }
}

module.exports = {
    run: DailyAsync,
    command: 'daily',
    alias: [],
    perms: [],
    argsmin: 0,
    argsmax: 0,
    guildOnly: true,
    timeout: 82800,  // 23 hours
    
    description: 'Collect daily currency rewards',
    example: ['daily']
}