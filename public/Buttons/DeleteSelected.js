//! DELETE SELECTED 
export function DeleteSelected() {
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

/*
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
*/

function openDeleteSelectedPanel(feature, x, y) {
    const deleteSelectedPanel = jsPanel.create({
        position: 'center-top 70 70',
        content: `<input type="text" id="deleteSelectedDoorIDInput" placeholder="Door ID" value="${feature.get('doorId')}" readonly>
              <input type="text" id="deleteSelectedXInput" placeholder="New X Coordinate" value="${x.toFixed(6)}"readonly>
              <input type="text" id="deleteSelectedYInput" placeholder="New Y Coordinate" value="${y.toFixed(6)}"readonly>
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

}