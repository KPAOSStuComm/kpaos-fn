const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

exports.handler = async function (event, context) {
  if (event.httpMethod === "GET") {
    try {
      // Extract the user token from the cookie
      const userToken = event.headers.cookie
        ?.split("; ")
        .find((cookie) => cookie.startsWith("userToken="))
        ?.split("=")[1];

      // Verify userToken and get user information
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("username, name, profile_pic")
        .eq("token", userToken)
        .single();

      if (userError || !userData) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: "Unauthorized" }),
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({
          username: userData.username || null,
          name: userData.name || null,
          profilePic: userData.profile_pic || null,
        }),
      };
    } catch (error) {
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
