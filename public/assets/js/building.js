$(document).ready(function () {

    const imageMap = {
        '1A': ['./assets/images/catalogue/1A/1.jpg', './assets/images/catalogue/1A/2.jpg'],
        '3A': ['./assets/images/catalogue/3A/1.jpg', './assets/images/catalogue/3A/2.jpg'],
        '1B': ['./assets/images/catalogue/1B/1.jpg', './assets/images/catalogue/1B/2.jpg'],
        'V1': ['./assets/images/catalogue/V1/1.jpg', './assets/images/catalogue/V1/2.jpg'],
        'V2': ['./assets/images/catalogue/V2/1.jpg', './assets/images/catalogue/V2/2.jpg'],
        'V3': ['./assets/images/catalogue/V3/1.jpg', './assets/images/catalogue/V3/2.jpg']
    };

    const statusColors = {
        'Available': 'bg-success',
        'Reserved': 'bg-warning',
        'Sold': 'bg-danger'
    };

    let currentFilters = {
        availability: 'all',
        floor: 'all'
    };

    const urlParams = new URLSearchParams(window.location.search);
    const level = urlParams.get('level') || '1A';

    function loadProperties() {
        Papa.parse("./assets/data/SolyVieDatabase.csv", {
            download: true,
            header: true,
            complete: function (results) {
                const properties = results.data.filter(property => property.Level === level);
                renderCarousel(properties);
                renderUnits(properties);
                applyFilters(properties);
            },
            error: function (error) {
                console.error("Error parsing CSV:", error);
                $('#unitContainer').html('<p class="text-white text-center">Error loading units.</p>');
            }
        });
    }
    



    function renderCarousel(properties) {
        const $carouselInner = $('#projectSlider .carousel-inner');
        $carouselInner.empty();

        const images = imageMap[level] || ['./assets/images/catalogue/1A/1.jpg', './assets/images/catalogue/1A/2.jpg'];
        images.forEach((img, index) => {
            const isActive = index === 0 ? 'active' : '';
            const carouselItem = `
                <div class="carousel-item ${isActive}">
                    <img src="${img}" class="d-block w-100" alt="Project ${index + 1}">
                </div>
            `;
            $carouselInner.append(carouselItem);
        });

        const $indicators = $('#projectSlider .carousel-indicators');
        $indicators.empty();
        images.forEach((_, index) => {
            const isActive = index === 0 ? 'active' : '';
            const indicator = `
                <button type="button" data-bs-target="#projectSlider" data-bs-slide-to="${index}" class="${isActive}" aria-label="Slide ${index + 1}"></button>
            `;
            $indicators.append(indicator);
        });
    }
    function applyFilters(properties) {
        let filteredProperties = properties;

        // Apply availability filter
        if (currentFilters.availability !== 'all') {
            filteredProperties = filteredProperties.filter(property => {
                // Mock status since CSV only has 'Available'
                const status = property.Availability || 'Available';
                return status === currentFilters.availability;
            });
        }

        // Apply floor filter
        if (currentFilters.floor !== 'all') {
            filteredProperties = filteredProperties.filter(property => property['Floor Number'] === currentFilters.floor);
        }

        renderUnits(filteredProperties);
    }

    function renderUnits(properties) {
        const $unitContainer = $('#unitContainer');
        $('#level').text(level);
        $unitContainer.empty();

        properties.forEach(property => {
            if (!property['Unit Code']) return;

            const status = property.Availability || 'Available'; 
            const statusClass = statusColors[status] || 'bg-success';

            const unitHtml = `
                <div class="col-6">
                    <a href="./view-unit.html?unit=${property['Unit Code']}" class="s-color d-flex flex-column align-items-center rounded-4 mt-5 mb-3 p-3">
                        <h3 class="text-center text-white">${property['Unit Code']}</h3>
                        <img src="${imageMap[level]?.[0] || './assets/images/catalogue/1A/1.jpg'}" class="img-fluid rounded-4 w-100 mb-3" alt="${property['Unit Code']}">
                        <span class="rounded-pill text-center ${statusClass} d-inline-block mx-1" style="width: 30px; height: 7px;"></span>
                    </a>
                </div>
            `;
            $unitContainer.append(unitHtml);
        });

        if (properties.length === 0) {
            $unitContainer.html('<p class="text-white text-center">No units available for this level.</p>');
        }
    }

    window.filterUnits = function(type, value) {
        currentFilters[type] = value;
        loadProperties(); 
    };

    loadProperties();
});