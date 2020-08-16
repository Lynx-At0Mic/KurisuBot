let BottleSpinAsync = async(client, message, args, services) =>{
    let users = message.mentions.members.array();
    if(users.length < 2){
        let embed = services.CommandErrorEmbed().setDescription('Please @ 2 or more users to bottle spin with.');
        await message.channel.send(embed);
        return;
    }

    let embedSpinning = services.GameEmbed()
    .setTitle('Bottle Spin')
    .setDescription('Spinning...');

    let embedSpun = services.GameEmbed()
    .setTitle('Bottle Spin')
    .setDescription(`Bottle lands on ${users[Math.floor(Math.random() * users.length)]}!`);

    await message.channel.send(embedSpinning)
    .then(game => {setTimeout(function(){
        game.edit(embedSpun);
    }, 3000)});
}

module.exports = {
    run: BottleSpinAsync,
    command: 'bottlespin',
    alias: ['spin', 'bottle'],
    perms: [],
    argsmin: 1,
    argsmax: -1,
    guildOnly: true,
    timeout: 0,
    
    description: 'Spins a bottle (picks a random person mentioned).',
    example: ['bottlespin @catte#1111 @Amadeus @Keegan', 'spin @catte#1111 @Amadeus @Keegan']
}