const fs = require('fs').promises;
const path = require('path');

class Command{
    constructor(name, group, alias, description, example, cmdmodule, argsmin, argsmax, permissions){
        this.name = name;
        this.group = group;
        this.alias = alias;
        this.description = description;
        this.example = example
        this.cmdmodule = cmdmodule;
        this.argsmin = argsmin;
        this.argsmax = argsmax;
        this.permissions = permissions;
    }

    hasDefinition(definition){
        if(definition == this.name || this.alias.includes(definition)){
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
        if(message.guild === null){ return; }
        let args = message.content;
        // let args = message.content.toLowerCase();  // why did we do this to begin with?
        args = await args.substring(this.services.prefix.length, args.length).split(new RegExp(/\s+/));  // split up arguments and remove prefix
        let usrCommand = args[0].toLowerCase();
        args = args.slice(1);  // remove command from args

        let missingPerms = '';
        let guildUser = await this.client.guilds.resolve(message.guild.id).member(message.author);  // get guild user for perms check

        for(let command of this.commandsList){
            if(command.hasDefinition(usrCommand)){
                try{
                    for(let permission of command.permissions){
                        if(!guildUser.hasPermission(permission)){ missingPerms += permission + '\n'; }
                    }
                }

                catch(e){
                    await message.channel.send('Unable to check user permissions');
                    // console.log(e);
                    return;
                }
                if(missingPerms != ''){
                    let permErrorEmbed = this.services.CommandErrorEmbed()
                    .setTitle('Permission Error')
                    .addField(`You are missing the following permissions for '${command.name}':`, missingPerms.trim());
                    message.channel.send(permErrorEmbed);
                    return;
                }

                if(args.length < command.argsmin){
                    let argsErrorEmbed = this.services.CommandErrorEmbed().setDescription(`The command '${command.name}' requires at least ${command.argsmin} argument(s).`);
                    await message.channel.send(argsErrorEmbed);
                }
                else if(args.length > command.argsmax && command.argsmax != -1){
                    if(command.argsmax === 0){
                        let argsErrorEmbed = this.services.CommandErrorEmbed().setDescription(`The command '${command.name}' does not take any arguments.`);
                        await message.channel.send(argsErrorEmbed);
                    }
                    else{
                        let argsErrorEmbed = this.services.CommandErrorEmbed().setDescription(`The command '${command.name}' accepts a maximum of ${command.argsmax} argument(s).`);
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
            commandGroups.push(groupParams.NAME);
            for(let file of commandFiles){
                if(file.endsWith('.js') && !file.startsWith('_')){ // js files that start with an underscore are ignored
                    let commandModule = require(path.join(cmdPath, folder, file));
                    this.commandsList.push(new Command(commandModule.command, groupParams.NAME, commandModule.alias,
                        commandModule.description, commandModule.example,commandModule, commandModule.argsmin, commandModule.argsmax,
                        groupParams.GROUP_PERMISSIONS.concat(commandModule.perms)));
                }
            }
            this.services.commands = this.commandsList;  // used only by help command as of now
            this.services.commandGroups = commandGroups;
        }
    }
}

module.exports = CmdHandler;