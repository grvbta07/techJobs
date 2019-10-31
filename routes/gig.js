const express = require("express");
const router = express.Router();
const db = require("../config/database");
const Gig = require("../models/Gig");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

//get jobs list
//not need to put '/jobs'  router will automatically use '/jobs' for '/'
router.get("/", (req, res) => {
  Gig.findAll()
    .then(jobs => {
      // res.render('gigs', {
      //     gigs: gigs
      // });
      //es6 format below instead
      res.render("gigs", {
        jobs
      });
    })
    .catch(err => console.log(err));
});

//Display add job form
router.get("/add", (req, res) => res.render("add"));

//Add a job
router.post("/add", (req, res) => {
  let { title, technologies, budget, description, contact_email } = req.body;
  let errors = [];

  //validate fields on server side
  if (!title) {
    errors.push({ text: "Please add a title" });
  }
  if (!technologies) {
    errors.push({ text: "Please add some technologies" });
  }
  if (!description) {
    errors.push({ text: "Please add a description" });
  }
  if (!contact_email) {
    errors.push({ text: "Please add a contact email" });
  }

  //check for errors
  if (errors.length > 0) {
    res.render("add", {
      errors,
      title,
      technologies,
      description,
      budget,
      contact_email
    });
  } else {
    if (!budget) {
      budget = "Unknown";
    } else {
      //put $ sign from server,user doesn't need to put that
      budget = `$${budget}`;
    }

    // Make lowercase and remove space after comma
    technologies = technologies.toLowerCase().replace(/, /g, ",");
    //with es6 u can write {title} instead of {title: tile}
    Gig.create({
      title,
      technologies,
      description,
      budget,
      contact_email
    })
      .then(gig => {
        res.redirect("/jobs");
      })
      .catch(err => console.log(err));
  }
});

//Search for jobs
router.get("/search", (req, res) => {
  //it is a get request,so param from form or search box will be in query
  //for post it will be in body {req.body}
  let { term } = req.query;
  //Make lowe case
  term = term.toLowerCase();

  Gig.findAll({
    where: {
      technologies: { [Op.like]: "%" + term + "%" }
    }
  })
    .then(jobs => res.render("gigs", { jobs }))
    .catch(err => console.log(err));
});

module.exports = router;
