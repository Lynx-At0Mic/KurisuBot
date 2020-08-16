const fs = require('fs').promises;
const path = require('path');
const timeoutService = require('./timeoutService');

class Command{
    constructor(commandModule, group, database){
        this.group = group;
        this.cmdmodule = commandModule;
        this.timeout = new timeoutService(this.cmdmodule.command, this.cmdmodule.timeout * 1000 || 0, database);
        this.permissions = group.GROUP_PERMISSIONS.concat(commandModule.perms);
    }

    hasDefinition(definition){
        if(definition == this.cmdmodule.command || this.cmdmodule.alias.includes(definition)){
            return true;
        }
        return false;
    }

    async run(client, message, args, services){
        if(this.cmdmodule.timeout != 0 && this.cmdmodule.timeout != undefined){
            let inTimeout = false;
            let guild;
            if(message.guild !== null){guild = message.guild.id}
            else{guild = '\'DM\''}
            inTimeout = await this.timeout.hasTimeout(guild, message.author.id);
            if(inTimeout !== false){
                await message.channel.send(services.CommandErrorEmbed(`You can use this command again in ${inTimeout} seconds.`).setTitle('Timeout'));
                return;
            }
            let dontTimeout = await this.cmdmodule.run(client, message, args, services);
            if(dontTimeout !== true){await this.timeout.reset(guild, message.author.id, Date.now());}
        }
        else{await this.cmdmodule.run(client, message, args, services);}
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
        const timeoutTable = 'commandTimeout';
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
                    this.commandsList.push(new Command(commandModule, groupParams, this.services.database));
                    // ensure all commands with a timeout have a a place to store timeouts in database
                    if(commandModule.timeout != 0){
                        let sql = `ALTER TABLE ${timeoutTable} ADD ${commandModule.command} BIGINT NULL DEFAULT NULL`;
                        await this.services.database.verifyColumn('commandTimeout', commandModule.command, sql);
                    }
                }
            }
        }
        this.services.commands = this.commandsList;  // used only by help command as of now
        this.services.commandGroups = commandGroups;
    }
}

module.exports = CmdHandler;