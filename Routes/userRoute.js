const express = require('express');
var router= express.Router();
var bcryptjs=require("bcryptjs");
var jwt=require("jsonwebtoken");
var TokenModel=require("../Models/tokenModel");
var UserModel=require("../Models/userModel");

console.log("user function files has been called");


router.post("/admin/register",async(req,res)=>{
    
    var{username,password}=req.body;
    if(username==null || username==undefined)
    {
        res.status(200).json(
            {
                status:false,
                msg:"username is  not defined"

            }
        )
        return;
    }
    if(password==null || password==undefined)
    {
        res.status(200).json(
            {
                status:false,
                msg:"password is  not defined"
            }
        )
        return;
    }
 
var encryptedpassword=await bcryptjs.hash(password,10)
var data=new UserModel();
data.username=username;
data.password=encryptedpassword;
await data.save()
console.log(data._id)

    res.status(200).json(
        {
            status:true,
            msg:"success",
            user:data
        }
    )
return;
})

router.post("/admin/login",async(req,res)=>{
    try{
        var { username, password } = req.body;
        if (username == null || username == undefined) {
            res.status(200).json({
                status: false,
                msg: "Invalid username",
            });
            return;
        }

        var alreadyexists = await UserModel.findOne({ status: "Active", username: username });
        if (alreadyexists == null) {
            res.status(200).json({
                status: false,
                msg: "Please register",
            });
            return;
        }

        if (password == null || password == undefined) {
            res.status(200).json({
                status: false,
                msg: "Invalid password",
            });
            return;
        }

        var isok = await bcryptjs.compare(password, alreadyexists.password);
    
    if(isok==true)
    {
        var token=await jwt.sign({
            username:alreadyexists,
            id:alreadyexists._id,
            role:alreadyexists.role
        
         }, "blk121",{expiresIn:12000})
        
        var tok=new TokenModel()
        tok.token=token;
        tok.userid=alreadyexists._id
        await tok.save();
        res.status(200).json(
            {
                status:true,
                msg:" login success",
                token:token,
                id:alreadyexists._id
    
            }
        )
        return;
    }
    else{
    
        res.status(200).json(
            {
                status:false,
                msg:"  invalid password credentials"
            }
        )
        return;
    }
    }
    catch(e){
        console.log(e)
    }
    });
    module.exports=router;

    router.get("/logout",async(req,res)=>{
        try{
            var {token}=req.headers;
            if(token==null || token==undefined)
            {
                res.status(200).json(
                    {
                        status:false,
                        msg:"invalid token"
                    }
                )
                return;
            }
        var tokenexists=await TokenModel.findOne({token:token})
           if(tokenexists!=null)
           {
            tokenexists.status="Deleted"
            res.status(200).json(
                {
                    status:true,
                    msg:"token cleared",
                    token:token
                }
            )
            return;
           }
        else{
            res.status(200).json(
                {
                    status:false,
                    msg:"invalid token",
                }
            )
            return;
        }
        }
        catch(e){
            console.log(e);
        }
        });