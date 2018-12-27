import sequelize from 'sequelize';

var connection = new sequelize('picandeat_api', 'root', 'admin', {
  host: 'localhost',
  dialect: 'mysql',

  pool: {
    max: 10,
    min: 0,
    acquire: 10000,
    idle: 10000
  },
  timezone: '-03:00'
});

function connectToDb(){
  connection
    .authenticate()
    .then(function(err){
      console.log('Successfully connected to database.');
    })
    .catch(function(err){
      console.log('Cannot conect to database: ', err);
    });
}

export default connection;