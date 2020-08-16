class Economy{
    constructor(db){
        this.database = db;
        this.currencyTable = 'economy'
    }

    async registerUser(guildid, userid){
        await this.database.query(`INSERT INTO ${this.currencyTable} VALUES(${guildid}, ${userid}, 0)`)
    }

    async addFunds(guildid, userid, amount){
        let currentBalance = await this.getFunds(guildid, userid);
        let queryResult = await this.database.query(`UPDATE ${this.currencyTable} SET balance = ${currentBalance + amount} WHERE guildID = ${guildid} AND userID = ${userid}`);
        if(queryResult === undefined){return true;}
        return false;
    }

    async removeFunds(guildid, userid, amount){
        let currentBalance = await this.getFunds(guildid, userid);
        if(currentBalance - amount > 0){
            return 'Insufficiant funds!';
        }
        let queryResult = await this.database.query(`UPDATE ${this.currencyTable} SET balance = ${currentBalance - amount} WHERE guildID = ${guildid} AND userID = ${userid}`);
        console.log(queryResult);
    }

    async getFunds(guildid, userid){
        let queryResult = await this.database.query(`SELECT balance FROM ${this.currencyTable} WHERE guildID = ${guildid} AND userID = ${userid}`);
        if(!queryResult){
            this.registerUser(guildid, userid);
            return 0;
        }
        return queryResult.balance;
    }

}

module.exports = Economy;