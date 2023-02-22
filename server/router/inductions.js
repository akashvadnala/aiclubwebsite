const express = require("express");
const router = express.Router();

const Competitions = require("../model/competitionSchema");
const Leaderboard = require("../model/leaderboardSchema");
const Team = require("../model/teamSchema");
const authenticate = require("../middleware/authenticate");

router.route("/getCompete/:url").get(async (req, res) => {
  const { url } = req.params;
  const data = await Competitions.findOne({ url: url });
  if (data) {
    res.status(200).json(data);
  } else {
    res.status(201).json(null);
  }
});

router.route("/isCompUrlExist/:url").get(async (req, res) => {
  const { url } = req.params;
  Competitions.findOne({ url: url }).then((data) => {
    return data
      ? res.status(404).send({ error: "Url Already Exist!" })
      : res.status(200).json();
  });
});

router.route("/addcompetitions").post(authenticate, async (req, res) => {
  const compete = new Competitions(req.body);
  compete
    .save()
    .then(async (competition) => {
      await Promise.all(
        competition.access.map(async (author) => {
          const team = await Team.findById(author);
          if (team) {
            team.competitionsAccess.push(compete._id);
            await team.save();
          }
        })
      );
    })
    .catch((err) => {
        console.log(err);
      res.status(500).json({ error: err });
    });
  res.status(201).json({ message: "Competition Created Successfully" });
});

router.route("/getCompeteNames").get(async (req, res) => {
  const data = await Competitions.find({ public: true });
  res.status(201).json(data);
});

router.route("/getDraftCompeteNames/:id").get(async (req, res) => {
  const { id } = req.params;
  const team = await Team.findById(id);
  let competitions = [];
  console.log(team.competitionsAccess);
  if (team) {
    await Promise.all(
      team.competitionsAccess.map(async (competition_id) => {
        const c = await Competitions.findOne({
          _id: competition_id,
          public: false,
        });
        console.log(c);
        if (c) {
          competitions.push(c);
        }
      })
    );
    res.status(201).json(competitions);
  }
});


// router.route("/isJoined/:url/:username").get(async (req, res) => {
//   const { url, username } = req.params;
//   let joined = false;
//   try {
//     const team = await Team.findOne({ username: username });
//     if (team) {
//       if (team.competitions.indexOf(url) > -1) {
//         joined = true;
//       }
//     }
//   } catch (err) {
//     console.log(err);
//   }
//   return res.status(200).json(joined);
// });

// Join Competition

// router.route("/joinCompete").post(async (req, res) => {
//   console.log("body", req.body);
//   const { url, username } = req.body;
//   try {
//     const team = await Team.findOne({ username: username });
//     if (team.competitions.indexOf(url) === -1) {
//       team.competitions.push(url);
//       await team.save();
//       const leaderboard = new Leaderboard({
//         compete: url,
//         name: username,
//       });
//       await leaderboard.save();
//     }
//     return res
//       .status(200)
//       .json({ message: "Competition Joined Successfully!" });
//   } catch (err) {
//     console.log(err);
//     return res.status(201).json({ message: "Cannot Join Competition!" });
//   }
// });


router.route("/updateCompeteOverview/:id").put(async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = await Competitions.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    console.log("Updated Compete", updatedData);
  } catch (err) {
    console.log(err);
  }
});

router.route("/deleteCompete/:id").post(async (req, res) => {
  const { id } = req.params;
  const compete = await Competitions.findById(id);
  if (compete) {
    const url = compete.url;
    await Overview.findOneAndDelete({ compete: url });
    await Data.findOneAndDelete({ compete: url });
    await Rules.findOneAndDelete({ compete: url });
    await Competitions.findByIdAndDelete(url);
    const leaderboard = await Leaderboard.find({ compete: url });
    await Promise.all(
      leaderboard.map(async (l) => {
        const team = await Team.findOne({ username: l.name });
        team.competitions.filter((t) => t !== url);
        await team.save();
      })
    );
    return res
      .status(200)
      .json({ message: "Competition Deleted Successfully!" });
  } else {
    return res.status(201).json({ message: "Competition Cannot be Deleted!" });
  }
});

module.exports = router;
