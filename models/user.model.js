const { DataTypes } = require('sequelize');
const sequelize = require('./connection');

const User = sequelize.define('User', {
    uniqueID:{
        type: DataTypes.STRING
    },
    firstName: {
        type: DataTypes.STRING 
    },
    email: {
        type: DataTypes.STRING 
    },
    mobile: {
        type: DataTypes.STRING 
    },
    password: {
        type: DataTypes.STRING 
    }
}, {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
}); 
module.exports = User;