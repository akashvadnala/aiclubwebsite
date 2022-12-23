const express = require('express');
const router = express.Router();
const Project = require('../model/projectSchema');
const Team = require('../model/teamSchema');
require('../db/conn');

router.route('/updateProject/:url').put(async (req,res) => {
    try{
        const {url} = req.params;
        // console.log('req.body',req.body.url,req.body)
        const updatedProj = await Project.findOneAndUpdate({url:url},req.body,{
            new:true
        });
        console.log('Project Updated',updatedProj);
        res.status(200).json(updatedProj);
    }catch (err) {
        res.status(422).json(err);
    }
})

router.route('/projectAdd').post(async (req,res) => {
    const { title, url, creator, authors, content, cover } = req.body;
    console.log('new-project',req.body);
    try{
        const project = new Project({
            title:title,
            url:url,
            creator:creator,
            authors:authors,
            content:content,
            cover:cover
        });
        await project.save();
        console.log(`${project.title} successfully uploaded`);
        res.status(201).json({message: "Project Uploaded Successfully"});
    }catch(err){
        console.log(err);
    }
});

router.route('/getProjects').get(async (req,res) => {
    const projectData = await Project.find({});
    console.log('projectData',projectData);
    res.status(200).json(projectData);
});


router.route('/getProject/:url').get(async (req,res) => {
    const {url} = req.params;
    var auth=[];
    try{
        var project = await Project.findOne({url:url});
        const authors=project.authors;
        if(project){
            authors.map(async (user)=>{
                const author = await Team.findOne({username:user});
                auth.push({
                    'firstname':author.firstname,
                    'lastname':author.lastname,
                    'photo':author.photo,
                    'description':author.description
                })
                console.log('authors',auth);
            })
            setTimeout(() => {
                console.log('project.authors',auth);
                return res.status(200).json({'project':project,'authors':auth});
            }, 1000);
            
        }
        else{
            console.log('null',null);
            return res.status(201).json(null);
        }
    }catch(err){
        console.log(err);
        res.status(422).send(`${url} not found`);
    }
});

router.route('/getProjectEdit/:url').get(async (req,res) => {
    const {url} = req.params;
    try{
        var project = await Project.findOne({url:url});
        if(project){
            return res.status(200).json(project);
        }
        else{
            console.log('null',null);
            return res.status(201).json(null);
        }
    }catch(err){
        console.log(err);
        res.status(422).send(`${url} not found`);
    }
});

module.exports = router;