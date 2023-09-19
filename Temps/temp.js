//! QUERY POINT
queryPointButton.addEventListener('click', () => {

    const dataTablePanel = jsPanel.create({
        position: 'center-top 810 600',
        content: `<table id="queryDataTable" class="display" style="width:100%">
            <thead>
                <tr>
                    <th>Door ID</th>
                    <th>Door X</th>
                    <th>Door Y</th>
                    <th>Door Name</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>`,

        headerTitle: 'Query Point Data',
        theme: 'primary',
        contentSize: {
            width: '500px',
            height: '450px',
        },
    });

    let queryDataTable;

    function populateTable() {
        if (queryDataTable) {
            queryDataTable.destroy();
        }

        fetch('https://localhost:7184/api/Doors/getall')
            .then(response => response.json())
            .then(data => {
                queryDataTable = $('#queryDataTable').DataTable({
                    data: data,
                    columns: [
                        { data: 'doorId' },
                        { data: 'doorX' },
                        { data: 'doorY' },
                        { data: 'doorName' }
                    ]
                });
            })
            .catch(error => console.error('Error:', error));
    }


    populateTable();


    dataTablePanel.header.insertAdjacentHTML(
        'beforeend',
        '<button id="refreshButton">Refresh</button> <button id="cancelButton">Cancel</button>'
    );


    document.getElementById('refreshButton').addEventListener('click', () => {

        populateTable();
    });


    document.getElementById('cancelButton').addEventListener('click', () => {

        dataTablePanel.close();
    });
});


//! ADD POINT 


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

//! DELETE POINT
//! DELETE POINT
//! DELETE POINT

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
                    } else {
                        console.error(`Failed to delete data with doorID ${doorIDToDelete}.`);
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


//! DELETE SELECTED 

const deleteSelectedButton = document.getElementById('deleteSelectedButton');
let deletingPoints = false;

deleteSelectedButton.addEventListener('click', () => {
    deletingPoints = !deletingPoints;
    if (deletingPoints) {
        deleteSelectedButton.textContent = 'Deletings Points (Click on Map)';
        map.addInteraction(select);
    } else {
        deleteSelectedButton.textContent = 'Delete Selected';

        map.removeInteraction(select);

    }
});


const select = new ol.interaction.Select({
    layers: [vectorLayer],
});

select.on('select', (event) => {

    if (event.selected.length > 0) {
        const selectedFeature = event.selected[0];
        const coordinates = selectedFeature.getGeometry().getCoordinates();
        const [x, y] = ol.proj.toLonLat(coordinates);


        openDeleteSelectedPanel(selectedFeature, x, y);
    }
});


function openDeleteSelectedPanel(feature, x, y) {
    const deleteSelectedPanel = jsPanel.create({
        position: 'center-top 70 70',
        content: `<input type="text" id="deleteSelectedDoorIDInput" placeholder="Door ID" value="${feature.get('doorId')}" readonly>
              <input type="text" id="deleteSelectedXInput" placeholder="New X Coordinate" value="${x.toFixed(6)}">
              <input type="text" id="deleteSelectedYInput" placeholder="New Y Coordinate" value="${y.toFixed(6)}">
              <button id="deleteSelectedConfirmButton">Delete</button>
              <button id="deleteSelectedCancelButton">Cancel</button>`,
        headerTitle: 'Delete Selected',
        theme: 'primary',
    });

    const deleteSelectedConfirmButton = document.getElementById('deleteSelectedConfirmButton');
    const deleteSelectedCancelButton = document.getElementById('deleteSelectedCancelButton');

    deleteSelectedConfirmButton.addEventListener('click', () => {

        const deleteSelectedDoorIDInput = document.getElementById('deleteSelectedDoorIDInput');
        const doorIDToDelete = deleteSelectedDoorIDInput.value;

        const requestBody = JSON.stringify({
            doorId: doorIDToDelete,
            doorName: "string"

        });

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

                    Toastify({
                        text: "Door Deleted Successfully",
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

    deleteSelectedCancelButton.addEventListener('click', () => {
        deleteSelectedButton.textContent = 'Delete Selected';
        deleteSelectedPanel.close();
        map.removeInteraction(select);
    });
}
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

 