let helpAsync = async(client, message, args, services) => {
    if(args.length === 0 || !RegExp('[a-z]').test(args[0])){
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
        .addField('Command Groups', '\u200B', false)
        .setFooter(`page ${args[0]+1} / ${maxPage}`);

        for(let group of services.commandGroups.slice(args[0] * 9)){
            if(itemCount >= 8){ break; }
            helpEmbed.addField(group.NAME, group.DESCRIPTION, true);
            itemCount++;
        }

        await message.channel.send(helpEmbed);
        return;
    }

    for(let command of services.commands){
        if(command.hasDefinition(args[0].toLowerCase())){
            let exampleString = '';
            for(let examp of command.example){
                exampleString += services.prefix + examp + '\n';
            }
            let aliasString = '';
            for(let ali of command.alias){
                aliasString += ali + '\n'
            }

            let helpEmbed = services.HelpEmbed()
            .setTitle(`Help for '${command.name}'`)
            .setFooter(services.footershort)
            .addField('Command group', command.group.NAME, false)
            .addField('Description', command.description || 'No description given', false)
            .addField('Example Usage', exampleString || 'No examples given', true)
            .addField('Alias\'s', aliasString || 'None', true);
            console.log(command.alias);

            await message.channel.send(helpEmbed);
            return;
        }
    }

    for(let group of services.commandGroups){
        if(group.NAME.toLowerCase() == args[0].toLowerCase()){
            if(!parseInt(args[1])){ args[1] = '1';}
            args[1] = parseInt(args[1]);
            let groupCommandCount = 0;
            for(let command of services.commands){
                if(command.group.NAME.toLowerCase() == args[0]){ groupCommandCount++; }
            }
            let maxPage = Math.ceil(groupCommandCount / 9);
            while(args[1] * 9 >= groupCommandCount + 9){
                args[1]--;
            }
            args[1]--;
            let itemCount = 0;
            let helpEmbed = services.HelpEmbed()
            .setTitle('Help Page')
            .setDescription(`Type '${services.prefix}help {command}' for more detail or...\nType '${services.prefix}help {group} {page}' to go to the next page`)
            .addField('Commands', '\u200B', false)
            .setFooter(`page ${args[1]+1} / ${maxPage}`);

            for(let cmd of services.commands.slice(args[1] * 9)){
                if(itemCount >= 8){ break; }
                if(cmd.group.NAME.toLowerCase() != args[0]){ continue; }
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
