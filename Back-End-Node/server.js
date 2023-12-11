const express = require("express");
const app = express();
const { pool } = require("./dbConfig");
const http = require("http");
const fs = require("fs");
const https = require("https");
const { WebClient } = require("@slack/web-api");
const cors = require("cors");
const secret = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");
const frontendUrl = process.env.FRONT_END_URL;
const verifyToken = require("./verifyToken");
const verifyAdminToken = require("./verifyAdminToken.js");
const reminderEmail = require('./reminder');

const {
  getSignUpDetailsFromDatabase,
  cancelSignUp,
  insertSignUp,
  updateUser,
  createUser,
  updateTitle,
} = require("./helpers.js");

app.use(cors());
app.use(express.json());
require("dotenv").config();
app.use('/api', reminderEmail); //reminder email

const client_id = process.env.VITE_SLACK_CLIENT_ID;
const client_secret = process.env.SLACK_CLIENT_SECRET;
const redirect_uri = `${process.env.BACK_END_URL_SLACK}/auth/redirect`;
const client = new WebClient();

const createToken = (userId, role) => {
  // TODO: it is confusing at the moment that we are using Slack title as the role here
  const token = jwt.sign({ id: userId, roles: role }, secret, {
    expiresIn: 86400, // expires in 24 hours
  });

  return token;
};

app.get("/auth/redirect", async (req, res) => {
  try {
    const { code } = req.query;

    // Exchange the code for an OAuth token
    const result = await client.oauth.v2.access({
      code,
      client_id,
      client_secret,
      redirect_uri,
    });

    // Use the token to get user information
    const userProfile = await client.users.profile.get({
      user: result.authed_user.id,
      token: result.authed_user.access_token,
    });

    const existingUser = await pool.query(
      "SELECT * FROM person WHERE slack_email = $1",
      [userProfile["profile"]["email"]]
    );

    let jwtToken = "";
    const role = userProfile["profile"]["title"].toLowerCase();

    if (existingUser.rows.length > 0) {
      //login
      if (
        existingUser.rows[0]["slack_firstname"] !==
          userProfile["profile"]["first_name"] ||
        existingUser.rows[0]["slack_photo_link"] !==
          userProfile["profile"]["image_original"] ||
        existingUser.rows[0]["slack_lastname"] !==
          userProfile["profile"]["last_name"]
      ) {
        updateUser(
          existingUser.rows[0]["id"],
          userProfile["profile"]["last_name"],
          userProfile["profile"]["first_name"],
          userProfile["profile"]["image_original"]
        );
      }
      if (
        existingUser.rows[0]["slack_title"].toLowerCase() !== "admin" &&
        role !== existingUser.rows[0]["slack_title"].toLowerCase() &&
        role !== "admin"
      ) {
        updateTitle(existingUser.rows[0]["id"], role);
      } else if (role == "admin" && existingUser.rows[0]["slack_title"] !== "admin") {
        res
          .status(401)
          .json({ error: "You can not change your role as admin" });
      }

      jwtToken = createToken(existingUser.rows[0]["id"], role);
      return res.redirect(`${frontendUrl}/oauthdone?code=${jwtToken}`);
    } else {
      //signup
      if (role == "admin") {
        res.status(401).json({
          error: "You can not register as admin",
        });
      }
      const insertResult = await createUser(
        userProfile["profile"]["image_original"],
        userProfile["profile"]["first_name"],
        userProfile["profile"]["last_name"],
        userProfile["profile"]["email"],
        role
      );

      console.log(insertResult)

      jwtToken = createToken(insertResult.rows[0]["id"], role);

      // redirect back to frontend so that it can run setSession with this token
      res.redirect(`${frontendUrl}/oauthdone?code=${jwtToken}`);
    }
  } catch (error) {
    console.error("Error during OAuth process:", error);
    res.status(500).send("Something went wrong!");
  }
});

const options = {
  key: fs.readFileSync(`${__dirname}/client-key.pem`),
  cert: fs.readFileSync(`${__dirname}/client-cert.pem`),
};
if (process.env.LOCAL_DEVELOPMENT) {
  // Slack requires https for OAuth, but locally we want to use http
  // to avoid having to maintain our own certificates
  https.createServer(options, app).listen(443);
  http.createServer(app).listen(10000);
} else {
  // when we deploy on Vercel, Vercel adds HTTPS for us, so we can just use one port
  //console.log("PRODUCT");
  https.createServer(options, app).listen(10000);
}

//cities
app.get("/cities", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM region");
    res.send(result.rows);
  } catch (error) {
    res.status(500).send("Error fetching city data");
    console.error("Error executing query:", error);
  }
});


