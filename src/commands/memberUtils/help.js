let helpAsync = async(client, message, args, services) => {
    if(args.length === 0 || !RegExp('[a-zA-Z]').test(args[0])){
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
            for(let examp of command.cmdmodule.example){
                exampleString += services.prefix + examp + '\n';
            }
            let aliasString = '';
            for(let ali of command.cmdmodule.alias){
                aliasString += ali + '\n'
            }

            let helpEmbed = services.HelpEmbed()
            .setTitle(`Help for '${command.cmdmodule.command}'`)
            .setFooter(services.footershort)
            .addField('Command group', command.group.NAME, false)
            .addField('Description', command.cmdmodule.description || 'No description given', false)
            .addField('Example Usage', exampleString || 'No examples given', true)
            .addField('Alias\'s', aliasString || 'None', true);

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
                if(command.group.NAME.toLowerCase() == args[0].toLowerCase()){ groupCommandCount++; }
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
                if(cmd.group.NAME.toLowerCase() != args[0].toLowerCase()){ continue; }
                helpEmbed.addField(cmd.cmdmodule.command, cmd.cmdmodule.description, true);
                itemCount++;
            }

            await message.channel.send(helpEmbed);
            return;
        }
    }

    let helpEmbed = services.CommandErrorEmbed()
    .setDescription('Inavlid command or command group')
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
    guildOnly: false,
    timeout: 0,
    
    description: 'Shows information about all commands.',
    example: ['help', 'help av', 'help member_utilities']
}
