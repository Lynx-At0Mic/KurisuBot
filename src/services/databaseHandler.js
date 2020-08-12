const mysql = require('mysql2/promise');

class Database{
    constructor(user, passwd, host, database, tables){
        this.db = mysql.createPool({
            host: host,
            user: user,
            password: passwd,
            database: database,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

    }
    
    endConnection(){
        this.db.end();
        this.dbConnected = false;
        console.log('Database connection terminated');
    }

    async query(sql, args=[]){
        let queryResult = await this.db.query(sql, args).catch(err => {console.log(err); return false;});
        if(queryResult[0] == '') return false;
        return queryResult[0][0];
    }
}

module.exports = Database;