const express=require('express')
const router=express.Router()
const Conversation=require('../Models/Chatlist')

//get convo of user

router.post('/',async (req,res)=>{
    const conversation=new Conversation({
        members:[req.body.senderId,req.body.recieverId],
    });
    try {
        const save=await conversation.save();
        res.status(200).json(save);
    
    } catch (error) {
        res.status(500).json(err)
    }
})

router.delete('/delete',async(req,res)=>{
    try {
        const conversation = await Conversation.findById(req.body.id);
        await conversation.deleteOne()
        res.status(200).json('conversation is deleted')
    } catch (error) {
        res.status(500).json(error.message)
    }
})

router.get('/:id',async (req,res)=>{
    try {
        const conversation = await Conversation.find({
            members:{$in:[req.params.id]},
        })
        res.status(200).json(conversation)
    } catch (error) {
        res.status(500).json(eror)
    }
})

module.exports=router;