

//! UPDATE POINT
export function UpdatePoint() {

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
              <button id="updatePointSelectNewCordinateButton">Select Cordinate</button>
              <button id="updatePointConfirmButton">Update</button>
              <button id="updatePointCancelButton">Cancel</button>
              <button id="updatePointSelectCancelButton">Cancel Selection</button>`,


        headerTitle: 'Update Point',
        theme: 'primary',
    });

    const updatePointConfirmButton = document.getElementById('updatePointConfirmButton');
    const updatePointCancelButton = document.getElementById('updatePointCancelButton');
    const updatePointSelectCancelButton = document.getElementById('updatePointSelectCancelButton');
    const updatePointSelectNewCordinateButton = document.getElementById('updatePointSelectNewCordinateButton');
    let addingPoints2 = false;
    let drawnFeature2;

    updatePointSelectNewCordinateButton.addEventListener('click', () => {

        addingPoints2 = !addingPoints2;
        if (addingPoints2) {
            const isConfirmed = confirm("Are you sure you want to update the point?");
            if(isConfirmed){
                updatePointSelectNewCordinateButton.textContent = 'Selecting Points (Click on Map)';
            map.addInteraction(draw2);
            }
        } else {
            updatePointSelectNewCordinateButton.textContent = 'XXXXXX';
            map.removeInteraction(draw2);
        }
    });


    // ...

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
        updatePointPanel.close();
        map.removeInteraction(draw2);
        displaySavedPoints(); 
    } else {
        console.error(`Failed to update door.`);
    }
})
.catch(error => {
    console.error('Error:', error);
});
});


    updatePointSelectCancelButton.addEventListener('click', () => {
        if (!drawnFeature2) {
            source.removeFeature(drawnFeature2);
            map.removeInteraction(draw);
        }

    });


    updatePointCancelButton.addEventListener('click', () => {
        updatePointButton.textContent = 'Delete Selected';
        updatePointPanel.close();
        map.removeInteraction(select);
    });
}


}