$(document).ready(function () {
    // Store CSV data in memory
    let csvData = [];

    // Function to render CSV table
    function renderCsvTable(data) {
        const $tableBody = $('#csvTableBody');
        $tableBody.empty();

        if (data.length === 0) {
            $tableBody.append('<tr><td colspan="15" class="text-center">No data available</td></tr>');
            return;
        }

        data.forEach(row => {
            if (!row['Unit Code']) return; // Skip invalid rows
            const rowHtml = `
                <tr>
                    <td>${row['Row Number'] || ''}</td>
                    <td>${row['Level'] || ''}</td>
                    <td>${row['Building Type'] || ''}</td>
                    <td>${row['Building Number'] || ''}</td>
                    <td>${row['Unit Code'] || ''}</td>
                    <td>${row['Floor Number'] || ''}</td>
                    <td>${row['Unit Type'] || ''}</td>
                    <td>${row['Gross Area'] || ''}</td>
                    <td>${row['Gross Area Price'] || ''}</td>
                    <td>${row['Outdoor Area'] || ''}</td>
                    <td>${row['Total Area'] || ''}</td>
                    <td>${row['Availability'] || ''}</td>
                    <td>${row['Discount Amount'] || ''}</td>
                    <td>${row['Discount Percentage'] || ''}</td>
                    <td>${row['Total Price'] || ''}</td>
                </tr>
            `;
            $tableBody.append(rowHtml);
        });
    }

    // Function to load CSV
    function loadCsv() {
        Papa.parse("./assets/data/SolyVieDatabase.csv", {
            download: true,
            header: true,
            complete: function (results) {
                csvData = results.data;
                renderCsvTable(csvData);
            },
            error: function (error) {
                console.error('Error loading CSV:', error);
                $('#csvTableBody').html('<tr><td colspan="15" class="text-center">Error loading data</td></tr>');
            }
        });
    }

    // Export Table: Download SolyVieDatabase.csv
    $('#exportBtn').click(function () {
        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'SolyVieDatabase.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // Import Table: Trigger file input
    $('#importBtn').click(function () {
        $('#importFile').click();
    });

    // Handle file upload
    $('#importFile').change(function (event) {
        const file = event.target.files[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            complete: function (results) {
                // Validate CSV structure
                const expectedHeaders = [
                    'Row Number', 'Level', 'Building Type', 'Building Number', 'Unit Code',
                    'Floor Number', 'Unit Type', 'Gross Area', 'Gross Area Price',
                    'Outdoor Area', 'Total Area', 'Availability', 'Discount Amount',
                    'Discount Percentage', 'Total Price'
                ];
                const headers = Object.keys(results.data[0] || {});
                const isValid = expectedHeaders.every(header => headers.includes(header));

                if (!isValid) {
                    alert('Invalid CSV format. Please ensure the file matches the required structure.');
                    $('#importFile').val('');
                    return;
                }

                csvData = results.data;

                const csv = Papa.unparse(csvData);
                $.ajax({
                    url: '/api/save-csv',
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({ csv: csv }),
                    success: function (response) {
                        if (response.success) {
                            renderCsvTable(csvData);
                        } else {
                            alert('Failed to save CSV on server: ' + (response.error || 'Unknown error'));
                        }
                    },
                    error: function () {
                        alert('Error communicating with server. CSV not saved.');
                    },
                    complete: function () {
                        $('#importFile').val(''); // Reset file input
                    }
                });
            },
            error: function (error) {
                console.error('Error parsing uploaded CSV:', error);
                alert('Failed to import CSV. Please ensure the file is valid.');
                $('#importFile').val('');
            }
        });
    });

    // Initial load of CSV
    loadCsv();
});