
var mysql = require('mysql');
var mySqlConnectionString = require('./mySqlConnectionString.js');

var mySqlConnectionProvider = {
    getSqlConnection : function () {
        var connection = mysql.createConnection(mySqlConnectionString.mySqlConnectionString.connectiongString.development);

        connection.connect(function (error) {
            if (error) {
                throw error
            } else { 
                console.log("Connection successfull");
            }           
        });

        return connection;
    },

    closeSqlConnection : function (currentConnection) {
        currentConnection.end(function (error) {
            if (error) {
                throw error
            } else { 
                console.log("Connection closed");
            }            
        });
    }
}

exports.mySqlConnectionProvider = mySqlConnectionProvider;