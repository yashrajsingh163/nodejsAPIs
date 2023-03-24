const Userfriend = require('../models/userfriend.model')
const User = require('../models/user.model')
const { Op } = require("sequelize");


exports.sendRequest = async(req, res)=>{
    const checkRequest = await Userfriend.findAll({
        where: {
            userFrom: req.body.userFrom,
            userTo: req.body.userTo
        }
    })
    if(checkRequest.length){
        await Userfriend.destroy({
            where: {
                userFrom: req.body.userFrom,
                userTo: req.body.userTo
            }
        })
        return res.status(200).json({ message: 'unfriend done' });
    }
    req.body['status'] = 0
    const user = await Userfriend.create(req.body);

    return res.json({"message":"request sent successfully"});
}

exports.checkFriendRequest = async(req, res)=>{
    const checkRequest = await Userfriend.findAll({
        raw:true,
        where: {
            userTo: req.query.userId,
            status : 0
        }
    })
    if(checkRequest.length){
        let returnArr = []
        for(let i in checkRequest){
            console.log(checkRequest[i])
            isExist = await User.findOne({
                where: {
                    uniqueID: checkRequest[i].userFrom
                }
            })
            returnArr.push(isExist)
        }
        return res.json(returnArr);
    }else{
        return res.status(400).json({ message: 'unfriend done' });
    }

}


exports.acceptFriendRequest = async(req, res)=>{
    console.log(req.query.friendId,req.query.userId)
    const acceptReq = await Userfriend.findOne(
       { where: {
            userFrom: req.query.friendId,
            userTo:req.query.userId,
        }
    }
    )
    if(acceptReq){
        await acceptReq.update({ status: 1 });
        return res.json({message: 'accepted'});
    }else{
        return res.status(400).json({ message: 'error' });
    }

}

exports.friendList = async(req, res)=>{
    const checkRequest = await Userfriend.findAll({
        raw:true,
        where: {
            [Op.or]: [
                {
                    userTo: req.query.userId,
                    status : 1
                },
                {
                    userFrom: req.query.userId,
                    status : 1
                }
            ],
        }
    })
    if(checkRequest.length){
        let returnArr = []
        for(let i in checkRequest){
            if(checkRequest[i].userFrom == req.query.userId){
                isExist = await User.findOne({
                    where: {
                        uniqueID: checkRequest[i].userTo
                    }
                })
            }else{
                isExist = await User.findOne({
                    where: {
                        uniqueID: checkRequest[i].userFrom
                    }
                })
            }           
            returnArr.push(isExist)
        }
        return res.json(returnArr);
    }else{
        return res.status(400).json({ message: 'unfriend done' });
    }

}