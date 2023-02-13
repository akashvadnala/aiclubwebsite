const express = require("express");
const router = express.Router();
const Project = require("../model/projectSchema");
const Team = require("../model/teamSchema");
const authenticate = require("../middleware/authenticate");
require("../db/conn");

router.route("/updateProject/:id").put(authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const projectdata = req.body;
    projectdata.url = projectdata.url.trim().replace(/\s+/g, '-').toLowerCase();
    const proj = await Project.findById(id);
    let removeAuthors = proj.authors;
    const updatedProj = await Project.findByIdAndUpdate(id, projectdata, {
      new: true,
    });
    let insertAuthors = updatedProj.authors;
    await Promise.all(
      removeAuthors.map(async (author) => {
        const team = await Team.findById(author);
        if (team) {
          team.projects = team.projects.filter((x) => x != id);
          await team.save();
        }
      })
    );
    await Promise.all(
      insertAuthors.map(async (author) => {
        const team = await Team.findById(author);
        if (team) {
          team.projects.push(id);
          await team.save();
        }
      })
    );
    res.status(200).json();
  } catch (err) {
    res.status(500).json({ error: "Something went wrong!" });
  }
});

router.route("/updateprojPublicStatus/:url").put(authenticate, async (req, res) => {
  try {
    const { url } = req.params;
    const updatedProj = await Project.findOne({ url: url });
    updatedProj.public = req.body.public;
    updatedProj.save();
    res.status(200).json();
  } catch (err) {
    res.status(500).json({ error: "Somthing went wrong!" });
  }
});

router.route("/updateprojApprovalStatus/:url").put(authenticate, async (req, res) => {
  try {
    const { url } = req.params;
    const updatedProj = await Project.findOne({ url: url });
    updatedProj.approvalStatus = req.body.approvalStatus;
    updatedProj.public = req.body.public;
    updatedProj.save();
    res.status(200).json(updatedProj);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.route("/projectAdd").post(authenticate, async (req, res) => {
  const projectdata = req.body;
  projectdata.url = projectdata.url.trim().replace(/\s+/g, '-').toLowerCase();
  const proj = new Project(projectdata);
  proj.save().then(async (project) => {
    await Promise.all(
      project.authors.map(async (author) => {
        const team = await Team.findById(author);
        if (team) {
          team.projects.push(project._id);
          await team.save();
        }
      })
    );
    res.status(200).json({url:proj.url});
  }).catch((err) => {
    res.status(500).json({ error: "Cannot Add Project!" });
  })
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

router.route("/getFirstLastNameForProjects/:url").get(async (req, res) => {
  const project = await Project.findOne({ url: req.params.url });
  let nameList = [];
  if (project) {
    const authors = project.authors;
    await Promise.all(
      authors.map(async (a) => {
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
  Project.findOne({ url: url }).then(async project => {
    if (project) {
      const authors = project.authors;
      let auth = [];
      await Promise.all(
        authors.map(async (user) => {
          const author = await Team.findById(user).select("firstname lastname photo description");
          auth.push(author);
        })
      );
      res.status(200).json({ project: project, authors: auth });
    }
    else {
      res.status(404).json();
    }
  }).catch(err => {
    res.status(404).json();
  });
});

router.route("/getProjectEdit/:url").get(async (req, res) => {
  const { url } = req.params;
  var project = await Project.findOne({ url: url });
  if (project) {
    res.status(200).json(project);
  } else {
    res.status(500).json({ error: 'Project not found!' });
  }
});

router.route("/deleteProject/:id").delete(authenticate, async (req, res) => {
  const { id } = req.params;
  const proj = await Project.findById(id);
  console.log('proj', proj)
  if (proj) {
    const authors = proj.authors;
    await Promise.all(
      authors.map(async (author) => {
        const team = await Team.findById(author);
        if (team) {
          team.projects = team.projects.filter((p) => p != id);
          await team.save();
        }
      })
    );
    await Project.findByIdAndDelete(id);
    return res.status(200).json({ msg: "Project Deleted" });
  } else {
    return res.status(500).json({ error: "Project Deletion failed!" });
  }
});

router.route("/isProjectUrlExist/:url").get(async (req, res) => {
  const { url } = req.params;
  Project.findOne({ url: url }).then(data => {
    return data ? res.status(404).send({ error: "Url Already Exist!" }) : res.status(200).json();
  });
})

router.route("/getMyProjects/:id").get(async (req, res) => {
  const team = await Team.findById(req.params.id);
  let projects = [];
  if (team) {
    await Promise.all(
      team.projects.map(async (project) => {
        try {
          const proj = await Project.findById(project).select("title url cover authors createdAt");
          if (proj) {
            projects.push(proj);
          }
        } catch (err) {
          console.log("Project Not Found");
        }
      })
    );
    if (projects) {
      projects.sort((a, b) => b.createdAt - a.createdAt);
    }
    res.status(200).json(projects);
  }
});

module.exports = router;
