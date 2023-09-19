//! Login Button

const loginText = document.querySelector(".title-text .login");
const loginForm = document.querySelector("form.login");
const loginButton = document.getElementById("loginButton");

// Add an event listener for the login button
loginButton.addEventListener('click', () => {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const requestBody = JSON.stringify({
        email: email,
        password: password
    });

    fetch('https://localhost:7184/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
        },
        body: requestBody,
    })
        .then(response => {
            if (response.ok) {
                // Handle successful login here
                alert('Login successful');
            } else {
                // Handle login failure here
                alert('Login failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});


//! Register Button



const registerButton = document.getElementById("RegisterButton");


registerButton.addEventListener('click', () => {
    const email = document.getElementById('RegisterEmail').value;
    const name = document.getElementById('RegisterName').value;
    const lastName = document.getElementById('RegisterLastName').value;
    const password = document.getElementById('RegisterPassword').value;
    const confirmPassword = document.getElementById('RegisterConfirmPassword').value;

    // Check if passwords match
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    const requestBody = JSON.stringify({
        email: email,
        name: name,
        lastName: lastName,
        password: password
    });

    fetch('https://localhost:7184/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
        },
        body: requestBody,
    })
        .then(response => {
            if (response.ok) {
                // Handle successful registration here
                alert('Registration successful');
            } else {
                // Handle registration failure here
                alert('Registration failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});



