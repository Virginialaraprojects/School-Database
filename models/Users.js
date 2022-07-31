'use strict'
const { Model, DataTypes }= require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) =>{
    class Users extends Model{}
    Users.init({
        id:{
            type:DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement:true,
        },
        firstName:{
            type:DataTypes.STRING,
            allowNull: false,
            validate:{
                notNull:{
                    msg:'A firstname is required!'
                },
                notEmpty:{
                    msg:'Please provide a first name!'
                },
            }
        },
        lastName:{
            type:DataTypes.STRING,
            allowNull: false,
            validate:{
                notNull:{
                    msg:'A lastname is required!'
                },
                notEmpty:{
                    msg:'Please provide a last name!'
                },
            }
        },
        emailAddress:{
            type:DataTypes.STRING,
            allowNull: false,
            unique:true, //no duplicate emails
            validate:{
                notNull:{
                    msg:' A email is required!'
                },
                isEmail:{
                    msg:'Please provide a valid email!'
                },
            }
        },
        password:{
            type:DataTypes.STRING,
            allowNull:false,
            validate:{
                notNull:{
                    msg:' A password is required!'
                },
                notEmpty:{
                    msg:'Please provide a password!'
                },
            confirmedPassword:{
                type:DataTypes.STRING,
                allowNull: false,
                set(val){
                    if ( val === this.password){
                        const hashedPassword =bcrypt.hashSync(val,10);
                        this.setDataValue('confirmedPassword',hashedPassword);
                    }
                },
                validate:{
                    notNull:{
                        msg:'Both passwords must match'
                    }
                }
                }
            }
        },
    
    },{ sequelize });
    Users.associate =(models)=>{
       Users.hasMany(models.Courses,{
        foreignKey:{
            fieldName:'userId',
            allowNull: false,
        },
       });
    };
    return Users;
};
