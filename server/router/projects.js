const express = require('express');
const router = express.Router();
const Project = require('../model/projectSchema');
const Team = require('../model/teamSchema');
require('../db/conn');

router.route('/updateProject/:url').put(async (req,res) => {
    try{
        const {url} = req.params;
        const proj = await Project.findOne({url:url});
        let removeAuthors = proj.authors;
        const updatedProj = await Project.findOneAndUpdate({url:url},req.body,{
            new:true
        });
        let insertAuthors = updatedProj.authors;
        await Promise.all(
            removeAuthors.map(async author=>{
                const team = await Team.findOne({username:author});
                team.projects = team.projects.filter((x)=>x!==proj.url);
                team.save();
            })
        );
        await Promise.all(
            insertAuthors.map(async author=>{
                const team = await Team.findOne({username:author});
                team.projects.push(proj.url);
                team.save();
            })
        );
        console.log('Project Updated',updatedProj.title);
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
    res.status(200).json(projectData);
});


router.route('/getProject/:url').get(async (req,res) => {
    const {url} = req.params;
    var auth=[];
    try{
        var project = await Project.findOne({url:url});
        const authors=project.authors;
        if(project){
            await Promise.all(
                authors.map(async (user)=>{
                    const author = await Team.findOne({username:user});
                    auth.push({
                        'firstname':author.firstname,
                        'lastname':author.lastname,
                        'photo':author.photo,
                        'description':author.description
                    })
                })
            )
            return res.status(200).json({'project':project,'authors':auth});           
        }
        else{
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
            return res.status(201).json(null);
        }
    }catch(err){
        console.log(err);
        res.status(422).send(`${url} not found`);
    }
});

router.route('/deleteProject/:url').post(async (req,res)=>{
    const {url} = req.params;
    console.log(url);
    try{
        await Project.deleteOne({url:url});
        console.log('Deleted..');
        return res.status(200).json({msg:"Project Deleted"});
    } 
    catch(err){
        console.log("Cannot Delete the Project");
        return res.status(422).json({msg:"Cannot Delete the Project"});
    }
});

router.route('/getMyProjects/:user').get(async (req,res) => {
    const team = await Team.findOne({username:req.params.user});
    let projects = [];
    if(team){
        await Promise.all(team.projects.map(async project=>{
            const proj = await Project.findOne({url:project});
            projects.push({
                'title':proj.title,
                'url':proj.url,
                'cover':proj.cover,
                'authors':proj.authors
            });
        }))
        res.status(200).json(projects);
    }
    else{
        res.status(422).json(null);
    }
    
    
});


module.exports = router;