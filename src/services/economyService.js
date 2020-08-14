class Economy{
    constructor(db){
        this.database = db;
    }

    async registerUser(guildid, userid){
        let error = false;
        let queryResult = await this.database.query(`SELECT * FROM currency WHERE guildID = ${guildid} AND userID = ${userid}`);
        if(queryResult) {
            error = 'You are already registered!';
        }
        else{
            await this.database.query(`INSERT INTO currency VALUES(${guildid}, ${userid}, 0)`)
            .catch((err) => {
                console.log(err);
                error = 'Error adding user to database!';
            });
        }
        return error;
    }

    async addFunds(guildid, userid, amount){
        let currentBalance = this.getFunds(guildid, userid);
        let queryResult = await this.database.query(`UPDATE currency SET value = ${currentBalance + amount} WHERE guildid = ${guildid} AND userID = ${userid}`);
        console.log(queryResult);
    }

    async removeFunds(guildid, userid, amount){
        let currentBalance = this.getFunds(guildid, userid);
        if(currentBalance - amount > 0){
            return 'Insufficiant funds!';
        }
        let queryResult = await this.database.query(`UPDATE currency SET value = ${currentBalance - amount} WHERE guildid = ${guildid} AND userID = ${userid}`);
        console.log(queryResult);
    }

    async getFunds(guildid, userid){
        let queryResult = await this.database.query(`SELECT value FROM currency WHERE guildID = ${guildid} AND userID = ${userid}`);
        if(!queryResult){
            this.registerUser(guildid, userid);
            return 0;
        }
        return queryResult.value;
    }

}

module.exports = Economy;