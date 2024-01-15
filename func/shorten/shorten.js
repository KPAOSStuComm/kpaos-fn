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

      // Generate a unique short code
      function generateShortUrl() {
        const characters =
          "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let shortCode = "";
        for (let i = 0; i < 8; i++) {
          shortCode += characters.charAt(
            Math.floor(Math.random() * characters.length)
          );
        }
        return shortCode;
      }

      const shortUrl = generateShortUrl();

      // Save the mapping in the Supabase table
      const { data: shortenedUrlData, error } = await supabase
        .from("urls")
        .insert([{ long_url: longUrl, short_url: shortUrl }]);

      if (error) {
        throw error;
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ shortUrl }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Internal Server Error" }),
      };
    }
  } else if (event.httpMethod === "GET") {
    const shortUrl = event.path.split("/").pop();

    try {
      const { data: urlData, error } = await supabase
        .from("urls")
        .select("long_url")
        .eq("short_url", shortUrl)
        .single();

      if (error || !urlData) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: "URL Not Found" }),
        };
      }

      return {
        statusCode: 301,
        headers: {
          Location: urlData.long_url,
        },
        body: "",
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
