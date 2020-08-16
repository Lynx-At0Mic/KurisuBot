const {getLastImage, Canvas} = require('./_tools');
let DemotivationalAsync = async(client, message, args, services) =>{
    const userattachment = await getLastImage(message);
    if(!userattachment){
        message.channel.send(services.CommandErrorEmbed('No image found!'));
        return;
    }

    const posterWidth = userattachment.width + Math.floor(userattachment.width / 5) * 2;  // calculate dimentions
    const margin = Math.floor((posterWidth - userattachment.width) / 2);
    const bottomMargin = Math.floor(posterWidth / 3);
    const posterHeight = margin + bottomMargin + userattachment.height;
    const padding = Math.floor(posterWidth / 30);
    const lineWidth = Math.floor(posterWidth / 120);
    let fontsize = Math.floor(bottomMargin / 1.7);

    const canvas = Canvas.createCanvas(posterWidth, posterHeight);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#000000';  // create background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ffffff';  // create white box
    ctx.fillRect(margin - padding - lineWidth, margin - padding - lineWidth,
        userattachment.width + (padding + lineWidth) * 2, userattachment.height + (padding + lineWidth) * 2);

    ctx.fillStyle = '#000000';  // create outline
    ctx.fillRect(margin - padding, margin - padding,
        userattachment.width + padding * 2, userattachment.height + padding * 2);

    const background = await Canvas.loadImage(userattachment.url);  // place image
    ctx.drawImage(background, margin, margin, userattachment.width, userattachment.height);

    ctx.font = `${fontsize}px sans-serif`; // calculate font size
    while(ctx.measureText(args.join(' ')).width > posterWidth - posterWidth / 10){
        fontsize -= 2;
        ctx.font = `bold ${fontsize}px sans-serif`;
    }
    
    ctx.fillStyle = '#ffffff';  // draw text
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(args.join(' '), Math.floor(posterWidth / 2), Math.floor(posterHeight - bottomMargin / 2));

    const attachment = new services.Discord.MessageAttachment(canvas.toBuffer(), 'kimg_' + userattachment.name);
    await message.channel.send(attachment);
}

module.exports = {
    run: DemotivationalAsync,
    command: 'demotivational',
    alias: ['dem', 'poster'],
    perms: [],
    argsmin: 0,
    argsmax: -1,
    guildOnly: true,
    timeout: 0,
    
    description: 'Creates a demotivational poster using the last image in chat',
    example: ['dem 9.5 platinum coins', 'demotivational 17 smackaroons']
}