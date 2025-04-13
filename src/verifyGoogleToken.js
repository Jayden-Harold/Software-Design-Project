const { OAuth2Client } = require('google-auth-library');
const client_id = "665358967021-jplj68b577hu07gir38bld3u849hood6.apps.googleusercontent.com";
const client = new OAuth2Client(client_id);

async function verifyIdToken(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: client_id,
    });

    const payload = ticket.getPayload();
    const userId = payload['sub']; // Google's unique user ID
    return payload;

  } 
  catch (err) {
    console.error('Token verification failed:', err);
    return null; // Don't throw, just return null
  }
}

module.exports = { verifyIdToken };