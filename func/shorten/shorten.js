const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

exports.handler = async function (event, context) {
  if (event.httpMethod === "POST") {
    try {
      const data = JSON.parse(event.body);
      const { longUrl } = data;

      // Extract the user token from the cookie
      const userToken = event.headers.cookie
        ?.split("; ")
        .find((cookie) => cookie.startsWith("userToken="))
        ?.split("=")[1];

      // Verify userToken and get user information
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("username")
        .eq("token", userToken)
        .single();

      if (userError || !userData) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: "Unauthorized" }),
        };
      }

      // Generate a unique short code
      async function generateShortUrl() {
        const characters =
          "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const codeLength = 8;

        while (true) {
          let shortCode = "";
          for (let i = 0; i < codeLength; i++) {
            shortCode += characters.charAt(
              Math.floor(Math.random() * characters.length)
            );
          }

          // Check if the generated code already exists in the database
          const { data: existingUrls, error } = await supabase
            .from("urls")
            .select("short_url")
            .eq("short_url", shortCode)
            .single();

          if (error || !existingUrls.length) {
            // The generated code is unique, return it
            return shortCode;
          } else {
            // The generated code already exists, generate a new one
            continue;
          }
          // If the code already exists, loop and generate a new one
        }
      }

      const shortUrl = await generateShortUrl();

      // Save the mapping in the Supabase table
      const { data: shortenedUrlData, error } = await supabase
        .from("urls")
        .insert([
          {
            long_url: longUrl,
            short_url: shortUrl,
            author: userData.username, // Store the username in the URLs table
          },
        ]);

      if (error) {
        throw error;
      }

      return {
        statusCode: 201,
        body: JSON.stringify({
          shortUrl: "https://kpaos-shorturl.netlify.app/fn/urls/" + shortUrl,
        }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Internal Server Error: " + error.message,
        }),
      };
    }
    // ...
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }
};
