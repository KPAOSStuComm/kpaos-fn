document
  .getElementById("urlInput")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    document.getElementById("shortenedLink").innerHTML = "กำลังย่อลิงก์...";
    const url = document.getElementById("linkInput").value;

    try {
      const response = await fetch("../.netlify/functions/urls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ longUrl: url }),
      });

      if (response.ok) {
        // Parse the JSON response
        const responseData = await response.json();

        document.getElementById("linkInput").value = "";
        document.getElementById("shortenedLink").innerHTML =
          responseData.shortUrl;
        document.getElementById("shortenedLink").href = responseData.shortUrl;
      }

      if (!response.ok) {
        if (response.status === 401) {
          // Handle 401 Unauthorized (authentication failure)
          alert("Authentication failed: Invalid username or password");
        }
        if (response.status === 500) {
          // Handle 500 Internal Server Error (other server error)
          alert("Internal server error");
        }
      }
    } catch (error) {
      console.error("Network error: ", error.message);
      alert("Network error: " + error.message);
    }
  });
