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
        this.verifyTables(tables);
    }

    async verifyTables(tables){
        let dbError = false;
        for(let table in tables){
            await this.db.query(`SELECT * FROM ${table}`)
            .catch(async err => {
                if(err.code = 'ER_NO_SUCH_TABLE'){
                    await this.db.query(tables[table])  // create table using sql in config if table does not exist
                }
                else{dbError = true;}
            });
        }
        if(dbError){throw new Error('Database error!');}
    }
    
    async verifyColumn(table, column, creationSQL){
        let dbError = false;
        await this.db.query(`SELECT ${column} FROM ${table}`)
        .catch(async err => {
            if(err.code == 'ER_BAD_FIELD_ERROR'){
                await this.db.query(creationSQL);
            }
            else{dbError = true;}
        });
        if(dbError){throw new Error('Database error!');}
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