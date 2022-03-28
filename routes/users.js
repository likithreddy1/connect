const express = require('express')
const bycrypt = require('bcrypt');
const User = require('../Models/User');
const router = express.Router();
router.use(express.json())

//updat pasword
router.put('/:id', async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bycrypt.genSalt(10);
                req.body.password = await bycrypt.hash(req.body.password, salt)
            } catch (err) {
                return res.status(500).json(err)
            }
            try {
                const user = await User.findByIdAndUpdate(req.params.id, {
                    $set: req.body
                });
                res.status(200).json('account has been updated')
            } catch (err) {
                return res.status(500).json(err)
            }
        } else {
            res.status(500).json('you can only update your account')
        }
    }
})
//delete

//update user
router.put('/update/:id',async(req,res)=>{
  try{  const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body
    });
    res.status(200).json('updated')
}
    catch (err) {
        return res.status(500).json(err)
    }
})
router.delete('/:id', async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("account has been deleted")
        } catch (err) {
            return res.status(400).json(err);
        }
    } else {
        return res.status(400).json('you can only delete your account')
    }
})
//get
router.get('/', async (req, res) => {
    const userId = req.query.userId;
    const username = req.query.username;
    try {
        const user = username ? await User.findOne({
            username: username
        }) : await User.findById(userId);
        console.log(user);
        !user && res.status(401);
        const others = user;
        res.json(others)
    } catch (err) {
        console.log(err)
        return res.status(403).json(err)
    }
})


//follow a user
router.put('/:id/follow', async (req, res) => {
    if (req.params.id !== req.body.id) {
        try {
            
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.id);
            if (currentUser.following.includes(req.params.id)) {
                res.status(403).json('you are already following this user')
            } else {
                await currentUser.updateOne({
                    $push: {
                        following: req.params.id
                    }
                })
                await user.updateOne({
                    $push: {
                        followers: req.body.id
                    }
                })
                res.status(200).json('you are now following this user')
            }
        } catch (err) {
            res.status(201).json(err)
        }
    } else {
        res.sendStatus(403).json("you can't follow yourself")
    }
})

//unfollow a user
router.put('/:id/unfollow', async (req, res) => {
    if (req.params.id !== req.body.id) {
        try {

            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.id);
            if (!currentUser.following.includes(req.params.id)) {
                res.status(403).json('you are not following this user')
            } else {
                await currentUser.updateOne({
                    $pull: {
                        following: req.params.id
                    }
                })
                await user.updateOne({
                    $pull: {
                        followers: req.body.id
                    }
                })
                res.status(200).json('you are now unfollowing this user')
            }
        } catch (err) {
            res.status(201).json(err)
        }
    } else {
        res.sendStatus(403).json("you can't unfollow yourself")
    }
})

//get user friends
router.get('/friends/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const friends = await Promise.all(
            user.following.map((friendId) => {
                return User.findById(friendId);
            })
        );
        let friendList = [];
        friends.map((friend) => {
            const {
                _id,
                username,
                profilepic
            } = friend;
            friendList.push({
                _id,
                username,
                profilepic
            });
        });
        res.status(200).json(friendList)
    } catch (err) {
        res.status(500).json(err);
    }
});

//get all users
router.get('/allusers',async(req,res)=>{
    try {
        const users = await User.find({});
        res.status(200).json(users);
        
    } catch (error) {
        res.sendStatus(404);
    }
    pingTimeout
})
module.exports = router;