const express=require('express')
const Message=require('../Models/Chat')
const router=express.Router();

//posting a new message
router.post('/',async (req,res)=>{
const message=new Message(req.body)
try {
    const newmessage=await message.save();
    res.status(200).json(newmessage)
    
} catch (error) {
    res.status(500).json(error)
}
})

//fetch all the messages of a conversation
router.get('/:conversationId',async(req,res)=>{
    try {
        const messages=await Message.find({
            id:req.params.conversationId
        })
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json(error)
    }
})
module.exports=router;