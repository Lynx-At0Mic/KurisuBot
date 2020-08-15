const {getLastImage, Canvas} = require('./_tools');
let CaptionTopAsync = async(client, message, args, services) =>{
    let userattachment = await getLastImage(message)
    if(!userattachment){
        message.channel.send(services.CommandErrorEmbed('No image found!'));
        return;
    }

    let captionHeight;
    if(userattachment.width - userattachment.height > userattachment.width / 3){
        captionHeight = Math.floor(userattachment.width / 4);
    }
    else{
        captionHeight = Math.floor(userattachment.height / 5);
    }
    let fontsize = captionHeight / 1.7;

    const canvas = Canvas.createCanvas(userattachment.width, userattachment.height + captionHeight);
    const ctx = canvas.getContext('2d');
    
    ctx.font = `bold ${fontsize}px sans-serif`;
    while(ctx.measureText(args.join(' ')).width > userattachment.width - userattachment.width / 10){
        fontsize -= 2;
        ctx.font = `bold ${fontsize}px sans-serif`;
    }

	const background = await Canvas.loadImage(userattachment.url);
    ctx.drawImage(background, 0, captionHeight, canvas.width, userattachment.height);
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, captionHeight);
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(args.join(' '), canvas.width / 2, captionHeight / 2);
    
    const attachment = new services.Discord.MessageAttachment(canvas.toBuffer(), 'kimg_' + userattachment.name);

    await message.channel.send(attachment);
}

module.exports = {
    run: CaptionTopAsync,
    command: 'captiontop',
    alias: ['caption1', 'caption', 'captop', 'cap1', 'cap'],
    perms: [],
    argsmin: 1,
    argsmax: -1,  
    
    description: 'Captions the last image posted in chat.',
    example: ['caption You\'re going to brazil']
}