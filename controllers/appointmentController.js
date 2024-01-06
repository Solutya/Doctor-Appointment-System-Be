const Appointment = require("../models/appointmentModel");
const Notification = require("../models/notificationModel");
const User = require("../models/userModel");

const getallappointments = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [{ userId: req.query.search }, { doctorId: req.query.search }],
        }
      : {};

    const appointments = await Appointment.find(keyword)
      .populate("doctorId")
      .populate("userId");
    return res.send(appointments);
  } catch (error) {
    res.status(500).send("Unable to get apponintments");
  }
};




//chng

const bookappointment = async (req, res) => {
  try {
    const existingAppointment = await Appointment.findOne({
      date: req.body.date,
      time: req.body.time,
      doctorId: req.body.doctorId,
    });

    if (existingAppointment) {
      return res.status(400).send("Appointment slot is already booked");
    }

    const appointment = await Appointment({
      date: req.body.date,
      time: req.body.time,
      doctorId: req.body.doctorId,
      userId: req.locals,
    });

    const usernotification = Notification({
      userId: req.locals,
      content: `You booked an appointment with Dr. ${req.body.doctorname} for ${req.body.date} ${req.body.time}`,
    });

    await usernotification.save();

    const user = await User.findById(req.locals);

    const doctornotification = Notification({
      userId: req.body.doctorId,
      content: `You have an appointment with ${user.firstname} ${user.lastname} on ${req.body.date} at ${req.body.time}`,
    });

    await doctornotification.save();

    const result = await appointment.save();
    return res.status(201).send(result);
  } catch (error) {
    console.log("error", error);
    res.status(500).send("Unable to book appointment");
  }
};










const completed = async (req, res) => {
  try {
    const alreadyFound = await Appointment.findOneAndUpdate(
      { _id: req.body.appointid },
      { status: "Accepted" }
    );

    const usernotification = Notification({
      userId: req.locals,
      content: `Your appointment with ${req.body.doctorname} has been completed`,
    });

    await usernotification.save();

    const user = await User.findById(req.locals);

    const doctornotification = Notification({
      userId: req.body.doctorId,
      content: `Your appointment with ${user.firstname} ${user.lastname} has been completed`,
    });

    await doctornotification.save();

    return res.status(201).send("Appointment completed");
  } catch (error) {
    res.status(500).send("Unable to complete appointment");
  }
};


//change



// const rejected = async (req, res) => {
//   try {
//     const alreadyFound = await Appointment.findOneAndUpdate(
//       { _id: req.body.appointid },
//       { status: "rejected" }
//     );

//     const usernotification = Notification({
//       userId: req.locals,
//       content: `Your appointment with ${req.body.doctorname} has been rejected`,
//     });

//     await usernotification.save();

//     const user = await User.findById(req.locals);

//     const doctornotification = Notification({
//       userId: req.body.doctorId,
//       content: `Your appointment with ${user.firstname} ${user.lastname} has been rejected`,
//     });

//     await doctornotification.save();

//     return res.status(201).send("Appointment rejected");
//   } catch (error) {
//     res.status(500).send("Unable to reject appointment");
//   }
// };

module.exports = {
  getallappointments,
  bookappointment,
  completed,
 //rejected,
};











// module.exports = {
//   getallappointments,
//   bookappointment,
//   completed,
// };
