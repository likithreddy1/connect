const express = require("express")
const router = express.Router();
const Post = require("../Models/Post");
const User = require("../Models/User");
//create a post
router.use(express.json());
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update post
router.put('/:id',async(req,res)=>{
    try{const post =await Post.findById(req.params.id)
    if(post.userId===req.body.userId){
        await post.updateOne({$set:req.body})
        res.status(200).json('post is updated')
    }
    else{
        res.status(403).json("you can't update other posts")
    }}
    catch(err){
        res.status(500).json(err)
    }
})

//delete
router.delete('/delete/:id', async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
            if(post.userId===req.body.id){
                await post.deleteOne()
                res.status(200).json('post is deleted')
            }
        else{
            res.status(403).json(req.body.id);
        }

    }catch(err){
        res.send(500).json(err)
    }
})

//like a post or dislike a post
router.put('/:id/like',async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(post.likes.includes(req.body.userId)){
           await post.updateOne({$pull:{likes:req.body.userId}})
            res.status(200).json('you have disliked this picture')
        }
        else{
           await post.updateOne({$push:{likes:req.body.userId}})
            res.status(200).json('you have liked this picture')
        }
    }catch(err){
        res.status(500).json(err)
    }
})
//add comment
router.put('/:id/comment',async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id);

           await post.updateOne({$push:{comments:{
               comment:req.body.comment,
               userId:req.body.userId
           }}})
            res.status(200).json('you have commented this picture')
        }
catch(err){
        res.status(500).json(err)
    }
}
)
//get a post
router.get('/:id',async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        res.json(post);
    }
    catch(err){
        res.status(500).json(err)
    }
})

//get feed of home page
router.get('/timeline/:userId',async (req,res)=>{
    try{
        const currentUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({ userId: currentUser._id });
        const friendPosts = await Promise.all(
          currentUser.following.map((friendId) => {
            return Post.find({ userId: friendId });
          })
        );
        res.json(userPosts.concat(...friendPosts))
    }catch(err){
        res.sendStatus(500)
    }
})

//get feed of profile page
router.get('/profile/:username',async (req,res)=>{
    try{
        const currentUser = await User.findOne({username:req.params.username});
        const userPosts = await Post.find({ userId: currentUser._id });
        res.status(200).json(userPosts)
    }catch(err){
        res.sendStatus(500)
    }
})
module.exports=router;