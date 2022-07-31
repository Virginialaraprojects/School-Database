'use strict';
//const { Router } = require('express');
const express = require('express');
const courses = require('./models/courses');
const router = express.Router();
const Courses =require('./models').Courses;
const Users = require('./models').Users;
const { authenticateUser } = require('./middleware/auth-user');

/* Helper function*/
function asyncHandler(cb){
    return async( req, res, next) =>{
        try{
            await cb(req, res ,next);
        }catch(err){
            next(err);
        }
    }
}

/* Users routes */
/*Send a GET request to /api/users to READ a the current authenticate USER and 200 http status code  */
router.get('/users', authenticateUser, asyncHandler(async(req,res) =>{
    const user= req.currentUser;

    res.status(200).json({
        id:user.id,
        firstName:user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress,
    });
}));

/* Send a POST request to /api/users to CREATE a NEW USER , set location to '/'and 201 http status code */
router.post('/users', asyncHandler(async(req,res)=>{
    try{
        await Users.create(req.body)
        res.status(201).location('/').end();
    }catch(error){
        console.log('ERROR:' ,error.name);

        if(error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError'){
            const errors = error.errors.map(err =>err.message);
            res.status(400).json({ errors });
        }else{
            throw error;
        } 
    }   
}));

/* Courses routes */


// Send a GET request to /api/courses to READ a list of courses and the user asscoiate and 200 http status code 
router.get('/courses', asyncHandler(async(req,res)=>{
    const course = await Courses.findAll({
        include:[{
            model:Users,
        }],
    });
    if(course){
        res.status(200).json(course);
    }else{
        res.status(404).json({message: 'Unable to find the course!'})
    }
}));


// Send a GET request to /api/courses/:id to READ(view) a course and user with HTTP 200 status code
router.get('/courses/:id',asyncHandler(async(req,res)=>{
    const course = await Courses.findByPk(req.params.id,{
        include:[{
            model:Users,
        }],
    });
    if (course){
        res.status(200).json(course);
    }else{
        res.status(404).json({message:'Unable to find the course!'})
    }
}));

//Send a POST request to /api/courses/:id to  CREATE a new course, set location to the uri and http status 201
router.post('/courses/:id', authenticateUser, asyncHandler(async(req,res)=>{
    try{
        await Courses.create(req.body)
        res.status(201).location('/api/courses/' + courses.id).end();
    }catch(error){
        console.log('ERROR:', error.name);

        if(error.name === 'SequelizeValidaionError' || error.name === 'SequelizeUniqueConstraintError'){
            const errors =error.errors.map(err => err.message);
            res.status(400).json({ errors });
        }else {
            throw error;
        }
    }
    
}));


// Send a PUT request to /api/courses/:id to UPDATE (edit) a course and return a 204  http status code and no content
router.put('/courses/:id', authenticateUser, asyncHandler(async(req,res)=>{
    try{
        const course= await Courses.findByPk(req.params.id);
    if(course){
        await Courses.update(req.body);
        res.status(204).end();
    }else{
        res.status(404).end();
    }
    }catch(error){
        console.log('Error:', error.name);

        if(error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError'){
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
    
}));

// Send a DELETE request to /api/courses/:id DELETE a course and return a 204 with no content
router.delete('/courses/:id', authenticateUser, asyncHandler(async(req,res,next)=>{
    const course = await Courses.findByPk(req.params.id);
    if(course){
        await Courses.destroy(course);
        res.status(204).end();
    } else{
        res.status(404).json({message: 'Unable to find the course!'});
    }
    
}));

module.exports = router;