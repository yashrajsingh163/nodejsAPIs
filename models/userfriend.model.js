const { DataTypes } = require('sequelize');
const sequelize = require('./connection');

const UserFriend = sequelize.define('user_friends', {
    id: {
        primaryKey:true,
        type: DataTypes.STRING 
    },
    userFrom: {
        type: DataTypes.STRING,
        defaultValue:null 
    },
    userTo: {
        type: DataTypes.STRING,
        defaultValue:null 
    },
    status: {
        type: DataTypes.STRING,
        defaultValue:null 
    }
}, {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
}); 
module.exports = UserFriend;