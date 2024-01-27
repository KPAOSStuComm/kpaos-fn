document
  .getElementById("login-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const loginResponse = await fetch("../.netlify/functions/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (loginResponse.ok) {
        // Successful login, redirect to dashboard
        location.href = "./dashboard";
      } else {
        // Handle non-OK responses
        if (loginResponse.status === 401) {
          // Handle 401 Unauthorized (authentication failure)
          alert("Authentication failed: Invalid username or password");
        } else if (loginResponse.status === 500) {
          // Handle 500 Internal Server Error (other server error)
          alert("Login failed: Internal server error");
        } else {
          // Handle other errors
          console.error(
            "Login Error:",
            loginResponse.status,
            loginResponse.statusText
          );
        }
      }
    } catch (error) {
      // Handle network or other errors
      console.error("Login Network Error:", error.message);
      alert("Login failed: " + error.message);
    }
  });

async function checkAuthenticationAndRedirect() {
  // Check if the user is already authenticated
  try {
    const userResponse = await fetch("/.netlify/functions/users", {
      method: "GET",
    });

    if (userResponse.ok) {
      // Successful response, user is authenticated, redirect to dashboard
      location.href = "./dashboard";
    } else {
      // Handle non-OK responses
      if (userResponse.status === 401) {
        // Handle 401 Unauthorized (user not authenticated)
        // You can optionally handle this case or just let the user stay on the login page
      } else {
        // Handle other errors
        console.error(
          "User Error:",
          userResponse.status,
          userResponse.statusText
        );
      }
    }
  } catch (error) {
    // Handle network or other errors
    console.error("User Network Error:", error.message);
    // Optionally display an error message to the user
  }
}

// Call the async function
checkAuthenticationAndRedirect();
