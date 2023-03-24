const User = require('../models/user.model');
const Userfriend = require('../models/userfriend.model')
const cache = require('../utils/cache');
const jwtConfig = require('../config/jwt');
const jwt = require('../utils/jwt');
const bcrypt = require('bcrypt');
const random = require('../common/index')
const { Op } = require("sequelize");


exports.register = async (req, res) => {
    let isExist
    const email = req.body.email
    let isNumber = isNaN(email)
    if (isNumber) {
        isExist = await User.findOne({
            where: {
                email: req.body.email
            }
        })
    } else {
        isExist = await User.findOne({
            where: {
                mobile: req.body.email
            }
        })
    }

    if (isExist) {
        return res.status(400).json({ message: 'Email/Mobile already exists.' });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    let insertObj = {
        firstName: req.body.firstName.trim().toLowerCase(),
        password: hashedPassword,
        uniqueID: random.rendomString()
    }
    insertObj[isNumber ? "email" : "mobile"] = req.body.email
    const user = await User.create(insertObj);
    const token = await jwt.createToken({ id: user.id });
    rtnObj = {
        "name":`${user.firstName} ${user.lastName}`,
        access_token : token,
        id: user.uniqueID,
        token_type: 'Bearer',
        expires_in: jwtConfig.ttl
    }
    return res.json(rtnObj);
}

exports.login = async (req, res) => {
    const user = await User.findOne({
        where: {
            email: req.body.email
        }
    });
    if (user) {
        const isMatched = await bcrypt.compare(req.body.password, user.password);
        if (isMatched) {
            const token = await jwt.createToken({ id: user.id });
            return res.json({
                id: user.uniqueID,
                name: user.firstName,
                access_token: token,
                token_type: 'Bearer',
                expires_in: jwtConfig.ttl
            });
        }
    }
    return res.status(400).json({ message: 'Unauthorized' });
}

exports.getUser = async (req, res) => {
    const user = await User.findByPk(1);
    return res.json(user);
}

exports.logout = async (req, res) => {
    const token = req.token;
    const now = new Date();
    const expire = new Date(req.user.exp);
    const milliseconds = now.getTime() - expire.getTime();
    /* ----------------------------- BlackList Token ---------------------------- */
    await cache.set(token, token, milliseconds);

    return res.json({ message: 'Logged out successfully' });
}

exports.userSerach = async (req,res)=>{
    const search = req.query.search
    const userId = req.query.userId
    let users = await User.findAll({
        raw: true,
        where: {
            firstName: {
                [Op.like]: `%${search}%`,
            },
            [Op.not]:[{
                uniqueID:[userId]
            }]
        },
        order: [
            ['id', 'DESC'],
        ],
        }
    )

    for(let i in users){
        const userFriend = await Userfriend.findOne({
            where: {
                [Op.or]: [
                    { userTo: userId,
                        userFrom : users[i].uniqueID,
                        status:0,
                    
                    },
                    {
                        userTo: users[i].uniqueID,
                        userFrom : userId,
                        status:0,
                    }
                  ]
            }
        })
        if(userFriend){
            users[i]['status'] = 1
        }else{
            users[i]['status'] = 0
        }
    }
    return res.json(users);
}