'use strict';

const auth = require('basic-auth');
const { Users } = require('../models');
const bcrypt = require('bcryptjs');


//Middleware to authenticate the request using Basic Authentication.
exports.authenticateUser = async (req,res,next) =>{
    let message; //store the message to display
    //parse the user's creddentials from the Authorization Header
    const credentials = auth(req);
    //conditional statement that checks if user credentials are available
    if(credentials){
        const user = await Users.findOne({where:{emailAddress: credentials.name}});
        if (user){//checks if the user was successfully retrieve
            const authenticated =bcrypt
            .compareSync(credentials.pass, user.password);//password
            if(authenticated){
                console.log(`Authentication successful for email ${user.emailAddress}`);
                //Store the user on the request object
                req.currentUser = user;
            } else {
                message =`Authentication failure for email: ${user.emailAddress}`;
            }
            } else {
                message = `User not found for email:${credentials.name}`;
           }
           } else{
               message ='Auth header not found';
           }

        if (message){
            console.warn(message);
            res.status(401).json({message:'Access Denied'});
        } else{
            next();
        }
};