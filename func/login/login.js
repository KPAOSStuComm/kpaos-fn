const { createClient } = require("@supabase/supabase-js");
const bcrypt = require("bcrypt");
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

exports.handler = async function (event, context) {
  if (event.httpMethod === "POST") {
    try {
      const data = JSON.parse(event.body);
      const { username, password } = data;

      // Retrieve user data including hashed password from Supabase
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

      // Compare the provided password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, userData.password);

      if (!isPasswordValid) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: "Invalid username or password" }),
        };
      }

      // Calculate the expiration date (14 days from now)
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 14);

      // Set the token in a cookie with an expiration date
      const cookieHeaderValue = `userToken=${userData.token}; Path=/; HttpOnly; Secure; SameSite=Strict; Expires=${expirationDate.toUTCString()}`;

      // Return the user's token in the response
      return {
        statusCode: 200,
        headers: {
          "Set-Cookie": cookieHeaderValue,
        },
        body: JSON.stringify({ token: userData.token }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Internal Server Error: " + error }),
      };
    }
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }
};
