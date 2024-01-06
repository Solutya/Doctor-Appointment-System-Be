const express = require("express");
const auth = require("../middleware/auth");
const appointmentController = require("../controllers/appointmentController");

const appointRouter = express.Router();

appointRouter.get(
  "/getallappointments",
  auth,
  appointmentController.getallappointments
);

appointRouter.post(
  "/bookappointment",
  auth,
  appointmentController.bookappointment
);

appointRouter.put("/completed", auth, appointmentController.completed);

 //chng

// appointRouter.put("/rejected", auth, appointmentController.rejected);




module.exports = appointRouter;
