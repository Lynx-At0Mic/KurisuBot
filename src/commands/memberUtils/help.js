let helpAsync = async(client, message, args, services) => {
    if(args.length === 0 || parseInt(args[0])){
        if(!parseInt(args[0])){ args[0] = '1';}
        args[0] = parseInt(args[0]);
        let maxPage = Math.ceil(services.commandGroups.length / 9);
        while(args[0] * 9 >= services.commandGroups.length + 9){
            args[0]--;
        }
        args[0]--;

        let itemCount = 0;
        let helpEmbed = services.HelpEmbed()
        .setTitle('Help Page')
        .setDescription(`Type '${services.prefix}help {group}' for more detail or...\nType '${services.prefix}help {page}' to go to the next page`)
        .setFooter(`page ${args[0]+1} / ${maxPage}`);

        for(let group of services.commandGroups.slice(args[0] * 9)){
            if(itemCount >= 8){ break; }
            helpEmbed.addField(group, '\u200B', true);
            itemCount++;
        }

        await message.channel.send(helpEmbed);
        return;
    }

    for(let command of services.commands){
        if(command.hasDefinition(args[0])){
            let helpEmbed = services.HelpEmbed()
            .setTitle(`Help for '${command.name}'`)
            .setFooter(services.footershort)
            .addField('Description', command.description);

            let exampleString = '';

            for(let examp of command.example){
                exampleString += services.prefix + examp + '\n';
            }
            if(exampleString == ''){helpEmbed.addField('Example Usage', 'No examples given', true);}
            else{helpEmbed.addField('Example Usage', exampleString.trim(), true);}
            if(command.alias == '' || command.alias === undefined){helpEmbed.addField('Alias\'s', 'None', true);}
            else{helpEmbed.addField('Alias\'s', command.alias, true);}

            await message.channel.send(helpEmbed);
            return;
        }
    }

    for(let group of services.commandGroups){
        if(group.toLowerCase() == args[0]){
            if(!parseInt(args[1])){ args[1] = '1';}
            args[1] = parseInt(args[1]);
            let groupCount = 0;
            for(let command of services.commands){
                if(command.group.toLowerCase() == args[0]){ groupCount++; }
            }
            let maxPage = Math.ceil(groupCount / 9);
            while(args[1] * 9 >= groupCount + 9){
                args[1]--;
            }
            args[1]--;
            let itemCount = 0;
            let helpEmbed = services.HelpEmbed()
            .setTitle('Help Page')
            .setDescription(`Type '${services.prefix}help {command}' for more detail or...\nType '${services.prefix}help {group} {page}' to go to the next page`)
            .setFooter(`page ${args[1]+1} / ${maxPage}`);

            for(let cmd of services.commands.slice(args[1] * 9)){
                if(itemCount >= 8){ break; }
                if(cmd.group.toLowerCase() != args[0]){ continue; }
                helpEmbed.addField(cmd.name, cmd.description, true);
                itemCount++;
            }

            await message.channel.send(helpEmbed);
            return;
        }
    }

    let helpEmbed = services.CommandErrorEmbed()
    .setTitle('Inavlid command or command group')
    .setColor('#FF0000');

    await message.channel.send(helpEmbed);
}


module.exports = {
    run: helpAsync,
    command: 'help',
    alias: [],
    perms: [],
    argsmin: 0,
    argsmax: 2,  
    
    description: 'Shows information about all commands.',
    example: ['help', 'help av', 'help member_utilities']
}
