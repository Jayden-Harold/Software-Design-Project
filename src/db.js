require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const sql = require("mssql");
const { OAuth2Client } = require("google-auth-library");

const app = express();
const port = process.env.PORT || 3000; // Use dynamic port for Azure

app.use(cors());
app.use(express.json());

const client = new OAuth2Client("665358967021-jplj68b577hu07gir38bld3u849hood6.apps.googleusercontent.com");

// DB config
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: { encrypt: true }
};

let pool;
async function getDb() {
  if (!pool) pool = await sql.connect(dbConfig);
  return pool;
}

async function verifyGoogleToken(idToken) {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: 665358967021-jplj68b577hu07gir38bld3u849hood6.apps.googleusercontent.com
  });
  return ticket.getPayload();
}

app.post("/api/auth/google", async (req, res) => {
  const { token } = req.body;
  try {
    const googleUser = await verifyGoogleToken(token);
    const db = await getDb();

    let result = await db.request()
      .input("sub", sql.VarChar, googleUser.sub)
      .query("SELECT Name, Role, CreatedDate FROM Users WHERE GoogleSubjectId = @sub");

    let user = result.recordset[0];

    if (!user) {
      const insertResult = await db.request()
        .input("sub", sql.VarChar, googleUser.sub)
        .input("name", sql.VarChar, googleUser.name)
        .input("role", sql.VarChar, "student") // default role
        .query("INSERT INTO Users (GoogleSubjectId, Name, Role) OUTPUT INSERTED.* VALUES (@sub, @name, @role)");

      user = insertResult.recordset[0];
    }

    const appToken = jwt.sign(
      { userId: user.UserId, role: user.Role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      token: appToken,
      user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Authentication failed" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
