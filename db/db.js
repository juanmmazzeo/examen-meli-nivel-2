import sequelize from 'sequelize';

var db = {
  connection: new sequelize('examenml', 'root', 'admin', {
    host: 'localhost',
    dialect: 'mysql',
  
    pool: {
      max: 1000,
      min: 0,
      acquire: 10000,
      idle: 10000
    },
    timezone: '-03:00'
  }),
  authenticate: async function(){
    return await this.connection
      .authenticate()
      .then(function(e){
        console.log('Successfully connected to database.', e);
        return true;
      })
      .catch(function(err){
        console.log('Cannot connect to database');
        return false;
      });
  }
}

export default db;