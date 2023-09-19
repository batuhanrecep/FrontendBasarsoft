//! QUERY POINT
export function QueryPoint() {

queryPointButton.addEventListener('click', () => {

    const dataTablePanel = jsPanel.create({
        position: 'center-top 680 450',
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
}