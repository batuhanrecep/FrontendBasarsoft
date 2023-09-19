


draw.on('drawend', function (event) {
    const coordinate = event.feature.getGeometry().getCoordinates();
    const [x, y] = ol.proj.toLonLat(coordinate);    
    drawnFeature2 = event.feature2;

    // const updatePointXInput = parseFloat(x.value);
    //const updatePointYInput = parseFloat(y.value);

    updatePointConfirmButton.addEventListener('click', () => {
    console.log(`xxxxxx.`);
        const coordinates2 = event.feature.getGeometry().getCoordinates();
        const [x, y] = ol.proj.toLonLat(coordinates2);
        drawnFeature2 = event.feature2;

        const updatePointXInput = document.getElementById('updatePointDoorNameInput');
        const updatePointYInput = document.getElementById('updatePointDoorIDInput');

        
        // const x = parseFloat(updatePointXInput.value);
        // const y = parseFloat(updatePointYInput.value);
        const updatePointDoorNameInput = document.getElementById('updatePointDoorNameInput');
        //const doorNameToUpdate = newName.value;  //! type string 
        const updatePointDoorIDInput = document.getElementById('updatePointDoorIDInput');
        //const doorIDToUpdate = updatePointDoorIDInput.value;    

        const requestBody = JSON.stringify({
            doorId: updatePointDoorIDInput,
            doorName: updatePointDoorNameInput, //! type string 
            doorX: updatePointXInput,
            doorY: updatePointYInput
        });

        fetch('https://localhost:7184/api/Doors/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
            },
            body: requestBody,
        })
            .then(response => {
                if (response.ok) {


                    Toastify({
                        text: "Door Updated Successfully",
                        className: "info",
                        style: {
                            background: "linear-gradient(to right, #00b09b, #96c93d)",
                        }
                    }).showToast();
                    deleteSelectedPanel.close();
                } else {
                    console.error(`Failed to delete data with doorID ${doorIDToDelete}.`);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });

}); 