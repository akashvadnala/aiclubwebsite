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
                try{
                    const team = await Team.findOne({username:author});
                    team.projects = team.projects.filter((x)=>x!==proj.url);
                    await team.save();
                }catch(err){
                    console.log('Project Not Found')
                }
            })
        );
        await Promise.all(
            insertAuthors.map(async author=>{
                try{
                    const team = await Team.findOne({username:author});
                    team.projects.push(proj.url);
                    await team.save();
                }catch(err){
                    console.log('Project Not Found')
                }
                
            })
        );
        console.log('Project Updated',updatedProj.title);
        res.status(200).json(updatedProj);
    }catch (err) {
        res.status(422).json(err);
    }
})


router.route("/updateprojPublicStatus/:url").put(async (req, res) => {
    try {
      const { url } = req.params;
      const updatedProj = await Project.findOne({ url: url });
      updatedProj.public = req.body.public;
      updatedProj.save();
      console.log("Project Updated", updatedProj);
      res.status(200).json(updatedProj);
    } catch (err) {
      res.status(422).json(err);
    }
  });

router.route('/projectAdd').post(async (req,res) => {
    const { title, url, creator, authors, content, cover } = req.body;
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
        await Promise.all(
            project.authors.map(async author=>{
                try{
                    const team = await Team.findOne({username:author});
                    team.projects.push(proj.url);
                    await team.save();
                }catch(err){
                    console.log('Project Not Found')
                }
            })
        );
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

router.route('/getthreeprojects').get(async (req,res) => {
    let projectData = await Project.find({});
    projectData.sort().reverse().slice(0,2);
    console.log('projects',projectData);
    res.status(200).json(projectData);
});


router.route('/getProject/:url').get(async (req,res) => {
    const {url} = req.params;
    var auth=[];
    try{
        var project = await Project.findOne({url:url});
        if(project){
            const authors=project.authors;
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
    const proj = await Project.findOne({url:url});
    if(proj){
        const authors = proj.authors;
        await Promise.all(authors.map(async author=>{
            try{
                const team = await Team.findOne({username:author});
                team.projects = team.projects.filter(p=>p!=url);
                await team.save();
            }catch(err){
                console.log(err);
            }
            
        }))
        await Project.deleteOne({url:url});
        console.log('Deleted..');
        return res.status(200).json({msg:"Project Deleted"});
    } 
    else{
        console.log("Cannot Delete the Project");
        return res.status(422).json({msg:"Cannot Delete the Project"});
    }
});

router.route('/getMyProjects/:user').get(async (req,res) => {
    const team = await Team.findOne({username:req.params.user});
    let projects = [];
    if(team){
        await Promise.all(team.projects.map(async project=>{
            try{
                const proj = await Project.findOne({url:project});
                projects.push({
                    'title':proj.title,
                    'url':proj.url,
                    'cover':proj.cover,
                    'authors':proj.authors
                });
            }catch(err){
                console.log('Project Not Found');
            }
            
        }))
        res.status(200).json(projects);
    }
    else{
        res.status(422).json(null);
    }
    
    
});


module.exports = router;