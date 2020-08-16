const {getLastImage, Canvas} = require('./_tools');
let CaptionBottomAsync = async(client, message, args, services) =>{
    const userattachment = await getLastImage(message);
    if(!userattachment){
        message.channel.send(services.CommandErrorEmbed('No image found!'));
        return;
    }

    let captionHeight;  // calculate caption height
    if(userattachment.width - userattachment.height > userattachment.width / 3){
        captionHeight = Math.floor(userattachment.width / 8);
    }
    else{
        captionHeight = Math.floor(userattachment.height / 8);
    }
    let fontsize = captionHeight / 1.7;  // set max font size based on caption height

    const canvas = Canvas.createCanvas(userattachment.width, userattachment.height + captionHeight);
    const ctx = canvas.getContext('2d');

    ctx.font = `${fontsize}px sans-serif`;  // calculate font dize
    while(ctx.measureText(args.join(' ')).width > userattachment.width - userattachment.width / 10){
        fontsize -= 2;
        ctx.font = `${fontsize}px sans-serif`;
    }

    const background = await Canvas.loadImage(userattachment.url);  // draw image
    ctx.drawImage(background, 0, 0, canvas.width, userattachment.height);
    
    ctx.fillStyle = '#ffffff';  // draw caption box
    ctx.fillRect(0, canvas.height - captionHeight, canvas.width, captionHeight);

    ctx.fillStyle = '#000000';  // draw caption text
    ctx.textBaseline = 'middle';
    ctx.fillText(args.join(' '), 0 + Math.floor(canvas.width / 20), canvas.height - Math.floor(captionHeight / 2));
    
    const attachment = new services.Discord.MessageAttachment(canvas.toBuffer(), 'kimg_' + userattachment.name);
    await message.channel.send(attachment);
}

module.exports = {
    run: CaptionBottomAsync,
    command: 'captionbottom',
    alias: ['caption2', 'capbot', 'cap2'],
    perms: [],
    argsmin: 1,
    argsmax: -1,
    guildOnly: false,
    timeout: 0,
    
    description: 'Captions the last image posted in chat.',
    example: ['captionbottom bruh', 'cap2 this is a fact']
}