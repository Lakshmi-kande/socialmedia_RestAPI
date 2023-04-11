const router = require("express").Router();
const { constants } = require("../constants");
const Post = require("../models/Post");
const User = require("../models/User")


// create a post
router.post("/",async (req,res)=>{
    const newPost = new Post(req.body)
    try{
        const savedPost = await newPost.save();
        res.status(constants.SUCCESSFULL_REQUEST).json(savedPost);
    }catch(err){
        res.status(constants.SERVER_ERROR).json(err)
    }
})

// update a post
router.put("/:id",async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
            await post.updateOne({$set:req.body});
            res.status(constants.SUCCESSFULL_REQUEST).json("The post has been updated")
        }else{
            res.status(constants.FORBIDDEN).json("you can update only your post")
        }
    }catch(err){
        res.status(constants.SERVER_ERROR).json(err)
    }

    
})

// delete a post
router.delete("/:id",async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
            await post.deleteOne();
            res.status(constants.SUCCESSFULL_REQUEST).json("The post has been deleted")
        }else{
            res.status(constants.FORBIDDEN).json("you can delete only your post")
        }
    }catch(err){
        res.status(constants.SERVER_ERROR).json(err)
    }

    
})

// like/dislike  a post
router.put("/:id/like",async (req,res) =>{
    try{
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push:{likes: req.body.userId} });
            res.status(constants.SUCCESSFULL_REQUEST).json("The post has been liked")
        }else{
            await post.updateOne({$pull :{likes: req.body.userId } });
            res.status(constants.SUCCESSFULL_REQUEST).json("The post has been disliked")
        }
    }catch(err){
        res.status(constants.SERVER_ERROR).json(err);
    }
});

// get a post
router.get("/:id", async(req,res) => {
    try{
        const post = await Post.findById(req.params.id)
        res.status(constants.SUCCESSFULL_REQUEST).json(post)
    }catch(err){
        res.status(constants.SERVER_ERROR).json(err)
    }
})

// get timeline posts
router.get("/timeline/all", async(req,res)=>{
    try{
        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.find({ userId: currentUser._id });
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId)=>{
                return Post.find({ userId: friendId});
            })
        )
        res.json(userPosts.concat(...friendPosts))
    }catch(err){
        res.status(constants.SERVER_ERROR).json(err);
    }
})


module.exports = router;









