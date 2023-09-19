//! DELETE POINT

export function DeletePoint() {
    const deletePointButton = document.getElementById('deletePointButton');

    deletePointButton.addEventListener('click', () => {
        console.log('Delete button clicked');


        const deletePanel = jsPanel.create({
            position: 'center-top 70 70',
            content: `<input type="text" id="doorIDInput" placeholder="Door ID">
           <button id="deleteConfirmButton">Delete</button>
           <button id="deleteCancelButton">Cancel</button>`,
            headerTitle: 'Delete Point',
            theme: 'primary',
            contentSize: {
                width: '367px',
                height: '50px',
            },
        });


        const deleteConfirmButton = document.getElementById('deleteConfirmButton');
        const deleteCancelButton = document.getElementById('deleteCancelButton');

        deleteConfirmButton.addEventListener('click', () => {
            console.log('Remove button clicked');

            const doorIDInput = document.getElementById('doorIDInput');
            const doorIDToDelete = doorIDInput.value;
            console.log('Door ID to delete:', doorIDToDelete);

            if (doorIDToDelete !== '') {


                const requestBody = JSON.stringify({
                    doorId: doorIDToDelete,
                    doorName: "string"

                });

                console.log('Request Body:', requestBody);


                fetch('https://localhost:7184/api/Doors/delete', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': '*/*',
                    },
                    body: requestBody,
                })
                    .then(response => {
                        if (response.ok) {
                            console.log(`Data with doorID ${doorIDToDelete} deleted successfully.`);
                            deletePanel.close();

                            Toastify({
                                text: "Door Deleted Successfully",
                                className: "info",
                                style: {
                                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                                }
                            }).showToast();


                        } else {
                            console.error(`Failed to delete data with doorID ${doorIDToDelete}.`);


                            Toastify({
                                text: "Door Couldn't Delete!",
                                duration: 4000,
                                newWindow: true,
                                close: true,
                                gravity: "top",
                                position: "left",
                                stopOnFocus: true,
                                style: {
                                    
                                    background: "linear-gradient(to right, #ff3127, #ff3127)",
                                },
                            }).showToast();


                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            }
        });


        deleteCancelButton.addEventListener('click', () => {


            deletePanel.close();
        });



        let table = new DataTable('#myTable');

    });
}