const { DataTypes } = require('sequelize');
const sequelize = require('./connection');

const Userpost = sequelize.define('User_post', {
    userId: {
        type: DataTypes.STRING 
    },
    url: {
        type: DataTypes.STRING,
        defaultValue:null 
    },
    message: {
        type: DataTypes.STRING,
        defaultValue:null 
    },
    ip: {
        type: DataTypes.STRING,
        defaultValue:null 
    }
}, {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
}); 
module.exports = Userpost;