const express = require("express");
const bodyParser = require("body-parser");
const { createClient } = require("@supabase/supabase-js");
const netlify = require("@netlify/functions");

const app = express();

app.use(bodyParser.json());

// Initialize Superbase client
const supabaseUrl = "https://iincxrqzcwuwaehiufbk.supabase.co";
const supabaseKey = "null";
const supabase = createClient(supabaseUrl, supabaseKey);

// Generate a unique short code
function generateShortCode() {
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

// Validate short code
function isValidShortCode(shortCode) {
  const regex = /^[a-zA-Z0-9]{8}$/;
  return regex.test(shortCode);
}

// Endpoint to shorten a URL
app.post("/shorten", async (req, res) => {
  const longUrl = req.body.url;
  const shortCode = generateShortCode();

  // Save the link to Superbase
  const { data, error } = await supabase
    .from("links")
    .insert([{ shortCode, longUrl }]);

  if (error) {
    res.status(500).json({ error: "Failed to shorten URL: " + error.message });
  } else {
    res.json({ shortCode });
  }
});

// Endpoint to redirect to the original URL
app.get("/:shortCode", async (req, res) => {
  const shortCode = req.params.shortCode;
  if (isValidShortCode(shortCode)) {
    // Retrieve the long URL from Superbase
    const { data, error } = await supabase
      .from("links")
      .select("longUrl")
      .eq("shortCode", shortCode)
      .single();

    if (error) {
      res.status(500).send("Failed to retrieve URL");
    } else if (data) {
      res.redirect(data.longUrl);
    } else {
      res.status(404).send("URL not found");
    }
  } else {
    res.status(400).send("Invalid short code");
  }
});

exports.handler = netlify.functions.httpsHandler(app);
