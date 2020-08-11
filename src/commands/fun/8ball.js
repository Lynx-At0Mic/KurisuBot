const responces = [
    "As I see it, yes.", "Ask again later.", "Better not tell you now.", "Cannot predict now.",
    "Concentrate and ask again.", "Don’t count on it.", "It is certain.", "It is decidedly so.",
    "Most likely.", "My reply is no.", "My sources say no.", "Outlook not so good.", "Outlook good.",
    "Reply hazy, try again.", "Signs point to yes.", "Very doubtful.", "Without a doubt.", "Yes.", 
    "Yes – definitely.", "You may rely on it."
];

let MagicBallAsync = async(client, message, args, services) =>{
    let responce = responces[Math.floor(Math.random() * responces.length)];

    if(!args[args.length - 1].endsWith('?')){args[args.length - 1] += '?';}

    let embed = services.GameEmbed()
    .setTitle(`${message.author.username} asks '${args.join(' ')}'\nMagic 8 Ball says...`)
    .setDescription(`'${responce}'`);

    await message.channel.send(embed);
}

module.exports = {
    run: MagicBallAsync,
    command: '8ball',
    alias: ['magic8ball', 'magicball'],
    perms: [],
    argsmin: 1,
    argsmax: -1,  
    
    description: 'Asks magic 8ball a question',
    example: ['8ball <question>', '8ball am i stupid']
}