try {
  const response = await fetch("/.netlify/functions/users", {
    method: "GET",
  });

  if (response.ok) {
    // Successful response
    console.log("Success!");
  } else {
    // Handle non-OK responses
    if (response.status === 401) {
      // Handle 401 Unauthorized (authentication failure)
      location.href = "./";
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
