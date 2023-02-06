const express = require("express");
const router = express.Router();
const Project = require("../model/projectSchema");
const Team = require("../model/teamSchema");
const authenticate = require("../middleware/authenticate");
require("../db/conn");

router.route("/updateProject/:id").put(authenticate,async (req, res) => {
  try {
    const { id } = req.params;
    const proj = await Project.findById(id);
    let removeProject = proj.authors;
    const updatedProj = await Project.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    let insertProject = updatedProj.authors;
    await Promise.all(
      removeProject.map(async (author) => {
        try {
          const team = await Team.findById(author);
          console.log('before',team.username,team.projects)
          team.projects = team.projects.filter((x) => x != id);
          await team.save();
          console.log('after',team.username,team.projects)
        } catch (err) {
          console.log("Project Not Found");
        }
      })
    );
    await Promise.all(
      insertProject.map(async (author) => {
        try {
          const team = await Team.findById(author);
          team.projects.push(id);
          await team.save();
        } catch (err) {
          console.log("Project Not Found");
        }
      })
    );
    console.log("Project Updated", updatedProj.title);
    res.status(200).json(updatedProj);
  } catch (err) {
    res.status(422).json(err);
  }
});

router.route("/updateprojPublicStatus/:url").put(authenticate,async (req, res) => {
  try {
    const { url } = req.params;
    const updatedProj = await Project.findOne({ url: url });
    updatedProj.public = req.body.public;
    updatedProj.save();
    res.status(200).json(updatedProj);
  } catch (err) {
    res.status(422).json(err);
  }
});

router.route("/updateprojApprovalStatus/:url").put(authenticate,async (req, res) => {
  try {
    const { url } = req.params;
    const updatedProj = await Project.findOne({ url: url });
    updatedProj.approvalStatus = req.body.approvalStatus;
    updatedProj.public = req.body.public;
    updatedProj.save();
    res.status(200).json(updatedProj);
  } catch (err) {
    res.status(422).json(err);
  }
});

router.route("/projectAdd").post(authenticate,async (req, res) => {
  const { title, url, creator, authors, content, cover } = req.body;
  try {
    const project = new Project({
      title: title,
      url: url,
      creator: creator,
      authors: authors,
      content: content,
      cover: cover,
    });
    await project.save();
    await Promise.all(
      project.authors.map(async (author) => {
        try {
          const team = await Team.findById(author);
          team.projects.push(project._id);
          await team.save();
        } catch (err) {
          console.log("Author Not Found");
        }
      })
    );
    console.log(`${project.title} successfully uploaded`);
    res.status(201).json({ message: "Project Uploaded Successfully" });
  } catch (err) {
    console.log(err);
  }
});

router.route("/getfiveprojects").get(async (req, res) => {
  let projectData = await Project.find({ public: true }).sort({
    createdAt: -1,
  });
  projectData = projectData.slice(0, 5);
  res.status(200).json(projectData);
});

router.route("/getProjects").get(async (req, res) => {
  const projectData = await Project.find({ public: true }).sort({
    createdAt: -1,
  });
  res.status(200).json(projectData);
});

router.route("/getFirstLastNameForProjects/:url").get(async (req,res)=>{
  const project = await Project.findOne({url:req.params.url});
  let nameList = [];
  if(project){
    const authors = project.authors;
    await Promise.all(
      authors.map(async (a)=>{
        const team = await Team.findById(a);
        nameList.push(`${team.firstname} ${team.lastname}`);
      })
    )
  }
  const names = nameList.join(", ");
  return res.status(200).json(names);
})

router.route("/getResearchPapers").get(async (req, res) => {
  const projectData = await Project.find({ isPublished: true, public: true })
    .select(
      "-__v -_id -creator -authors -isPublished -tags -content -cover -public -approvalStatus -createdAt"
    )
    .sort({ createdAt: -1 });
  res.status(200).json(projectData);
});

router.route("/getpendingProjApprovals").get(async (req, res) => {
  const projectData = await Project.find({ approvalStatus: "pending" }).sort({
    createdAt: -1,
  });
  res.status(200).json(projectData);
});

router.route("/getProjectApprovals").get(async (req, res) => {
  const projectData = await Project.find({ approvalStatus: "pending" }).sort({
    createdAt: -1,
  });
  res.status(200).json(projectData);
});

router.route("/getProject/:url").get(async (req, res) => {
  const { url } = req.params;
  var auth = [];
  try {
    var project = await Project.findOne({ url: url });
    if (project) {
      const authors = project.authors;
      await Promise.all(
        authors.map(async (user) => {
          const author = await Team.findById(user).select("firstname lastname photo description");
          auth.push(author);
        })
      );
      return res.status(200).json({ project: project, authors: auth });
    } else {
      return res.status(201).json(null);
    }
  } catch (err) {
    console.log(err);
    res.status(422).send(`${url} not found`);
  }
});

router.route("/getProjectEdit/:url").get(async (req, res) => {
  const { url } = req.params;
  try {
    var project = await Project.findOne({ url: url });
    if (project) {
      return res.status(200).json(project);
    } else {
      return res.status(201).json(null);
    }
  } catch (err) {
    console.log(err);
    res.status(422).send(`${url} not found`);
  }
});

router.route("/deleteProject/:id").post(authenticate,async (req, res) => {
  const { id } = req.params;
  const proj = await Project.findById(id);
  if (proj) {
    const authors = proj.authors;
    await Promise.all(
      authors.map(async (author) => {
        try {
          const team = await Team.findById(author);
          team.projects = team.projects.filter((p) => p != id);
          await team.save();
        } catch (err) {
          console.log(err);
        }
      })
    );
    await Project.findByIdAndDelete(id);
    console.log("Deleted..");
    return res.status(200).json({ msg: "Project Deleted" });
  } else {
    console.log("Cannot Delete the Project");
    return res.status(422).json({ msg: "Cannot Delete the Project" });
  }
});

router.route("/getMyProjects/:id").get(async (req, res) => {
  const team = await Team.findById(req.params.id);
  let projects = [];
  if (team) {
    await Promise.all(
      team.projects.map(async (project) => {
        try {
          const proj = await Project.findById(project).select("title url cover authors createdAt");
          if(proj){
            projects.push(proj);
          }
        } catch (err) {
          console.log("Project Not Found");
        }
      })
    );
    if(projects){
      console.log('projetcs',projects);
      projects.sort((a,b)=>b.createdAt - a.createdAt);
    }
    res.status(200).json(projects);
  } else {
    res.status(201).json(null);
  }
});

module.exports = router;
