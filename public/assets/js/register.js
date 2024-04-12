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
