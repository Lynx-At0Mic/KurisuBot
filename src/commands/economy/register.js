let RegisterAsync = async(client, message, args, services) =>{
    let queryResult = await services.database.query(`SELECT * FROM currency WHERE guildID = ${message.guild.id} AND userID = ${message.author.id}`);
    if(queryResult) {
        await message.channel.send(services.CommandErrorEmbed().setDescription('You are already registered!'));
        return;
    }
    await services.database.query(`INSERT INTO currency VALUES(${message.guild.id}, ${message.author.id}, 0)`)
    .catch(async (err) => {
        console.log(err);
        await message.channel.send(services.CommandErrorEmbed('Error adding user to database!'));
    });
    await message.channel.send(services.CommandSuccessEmbed(`${message.author} successfully registered into economy system!`));

}

module.exports = {
    run: RegisterAsync,
    command: 'register',
    alias: [],
    perms: [],
    argsmin: 0,
    argsmax: 0,  
    
    description: 'Registers user into the economy system.',
    example: ['register']
}