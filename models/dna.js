import sequelize from 'sequelize';
import db from '../db/db';

var dna = db.connection.define('dna', {
    Id: {
        type: sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    sequence: {
       type: sequelize.STRING,
       allowNull: false,
       validate: {
           notEmpty: { msg: 'Sequence is a required field.'}
       }
    },
    success: {
        type: sequelize.TINYINT(1),
        allowNull: false,
    }
}, {
    freezeTableName: true,
    timestamps: false
});

export default dna;