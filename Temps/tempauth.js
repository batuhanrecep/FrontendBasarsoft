let loging = false;

loginButton.addEventListener('click', () => {


    loging = !loging;
    if (loging) {
        const loginButtonEmailInput = document.getElementById('updatePointDoorIDInput');
        const loginButtonPasswordInput = document.getElementById('updatePointDoorIDInput');
        
        const email1 = loginButtonEmailInput.value;
        const password1 = loginButtonPasswordInput.value;
        
        
        const requestBody = JSON.stringify({
                email: email1,
                password: password1
              

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
                   
                    

                    deletePanel.close();
                } else {
                    console.error(`Failed to update data `);
                    
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });


    } else {
        
    }
});
