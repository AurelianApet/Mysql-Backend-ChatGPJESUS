const User = require("../models/user.model.js");
const bcrypt = require("bcrypt");

// Create and Save a new User
exports.create = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPwd = await bcrypt.hash(req.body.password, salt);
  // Create a Tutorial
  const user = new User({
    email: req.body.email,
    password: hashedPwd,
    keyusage: req.body.keyusage || 0
  });

  // Save Tutorial in the database
  User.create(user, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User."
      });
    else res.send(data);
  });
};

exports.login = async (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const { email, password } = req.body

  User.findByEmail(`"${email}"`, async (err, data) => {
    if (err) {
      console.log("eeeror", err)
      res.status(500).send({
        success: false,
        message:
        err.message || "Some error occurred while finding the User."
      });
    }
    else {
      console.log("data", data)
      const valid = await bcrypt.compare(password, data.password)
      console.log("valid", valid)
      if(valid) {
        res.send({
          success: true,
          message: data
        });
      } else {
        res.send({
          success: false,
          message: "Passwords do not match"
        })
      }
    }
  })
}

exports.update = async (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const { email, oldPassword, newPassword } = req.body

  User.findByEmail(`"${email}"`, async (err, data) => {
    if (err) {
      console.log("eeeror", err)
      res.status(500).send({
        success: false,
        message:
        err.message || "Some error occurred while finding the User."
      });
    }
    else {
      console.log("data", data)
      const valid = await bcrypt.compare(oldPassword, data.password)
      console.log("valid", valid)
      if(valid) {
        const salt = await bcrypt.genSalt(10);
        const hashedPwd = await bcrypt.hash(newPassword, salt);
        User.updateById(data.id, {
          email: data.email,
          password: hashedPwd
        }, async (err, data) => {
          if(err) {
            res.send({
              success: false,
              message: err.message
            });
          } else {
            res.send({
              success: true,
              message: data
            });
          }
        })
      } else {
        res.send({
          success: false,
          message: "OldPassword do not match"
        })
      }
    }
  })
}

// // Retrieve all Tutorials from the database (with condition).
// exports.findAll = (req, res) => {
//   const title = req.query.title;

//   Tutorial.getAll(title, (err, data) => {
//     if (err)
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving tutorials."
//       });
//     else res.send(data);
//   });
// };

// // Find a single Tutorial by Id
// exports.findOne = (req, res) => {
//   Tutorial.findById(req.params.id, (err, data) => {
//     if (err) {
//       if (err.kind === "not_found") {
//         res.status(404).send({
//           message: `Not found Tutorial with id ${req.params.id}.`
//         });
//       } else {
//         res.status(500).send({
//           message: "Error retrieving Tutorial with id " + req.params.id
//         });
//       }
//     } else res.send(data);
//   });
// };

// // find all published Tutorials
// exports.findAllPublished = (req, res) => {
//   Tutorial.getAllPublished((err, data) => {
//     if (err)
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving tutorials."
//       });
//     else res.send(data);
//   });
// };

// // Update a Tutorial identified by the id in the request
// exports.update = (req, res) => {
//   // Validate Request
//   if (!req.body) {
//     res.status(400).send({
//       message: "Content can not be empty!"
//     });
//   }

//   console.log(req.body);

//   Tutorial.updateById(
//     req.params.id,
//     new Tutorial(req.body),
//     (err, data) => {
//       if (err) {
//         if (err.kind === "not_found") {
//           res.status(404).send({
//             message: `Not found Tutorial with id ${req.params.id}.`
//           });
//         } else {
//           res.status(500).send({
//             message: "Error updating Tutorial with id " + req.params.id
//           });
//         }
//       } else res.send(data);
//     }
//   );
// };

// // Delete a Tutorial with the specified id in the request
// exports.delete = (req, res) => {
//   Tutorial.remove(req.params.id, (err, data) => {
//     if (err) {
//       if (err.kind === "not_found") {
//         res.status(404).send({
//           message: `Not found Tutorial with id ${req.params.id}.`
//         });
//       } else {
//         res.status(500).send({
//           message: "Could not delete Tutorial with id " + req.params.id
//         });
//       }
//     } else res.send({ message: `Tutorial was deleted successfully!` });
//   });
// };

// // Delete all Tutorials from the database.
// exports.deleteAll = (req, res) => {
//   Tutorial.removeAll((err, data) => {
//     if (err)
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while removing all tutorials."
//       });
//     else res.send({ message: `All Tutorials were deleted successfully!` });
//   });
// };
