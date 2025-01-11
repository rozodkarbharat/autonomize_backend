const express = require('express');
const connection = require('../db');
require('dotenv').config()
const userRoute = express.Router();


userRoute.get("/user-detail/:username", (req, res) => {
    try{
        let username = req.params.username
        let sqlQuery = `SELECT * FROM user WHERE username = ?`

        connection.query(sqlQuery,[username],async(err, result) => {
            if(err){
                console.log(err.message,'username')
                return res.status(401).send({message:"error in fetching user details",error:true})
            }

            if(result.length > 0){
                console.log(result[0],'from table')
                return res.status(200).send({data:JSON.parse(result[0].userdata),error:false})
            }
            else{
                let response= await fetch( `https://api.github.com/users/${username}`,{
                    headers: {
                    Authorization: `Bearer ${process.env.token}`, // Include the token in the Authorization header
                    Accept: "application/vnd.github.v3+json"
                }})
                let data = await response.json()
                console.log(data,'userdata',username)
                if(data.message){
                    return res.status(404).send({message:"user not found",error:true})
                }
                else{
                    let sqlQuery = `INSERT INTO user (username,userdata,repositories) VALUES (?,?,?)`

                    connection.query(sqlQuery,[username,JSON.stringify(data),""],(err,inserresult) => {
                        if(err){
                            console.log(err.message)
                            return res.status(401).send({message:"error in inserting user details",error:true})
                        }
                        return res.status(200).send({data:data,error:false})
                    })
                }
            }

        })
    }
    catch(e){
       let message = e.message || "something went wrong"
       res.status(500).send({message,error:true})
    }
})

userRoute.get("/get-repos/:username",(req, res) => {
    try{
        let username = req.params.username
    
        let sqlQuery = `SELECT * FROM user WHERE username=?`
        connection.query(sqlQuery,[username],async(err,result) => {
            if(err){
                console.log(err.message)
                return res.status(401).send({message:"error in fetching repositories",error:true})
            }

            if(result.length > 0 && result[0].repositories){
                return res.status(200).send({data: JSON.parse(result[0].repositories),error:false})
            }
            else{
                let userdata = JSON.parse(result[0].userdata)
                let response= await fetch( userdata.repos_url,{
                    headers: {
                    Authorization: `Bearer ${process.env.token}`, // Include the token in the Authorization header
                    Accept: "application/vnd.github.v3+json"
                }})
                let data = await response.json()
                console.log(data,'userdata',username)
                if(data.message){
                    return res.status(404).send({message:"Repositories not found",error:true})
                }
                else{
                    let sqlQuery = `UPDATE user SET repositories = ? WHERE username = ?`

                    connection.query(sqlQuery,[JSON.stringify(data),username],(err,inserresult) => {
                        if(err){
                            console.log(err.message)
                            return res.status(401).send({message:"error in inserting repositories details",error:true})
                        }
                        return res.status(200).send({data:data,error:false})
                    })
                }
            }


        })
    }
    catch(e){

    }
})


userRoute.get('/followers/:username',(req,res) => {
    try{
        let username = req.params.username
        let sqlQuery = `SELECT * FROM user WHERE username=?`
        connection.query(sqlQuery,[username],async(err,result) => {
            if(err) {
                console.log(err.message)
                return res.status(401).send({message:"error in fetching followers",error:true})
            }
            
            if(result.length > 0 && result[0].followers) {
                return res.status(200).send({data: JSON.parse(result[0].followers),error:false})
            }
            else{
                let userdata = JSON.parse(result[0].userdata)
                let response= await fetch( userdata.followers_url,{
                    headers: {
                    Authorization: `Bearer ${process.env.token}`, // Include the token in the Authorization header
                    Accept: "application/vnd.github.v3+json"
                }})
                let data = await response.json()
                if(data.message){
                    return res.status(404).send({message:"followers not found",error:true})
                }
                else{
                    let sqlQuery = `UPDATE user SET followers = ? WHERE username = ?`

                    connection.query(sqlQuery,[JSON.stringify(data),username],(err,inserresult) => {
                        if(err){
                            console.log(err.message)
                            return res.status(401).send({message:"error in inserting followers details",error:true})
                        }
                        return res.status(200).send({data:data,error:false})
                    })
                }
            }
        })
    }
    catch(e){

    }
})




module.exports = userRoute