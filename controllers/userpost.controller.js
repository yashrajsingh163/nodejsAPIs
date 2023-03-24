const Userpost = require('../models/userpost.model')
const multer = require('multer')
const path = require("path")

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
  
        // Uploads is the Upload_folder_name
        cb(null, "uploads")
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now()+".jpg")
    }
  })
       
// Define the maximum size for uploading
// picture i.e. 1 MB. it is optional
const maxSize = 1 * 1000 * 1000;
    
var  upload = multer({ 
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: function (req, file, cb){
    
        // Set the filetypes, it is optional
        var filetypes = /jpeg|jpg|png/;
        var mimetype = filetypes.test(file.mimetype);
  
        var extname = filetypes.test(path.extname(
                    file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        }
      
        cb("Error: File upload only supports the "
                + "following filetypes - " + filetypes);
      } 
  
// mypic is the name of file attribute
}).single("postImage"); 


exports.createPost =async (req, res)=>{

    upload(req,res, async function(err) {
        if(err) {
            res.send(err)
        }
        else {
            if(!req.file) return res.status(400).json({message:"please provide image"})
            req.body['url'] = req.file.filename;
            const user = await Userpost.create(req.body);
            return res.status(200).json({ message: 'post added successfully' });
        }
    })
}


exports.userGettingPost = async(req, res)=>{
    const post = await Userpost.findAll({
        where: {
            userId: req.query.userId
        },
        order: [
            ['id', 'DESC'],
        ],
        // limit:10
    }
    )
    return res.json(post);
}

