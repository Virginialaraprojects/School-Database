'use strict'
const { Model, DataTypes }= require('sequelize');

module.exports = (sequelize) =>{
    class Courses extends Model{

    }
    Courses.init({
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
        },
        title:{
            type:DataTypes.STRING,
            allowNull: false,
            validate:{
                notNull:{
                    msg: 'A title is required!'
                },
                notEmpty:{
                    msg:'Please provide a title!'
                }
            }
        },
        description:{
            type:DataTypes.TEXT,
            allowNull: false,
            validate:{
                notNull:{
                    msg: 'A description is required!'
                },
                notEmpty:{
                    msg:'Please provide a description!'
                },
            }
        },
        estimatedTime:{type:DataTypes.STRING,
        },
        materialsNeeded:{type:DataTypes.STRING,
        },
     
           
    
    },{sequelize});
    Courses.associate = (models) => {
       Courses.belongsTo(models.Users,{
        foreignKey:{
            fieldName: 'userId',
            allowNull: false,
        },
       });
    };

    return Courses;
};
