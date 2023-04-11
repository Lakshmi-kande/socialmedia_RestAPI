const { constants } = require("../constants");
const User = require("../models/User")
const router = require("express").Router();
const bcrypt = require("bcrypt")

// update user
router.put("/:id", async(req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }catch(err){
                return res.status(constants.SERVER_ERROR).json(err)
            }
        }
        try{
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(constants.NOT_FOUND).json("Account has been updated")
        }catch(err){
            return res.status(constants.SERVER_ERROR).json(err);
        }
    }else{
        return res.status(constants.CONFLICT_ERROR).json("you can update only your account!");
    }
})

// delete user
router.delete("/:id", async(req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        try{
            await User.findByIdAndDelete(req.params.id);
            res.status(constants.NOT_FOUND).json("Account has been deleted")
        }catch(err){
            return res.status(constants.SERVER_ERROR).json(err);
        }
    }else{
        return res.status(constants.CONFLICT_ERROR).json("you can delete only your account!");
    }
})

// get a user
router.get("/:id", async (req, res)=>{
    try{
        const user = await User.findById(req.params.id);
        const {password,updatedAt,...other} = user._doc
        res.status(constants.NOT_FOUND).json(other)
    }catch(err){
        res.status(constants.SERVER_ERROR).json(err);
    }
});


// folow a user 
router.put("/:id/follow", async (req,res)=>{
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push: { followers: req.body.userId } })
                await currentUser.updateOne({$push: { followings: req.params.userId } })
                res.status(constants.NOT_FOUND).json("user has been followed");
            }else{
                res.status(constants.CONFLICT_ERROR).json("you already follow this user")
            }
        }catch(err){
            res.status(constants.SERVER_ERROR).json(err);
        }
    }else{
        res.status(constants.CONFLICT_ERROR).json("you cant follow yourself");
    }
})

// unfollow user
router.put("/:id/unfollow", async (req,res)=>{
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull: { followers: req.body.userId } })
                await currentUser.updateOne({$pull: { followings: req.params.userId } })
                res.status(constants.NOT_FOUND).json("user has been unfollowed");
            }else{
                res.status(constants.CONFLICT_ERROR).json("you dont follow this user")
            }
        }catch(err){
            res.status(constants.SERVER_ERROR).json(err);
        }
    }else{
        res.status(constants.CONFLICT_ERROR).json("you cant unfollow yourself");
    }
})

module.exports = router;