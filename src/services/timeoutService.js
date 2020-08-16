class Timeout{
    constructor(command, timeout, database){
        this.command = command;
        this.timeout = timeout;
        this.database = database;
        this.table = 'commandTimeout'
    }
    async hasTimeout(guildid, userid){
        let result = await this.database.query(`SELECT ${this.command} FROM ${this.table} WHERE guildID = ${guildid} AND userID = ${userid}`);
        if(result === false){
            return false;
        }
        if(Date.now() - result[this.command] >= this.timeout){
            return false;
        }
        else{ 
            return Math.floor((this.timeout - (Date.now() - result[this.command])) / 1000);
        }
    }
    async reset(guildid, userid, date){
        let result = await this.database.query(`SELECT ${this.command} FROM ${this.table} WHERE guildID = ${guildid} AND userID = ${userid}`);
        if(result === false){
            await this.database.query(`INSERT INTO ${this.table} ( guildID, userID, ${this.command} ) VALUES ( ${guildid}, ${userid}, ${date} )`);
        }
        else{
            await this.database.query(`UPDATE ${this.table} SET ${this.command} = ${date} WHERE guildID = ${guildid} AND userID = ${userid}`);
        }
    }
}

module.exports = Timeout;