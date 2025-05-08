$(document).ready(function () {
    // Function to load and parse CSV
    function loadProperties() {
        Papa.parse("./assets/data/SolyVieDatabase.csv", {
            download: true,
            header: true,
            complete: function (results) {
                const properties = results.data;
                renderProperties(properties);
            },
            error: function (error) {
                console.error("Error parsing CSV:", error);
            }
        });
    }

    function renderProperties(properties) {
        const $store = $("#store");
        $store.empty(); 
        const uniqueLevels = [...new Set(properties.map(property => property.Level))].sort();

        uniqueLevels.forEach(property => {
            
            if (!property) return;
            let image = 2;


            if (property[0].toLowerCase() === 'v'){
                image = 3;
            }

            
            const cardHtml = `
            <a href="./building.html?level=${property}" class="col-3">
                <div class="s-color hover-overlay rounded-4 mt-5 p-3">
                    <h3 class="text-center text-white">${property}</h3>
                    <img src="./assets/images/catalogue/${property}/preview (${image}).jpg" class="img-fluid rounded-4 w-100 mb-3" alt="${property}">
                </div>
            </a>
        `;
            
            $store.append(cardHtml);
        });
    }

    // Load properties when page is ready
    loadProperties();
});