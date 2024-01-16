// ./func/login/login.js
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

exports.handler = async function (event, context) {
  if (event.httpMethod === "POST") {
    try {
      const data = JSON.parse(event.body);
      const { username, password } = data;

      // Retrieve user data including plain text password from Supabase
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id", "username", "password", "token")
        .eq("username", username)
        .single();

      if (userError || !userData) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: "Invalid username or password" }),
        };
      }

      // Compare the provided password with the stored plain text password
      if (password !== userData.password) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: "Invalid username or password" }),
        };
      }

      // Calculate the expiration date (14 days from now)
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 14);

      // Set the token in a cookie with an expiration date
      const cookieHeaderValue = `userToken=${
        userData.token
      }; Path=/; HttpOnly; Secure; SameSite=Strict; Expires=${expirationDate.toUTCString()}`;

      // Return the user's token in the response
      return {
        statusCode: 200,
        headers: {
          "Set-Cookie": cookieHeaderValue,
        },
        body: JSON.stringify({ token: userData.token }),
      };
    } catch (error) {
      console.error("Error:", error.message);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Internal Server Error" }),
      };
    }
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }
};
