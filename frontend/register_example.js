// Example frontend code for registering a user
const registerUser = async (userData) => {
  try {
    const response = await fetch('http://localhost:8000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      // Handle different types of errors
      if (response.status === 400) {
        const errorData = await response.json();
        throw new Error(`Registration failed: ${errorData.detail || 'User already exists'}`);
      } else if (response.status === 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    const result = await response.json();
    console.log('Registration successful:', result);
    return result;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Example usage
const handleRegister = async () => {
  const userData = {
    email: 'user@example.com',
    password: 'securepassword',
    name: 'John Doe'
  };
  
  try {
    const result = await registerUser(userData);
    console.log('User registered successfully:', result);
    // You can now use the access token returned in result.access_token
  } catch (error) {
    console.error('Registration failed:', error.message);
    // Handle error appropriately in your UI
  }
};

// For testing purposes
// handleRegister();