const request = require('request');
const {getLastImage} = require('./_tools');
let WhatAnimeAsync = async(client, message, args, services) =>{
    const userattachment = await getLastImage(message);
    if(!userattachment){
        message.channel.send(services.CommandErrorEmbed('No image found!'));
        return;
    }

    const apiRequest = `https://trace.moe/api/search?url=${userattachment.url}`;

    request(apiRequest, { json: true }, async (err, res, body) => {
        if (err) { 
            await message.channel.send(services.CommandErrorEmbed('API Error!'));
        }
        else if(!body.docs[0]){
            await message.channel.send(services.InfoEmbed()
            .setTitle('Anime Search')
            .setDescription('No match found!')
            .setImage(userattachment.url));
        }
        else{
            const match = body.docs[0];
            let timefrom;
            let timeto;
            if(match.from % 60 >= 10){timefrom = `${Math.floor(match.from / 60)}:${Math.floor(match.from % 60)}`}
            else{timefrom = `${Math.floor(match.from / 60)}:0${Math.floor(match.from % 60)}`}
            if(match.to % 60 >= 10){timeto = `${Math.floor(match.to / 60)}:${Math.floor(match.to % 60)}`}
            else{timeto = `${Math.floor(match.to / 60)}:0${Math.floor(match.to % 60)}`}

            const embed = services.InfoEmbed()
            .setTitle('Anime Search')
            .setDescription(`Similarity: ${(match.similarity * 100).toFixed(1)}%`)
            .setThumbnail(userattachment.url)
            .addField('Kanji/Kana', match.title_native)
            .addField('Romaji', match.title_romaji)
            .addField('English', match.title_english)
            .addField('Episode', match.episode, true)
            .addField('From', timefrom, true)
            .addField('To', timeto, true);

            if(match.isAsult === true){embed.addField('NSFW?', 'Yes 😏', true)}
            else{embed.addField('NSFW?', 'Nope 😞', true)}
            if(match.anilist_id){embed.addField('AniList ID', match.anilist_id, true)}
            if(match.mal_id){embed.addField('MAL ID', match.mal_id, true)}
            if(match.synonyms[0] !== undefined){embed.addField('Synonyms:', match.synonyms, false)}
            else{embed.addField('Synonyms:', 'None', false)}
            console.log(match.synonyms);

            await message.channel.send(embed);
        }
    });


}

module.exports = {
    run: WhatAnimeAsync,
    command: 'whatanime',
    alias: ['wait'],
    perms: [],
    argsmin: 0,
    argsmax: 0,
    guildOnly: true,
    timeout: 0,
    
    description: 'Searches for the anime that the last image posted in chat is from.',
    example: ['wait', 'whatanime']
}