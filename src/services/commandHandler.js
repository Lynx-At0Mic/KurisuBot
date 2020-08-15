const fs = require('fs').promises;
const path = require('path');

class Command{
    constructor(commandModule, group){
        this.group = group;
        this.cmdmodule = commandModule;
        this.permissions = group.GROUP_PERMISSIONS.concat(commandModule.perms);
    }

    hasDefinition(definition){
        if(definition == this.cmdmodule.command || this.cmdmodule.alias.includes(definition)){
            return true;
        }
        return false;
    }

    async run(client, message, args, services){
        await this.cmdmodule.run(client, message, args, services);
    }
}

class CmdHandler{

    constructor(client, services){
        this.client = client;
        this.services = services
        this.commandsList = [];
    }

    async executeCommandAsync(message){
        let args = message.content;
        args = await args.substring(this.services.prefix.length, args.length).split(new RegExp(/\s+/));  // split up arguments and remove prefix
        let usrCommand = args[0].toLowerCase();
        args = args.slice(1);  // remove command from args

        let missingPerms = '';
        let guildUser = null;

        for(let command of this.commandsList){
            if(command.hasDefinition(usrCommand)){
                if(!message.guild === null){
                    try{
                        guildUser = await this.client.guilds.resolve(message.guild.id).member(message.author);
                        for(let permission of command.permissions){
                            if(!guildUser.hasPermission(permission)){ missingPerms += permission + '\n'; }
                        }
                    }

                    catch(e){
                        await message.channel.send('Unable to check user permissions');
                        return;
                    }
                }
                if(missingPerms != ''){
                    let permErrorEmbed = this.services.CommandErrorEmbed()
                    .setTitle('Permission Error')
                    .addField(`You are missing the following permissions for '${command.cmdmodule.command}':`, missingPerms.trim());
                    message.channel.send(permErrorEmbed);
                    return;
                }
                if(message.guild === null && command.cmdmodule.guildOnly){  // check if command is in a dm, and if it can run in a dm
                    await message.channel.send(this.services.CommandErrorEmbed('This command can only be run in a server!'));
                    return;
                }

                if(args.length < command.cmdmodule.argsmin){
                    let argsErrorEmbed = this.services.CommandErrorEmbed().setDescription(`The command '${command.cmdmodule.name}' requires at least ${command.cmdmodule.argsmin} argument(s).`);
                    await message.channel.send(argsErrorEmbed);
                }
                else if(args.length > command.cmdmodule.argsmax && command.cmdmodule.argsmax != -1){
                    if(command.argsmax === 0){
                        let argsErrorEmbed = this.services.CommandErrorEmbed().setDescription(`The command '${command.cmdmodule.name}' does not take any arguments.`);
                        await message.channel.send(argsErrorEmbed);
                    }
                    else{
                        let argsErrorEmbed = this.services.CommandErrorEmbed().setDescription(`The command '${command.cmdmodule.name}' accepts a maximum of ${command.cmdmodule.argsmax} argument(s).`);
                        await message.channel.send(argsErrorEmbed);
                    }
                }
                else{
                    await command.run(this.client, message, args, this.services);
                }
                return;
            }
        }
    }

    async registerCommandsAsync(cmdPath){
        let folders = await fs.readdir(cmdPath);
        let commandFiles = '';
        let commandGroups = [];
        
        for(let folder of folders){
            try {commandFiles = await fs.readdir(path.join(cmdPath, folder));}
            catch{continue;}
            if (!commandFiles.includes('group.json')){ continue; }
            let groupParams = require(path.join(cmdPath, folder, 'group.json'));
            commandGroups.push(groupParams);
            for(let file of commandFiles){
                if(file.endsWith('.js') && !file.startsWith('_')){ // js files that start with an underscore are ignored
                    let commandModule = require(path.join(cmdPath, folder, file));
                    this.commandsList.push(new Command(commandModule, groupParams));
                }
            }
        }
        this.services.commands = this.commandsList;  // used only by help command as of now
        this.services.commandGroups = commandGroups;
    }
}

module.exports = CmdHandler;