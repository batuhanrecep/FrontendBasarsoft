import { QueryPoint } from './Buttons/QueryPoint.js';
import { DeletePoint } from './Buttons/DeletePoint.js';
//import { AddPoint } from './Buttons/AddPoint.js';
//import { DeleteSelected } from './Buttons/DeleteSelected.js';
//import { UpdatePoint } from './Buttons/UpdatePoint.js';

document.addEventListener('DOMContentLoaded', function () {



    const source = new ol.source.Vector();


    function displaySavedPoints() {
        fetch('https://localhost:7184/api/Doors/getall')
            .then(response => response.json())
            .then(data => {
                data.forEach(point => {
                    const feature = new ol.Feature({
                        geometry: new ol.geom.Point(ol.proj.fromLonLat([point.doorX, point.doorY])),
                        doorId: point.doorId,
                        doorName: point.doorName,
                    });
                    source.addFeature(feature);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    displaySavedPoints();



    const vectorLayer = new ol.layer.Vector({
        source: source,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)',
            }),
            stroke: new ol.style.Stroke({
                color: '#ffcc33',
                width: 2,
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#ffcc33',
                }),
            }),
        }),
    });




    const map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM(),
            }),
            vectorLayer,
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([35.168616, 39.062413]),
            zoom: 7,
        }),
    });


    const draw = new ol.interaction.Draw({
        source: source,
        type: 'Point',
    });


    const draw2 = new ol.interaction.Draw({
        source: source,
        type: 'Point',
    });



    import('./Buttons/QueryPoint.js').then(queryModule => {
        QueryPoint();
    });

    import('./Buttons/DeletePoint.js').then(queryModule => {
        DeletePoint();
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
                width: '740px',
                height: '45px',
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
                        background: "linear-gradient(to right, #ff3127, #ff3127)",
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
                            map.removeInteraction(draw);
                            addPointButton.textContent = 'Add Point';
                        } else {
                            Toastify({
                                text: "Error inserting to the database",
                                className: "info",
                                style: {
                                    background: "linear-gradient(to right, #ff3127, #ff3127)",
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
                                background: "linear-gradient(to right, #ff3127, #ff3127)",
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
               <input type="text" id="deleteSelectedXInput" placeholder="New X Coordinate" value="${x.toFixed(6)}" readonly>
               <input type="text" id="deleteSelectedYInput" placeholder="New Y Coordinate" value="${y.toFixed(6)}" readonly>
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
                        Toastify({
                            text: "Door couldn't deleted",
                            className: "info",
                            style: {
                                background: "linear-gradient(to right, #ff3127, #ff3127)",
                            }
                        }).showToast();
                        console.error(`Failed to delete data with doorID ${doorIDToDelete}.`);
                    }
                })
                .catch(error => {
                    Toastify({
                        text: "Door couldn't deleted",
                        className: "info",
                        style: {
                            background: "linear-gradient(to right, #ff3127, #ff3127)",
                        }
                    }).showToast();
                    console.error('Error:', error);
                });
        });

        deleteSelectedCancelButton.addEventListener('click', () => {
            deleteSelectedButton.textContent = 'Delete Selected';
            deleteSelectedPanel.close();
            map.removeInteraction(select);
        });
    }





    //! UPDATE POINT

    const updatePointButton = document.getElementById('updatePointButton');
    let updatingPoints = false;

    updatePointButton.addEventListener('click', () => {
        updatingPoints = !updatingPoints;
        if (updatingPoints) {
            updatePointButton.textContent = 'Updating Point (Click on Map)';
            map.addInteraction(select2);
        } else {
            updatePointButton.textContent = 'Update Point';

            map.removeInteraction(select2);

        }
    });


    const select2 = new ol.interaction.Select({
        layers: [vectorLayer],
    });

    select2.on('select', (event2) => {

        if (event2.selected.length > 0) {
            const selectedFeature2 = event2.selected[0];
            const coordinates2 = selectedFeature2.getGeometry().getCoordinates();
            const [x, y] = ol.proj.toLonLat(coordinates2);


            openUpdatePointPanel(selectedFeature2, x, y);
        }
    });

    function openUpdatePointPanel(feature, x, y) {

        const updatePointPanel = jsPanel.create({
            position: 'center-top 70 70',
            content: `<input type="text" id="updatePointDoorIDInput" placeholder="Door ID" value="${feature.get('doorId')}"  readonly>
             <input type="text" id="updatePointDoorNameInput" placeholder="Door Name" value="${feature.get('doorName')}" >
           <input type="text" id="updatePointXInput" placeholder="Old X Coordinate" value="${x.toFixed(6)}" readonly>
           <input type="text" id="updatePointYInput" placeholder="Old Y Coordinate" value="${y.toFixed(6)}" readonly>
           <button id="updatePointSelectNewCordinateButton">Select New Cordinate</button>
           <button id="updatePointConfirmButton">Update Door Name</button>
           <button id="updatePointCancelButton">Cancel</button>`,
         // <button id="updatePointSelectCancelButton">Cancel Selection</button>


            headerTitle: 'Update Point',
            theme: 'primary',
        });

        const updatePointConfirmButton = document.getElementById('updatePointConfirmButton');
        const updatePointCancelButton = document.getElementById('updatePointCancelButton');
       // const updatePointSelectCancelButton = document.getElementById('updatePointSelectCancelButton');
        const updatePointSelectNewCordinateButton = document.getElementById('updatePointSelectNewCordinateButton');
        let addingPoints2 = false;
        let drawnFeature2;

        updatePointSelectNewCordinateButton.addEventListener('click', () => {

            addingPoints2 = !addingPoints2;
            if (addingPoints2) {
                const isConfirmed = confirm("Are you sure you want to update the point?");
                if (isConfirmed) {
                    updatePointSelectNewCordinateButton.textContent = 'Selecting Points (Click on Map)';
                    map.addInteraction(draw2);
                }
            } else {
                updatePointSelectNewCordinateButton.textContent = 'XXXXXX';
                map.removeInteraction(draw2);
            }
        });


        updatePointConfirmButton.addEventListener('click', () => {
            const updatePointDoorIDInput = document.getElementById('updatePointDoorIDInput');
            const doorIDToUpdate = updatePointDoorIDInput.value;

            const updatePointDoorNameInput = document.getElementById('updatePointDoorNameInput');
            const doorIDToUpdateName = updatePointDoorNameInput.value;
            const X = document.getElementById('updatePointXInput');
            const doorIDToUpdateX = X.value;
            const Y = document.getElementById('updatePointYInput');
            const doorIDToUpdateY = Y.value;

            const requestBody = JSON.stringify({
                doorId: doorIDToUpdate,
                doorName: doorIDToUpdateName,
                doorX: doorIDToUpdateX,
                doorY: doorIDToUpdateY

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
                            text: "Door Name Updated!",
                            className: "info",
                            style: {
                                background: "linear-gradient(to right, #00b09b, #96c93d)",
                            }
                        }).showToast();

                        deletePanel.close();
                    } else {
                        console.error(`Failed to update data `);
                        Toastify({
                            text: "Door Couldn't Updated",
                            className: "info",
                            style: {
                                background: "linear-gradient(to right, #ff3127, #ff3127)",
                            }
                        }).showToast();
                        updatePointButton.textContent = 'Update Point';
                        updatePointPanel.close();
                        map.removeInteraction(select);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        });

        draw2.on('drawend', function (event) {
            const coordinate = event.feature.getGeometry().getCoordinates();
            const [newX, newY] = ol.proj.toLonLat(coordinate);
            const updatePointDoorIDInput = document.getElementById('updatePointDoorIDInput');
            const updatePointDoorNameInput = document.getElementById('updatePointDoorNameInput');

            const requestBody = JSON.stringify({
                doorId: updatePointDoorIDInput.value,
                doorName: updatePointDoorNameInput.value,
                doorX: newX,
                doorY: newY
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

                        source.removeFeature(drawnFeature);
                updatePointButton.textContent = 'Update Point';
                map.removeInteraction(draw2);
                map.removeInteraction(select2);
                updatePointPanel.close();
                    } else {
                        console.error(`Failed to update door.`);
                        Toastify({
                            text: "Door Couldn't Updated",
                            className: "info",
                            style: {
                                background: "linear-gradient(to right, #ff3127, #ff3127)",
                            }
                        }).showToast();
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    Toastify({
                        text: "Door Couldn't Updated",
                        className: "info",
                        style: {
                            background: "linear-gradient(to right, #ff3127, #ff3127)",
                        }
                    }).showToast();
                });
        });

/*
        updatePointSelectCancelButton.addEventListener('click', () => {
            if (!drawnFeature2) {
                source.removeFeature(drawnFeature2);
                map.removeInteraction(draw);
            }

        });
*/

        updatePointCancelButton.addEventListener('click', () => {
        
            
                source.removeFeature(drawnFeature);
                updatePointButton.textContent = 'Update Point';
                map.removeInteraction(draw2);
                map.removeInteraction(select2);
                updatePointPanel.close();
            
        });
    }







});
/*

    import('./Buttons/AddPoint.js').then(queryModule => {
        AddPoint();
    });
    
    import('./Buttons/UpdatePoint.js').then(queryModule => {
        UpdatePoint();
    });
    import('./Buttons/DeleteSelected.js').then(queryModule => {
        DeleteSelected();
    });

    */