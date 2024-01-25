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
          alert("Login failed: Internal server error");
        }
      }
    } catch (error) {
      console.error("Login error: ", error.message);
      alert("Login failed: " + error.message);
    }
  });

function copyToClipboard() {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    // Use the Clipboard API if available
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert(`Copied to clipboard!`);
      })
      .catch((error) => {
        alert("Error copying to clipboard: " + error.message);
        copyToClipboardFallback(text); // Use fallback if Clipboard API fails
      });
  } else {
    // Get the text field
    var copyText = document.getElementById("shortenedLink");

    // Create a range to select the text
    var range = document.createRange();
    range.selectNode(copyText);

    // Clear any existing selection and select the text
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);

    // Copy the selected text to the clipboard
    document.execCommand("copy");

    // Clear the selection
    window.getSelection().removeAllRanges();

    alert("Copied");
  }
}
