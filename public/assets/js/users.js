// Function to extract a cookie value by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

// Function to get user information
async function fetchUserData() {
  try {
    const response = await fetch("/.netlify/functions/users", {
      method: "GET",
    });

    if (response.ok) {
      // Logged in
      document.getElementById("name").innerText = response.name;
      document.getElementById("profileImg").src = response.profilePic;
    } else {
      if (userResponse.status === 401) {
        // Handle 401 Unauthorized (user not authenticated)
        location.href = "./";
      } else {
        // Handle other errors
        console.error("Error:", userResponse.status, userResponse.statusText);
      }
    }
  } catch (error) {
    console.error("Network Error:", error.message);
  }
}

// Call the function to get user information
fetchUserData();

// Function to perform logout
function logout() {
  // Clear the user token cookie
  document.cookie =
    "userToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  // Redirect to the login page
  window.location.href = "./";
}
