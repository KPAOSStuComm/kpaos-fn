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

      // Set the token in a cookie
      const cookieHeaderValue = `userToken=${userData.token}; Path=/; HttpOnly; Secure; SameSite=Strict`;

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
