document
  .getElementById("urlInput")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

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
        document.getElementById("linkInput").value = "";
        document.getElementById("shortenedLink").innerHTML = response.shortUrl;
        document.getElementById("shortenedLink").href = response.shortUrl;
      }

      if (!response.ok) {
        if (response.status === 401) {
          // Handle 401 Unauthorized (authentication failure)
          alert("Authentication failed: Invalid username or password");
        }
        if (response.status === 500) {
          // Handle 500 Internal Server Error (other server error)
          alert("Login failed: Internal server error");
        }
      }
    } catch (error) {
      console.error("Login error: ", error.message);
      alert("Login failed: " + error.message);
    }
  });

function copyToClipboard() {
  // Get the text field
  var copyText = document.getElementById("linkInput");

  // Select the text field
  copyText.select();
  copyText.setSelectionRange(0, 99999); // For mobile devices

  // Copy the text inside the text field
  navigator.clipboard.writeText(copyText.value);
}