//Profile endpoint
app.get("/profile", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;

    // Fetch user profile details from the database
    const userProfile = await pool.query(
      "SELECT id, slack_firstname, slack_lastname, slack_email, slack_title, slack_photo_link FROM person WHERE id = $1",
      [userId]
    );

    if (userProfile.rows.length === 0) {
      // User not found
      return res.status(404).json({ error: "User not found." });
    }

    // Respond with the user's profile details
    res.status(200).json({
      id: userProfile.rows[0].id,
      slack_firstname: userProfile.rows[0].slack_firstname,
      slack_lastname: userProfile.rows[0].slack_lastname,
      email: userProfile.rows[0].slack_email,
      slack_title: userProfile.rows[0].slack_title,
      slack_photo_link: userProfile.rows[0].slack_photo_link,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

// Delete by id from signup classes
app.get("/cancel-signup/:sessionId", verifyToken, async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const userId = req.userId;
    await cancelSignUp(sessionId, userId);

    res.json({ success: true });
  } catch (error) {
    console.error("Error canceling sign-up:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

// fixes "No exports found in module" error
// https://stackoverflow.com/questions/75565239/no-exports-found-in-module-error-when-deploying-express-rest-api-on-vercel

//Profile endpoint
app.get("/signup-details", verifyToken, async (req, res) => {
  const userId = req.userId;
  const sessionId = req.body.sessionId;
  try {
    const signUpDetails = await getSignUpDetailsFromDatabase(userId, sessionId);

    res.json(signUpDetails.rows);
  } catch (error) {
    console.error("Error fetching sign-up details:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.post("/insert-signup", verifyToken, async (req, res) => {
  try {
    const sessionId = req.body.sessionId;
    const userId = req.userId;
    const role = req.body.role;
    
    await insertSignUp(sessionId, role, userId);
    try {  // email service
      await reminderEmail(userId, sessionId);

    } catch (error) {
      console.error('Error sending reminder email:', error);
      res.status(500).json({ error: 'Something went wrong.' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error("Error insert sign-up:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

//session table
app.get("/session", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        session.id,
        session.date,
        session.time_start,
        session.time_end,
        'Barath' AS who_leading,
        'London' AS city,
        session.meeting_link,
        lesson_content.module AS module_name,
        lesson_content.week_no AS module_week,
        lesson_content.syllabus_link
      FROM session
      JOIN lesson_content
      ON session.lesson_content_id = lesson_content.id;
    `);
    res.send(result.rows);
  } catch (error) {
    res.status(500).send("Error fetching session data");
    console.error("Error executing query:", error);
  }
});

// app.post("/session", verifyToken, async (req, res) => {
//   try {
//     await pool.query(
//       "INSERT INTO session(date, time_start, time_end, event_type, location, lesson_content_id, cohort_id) VALUES ($1, $2, $3, $4, $5, $6, $7)",
//       [
//         new Date(),
//         new Date(),
//         new Date(),
//         "Technical Education",
//         "London",
//         1,
//         1,
//       ]
//     );
//     res.json({ success: true });
//   } catch (error) {
//     res.status(500).json({ error: "Something went wrong." });
//   }
// });

app.get("/lesson_content", async (req, res) => {
  try {
    const result = await pool.query("Select * from lesson_content");
    res.send(result.rows);
  } catch (error) {
    res.status(500).send(error);
  }
});

// app.post("/lesson_content", verifyToken, async (req, res) => {
//   try {
//     const { module, module_no, week_no, lesson_topic, syllabus_link } =
//       req.body;
//     await pool.query(
//       "INSERT INTO lesson_content(module, module_no, week_no, lesson_topic, syllabus_link) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (module, module_no, week_no) DO UPDATE SET lesson_topic = $4, syllabus_link = $5",
//       [module, module_no, week_no, lesson_topic, syllabus_link]
//     );
//     res.json({ success: true });
//   } catch (error) {
//     res.status(500).json({ error: "Something went wrong." });
//   }
// });

//see attendee all voluteer for the session
app.get("/attendance/:sessionId", async (req, res) => {
  const sessionId = req.params.sessionId;
  try {
    const result = await pool.query(
      "SELECT person.slack_firstname, person.slack_lastname, role.name FROM attendance JOIN person ON attendance.person_id = person.id JOIN role ON attendance.role_id = role.id JOIN session ON attendance.session_id = session.id WHERE session.id = $1;",
      [sessionId]
    );

    res.send(result.rows);
  } catch (error) {
    res.status(500).send("Error fetching attendance data");
    console.error("Error executing query:", error);
  }
});

app.get("/roles", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM role");

    const roles = result.rows.map((role) => ({ id: role.id, name: role.name }));

    res.json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

module.exports = app;
