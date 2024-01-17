document
  .getElementById("login-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("/.netlify/functions/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, password: password }),
      });

      if (response.ok) {
        location.href = "./dashboard";
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

try {
  const response = await fetch("/.netlify/functions/users", {
    method: "GET",
  });

  if (response.ok) {
    // Successful response
    location.href = "./dashboard";
  } else {
    // Handle non-OK responses
    if (response.status === 401) {
      // Handle 401 Unauthorized (authentication failure)
    } else {
      // Handle other errors
      console.error("Error:", response.status, response.statusText);
      // Optionally display an error message to the user
    }
  }
} catch (error) {
  // Handle network or other errors
  console.error("Network Error:", error.message);
  // Optionally display an error message to the user
}
