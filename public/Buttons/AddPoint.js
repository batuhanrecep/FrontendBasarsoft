//! ADD POINT 


export function AddPoint() {
    const addPointButton = document.getElementById('addPointButton');
let addingPoints = false;
let drawnFeature;

addPointButton.addEventListener('click', () => {
    addingPoints = !addingPoints;
    if (addingPoints) {
        addPointButton.textContent = 'Adding Points (Click on Map)';
        map.addInteraction(draw);
    } else {
        addPointButton.textContent = 'Add Point';
        map.removeInteraction(draw);
    }
});


draw.on('drawend', function (event) {
    const coordinate = event.feature.getGeometry().getCoordinates();
    const [x, y] = ol.proj.toLonLat(coordinate);

    drawnFeature = event.feature;

    const coordinatePanel = jsPanel.create({
        position: 'center-top -120 68',
        content: `<input type="text" id="xInput" placeholder="X" readonly>  
                  <input type="text" id="yInput" placeholder="Y" readonly>
                  <input type="text" id="doorNameInput" placeholder="Door Name">
                  <button id="saveButton">Save</button>
                  <button id="cancelButton">Cancel</button>`,

        headerTitle: 'Add Point',
        theme: 'primary',
        contentSize: {
            width: '630px',
            height: '40px',
        },
    });

    const saveButton = document.getElementById('saveButton');
    const cancelButton = document.getElementById('cancelButton');

    saveButton.addEventListener('click', () => {

        const xInput = document.getElementById('xInput');
        const yInput = document.getElementById('yInput');
        const doorNameInput = document.getElementById('doorNameInput');

        const x = parseFloat(xInput.value);
        const y = parseFloat(yInput.value);
        const doorName = doorNameInput.value;

        if (doorName == null || doorName == "") {
            Toastify({
                text: "Please enter Door Name.",
                className: "info",
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                }
            }).showToast();
        } else {


            const requestBody = JSON.stringify({
                doorX: x,
                doorY: y,
                doorName: doorName
            });



            fetch('https://localhost:7184/api/Doors/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*'
                },
                body: requestBody
            })
                .then(response => {
                    console.log(response)
                    if (response.ok && doorName != "") {
                        Toastify({
                            text: "Inserted to the database successfully",
                            className: "info",
                            style: {
                                background: "linear-gradient(to right, #00b09b, #96c93d)",
                            }
                        }).showToast();
                        console.log('Point data saved successfully.');
                    } else {
                        Toastify({
                            text: "Error inserting to the database",
                            className: "info",
                            style: {
                                background: "linear-gradient(to right, #00b09b, #96c93d)",
                            }
                        }).showToast();
                        console.error('Failed to save point data.');
                    }
                })
                .catch(error => {
                    Toastify({
                        text: "Error inserting to the database",
                        className: "info",
                        style: {
                            background: "linear-gradient(to right, #00b09b, #96c93d)",
                        }
                    }).showToast();
                    console.error('Error:', error);
                });


            coordinatePanel.close();
        }


    });

    cancelButton.addEventListener('click', () => {
        if (drawnFeature) {
            source.removeFeature(drawnFeature);
            addPointButton.textContent = 'Add Point';
            map.removeInteraction(draw);
        }


        coordinatePanel.close();
    });

    document.getElementById('xInput').value = x.toFixed(6);
    document.getElementById('yInput').value = y.toFixed(6);
});
}
