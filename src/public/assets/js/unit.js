$(document).ready(function () {

    // const imageMap = {
    //     '1A': ['./assets/images/catalogue/1A/1.jpg', './assets/images/catalogue/1A/2.jpg'],
    //     '3A': ['./assets/images/catalogue/3A/1.jpg', './assets/images/catalogue/3A/2.jpg'],
    //     '1B': ['./assets/images/catalogue/1B/1.jpg', './assets/images/catalogue/1B/2.jpg'],
    //     'V1': ['./assets/images/catalogue/V1/1.jpg', './assets/images/catalogue/V1/2.jpg'],
    //     'V2': ['./assets/images/catalogue/V2/1.jpg', './assets/images/catalogue/V2/2.jpg'],
    //     'V3': ['./assets/images/catalogue/V3/1.jpg', './assets/images/catalogue/V3/2.jpg']
    // };

    // const statusColors = {
    //     'Available': 'bg-success',
    //     'Reserved': 'bg-warning',
    //     'Sold': 'bg-danger'
    // };

    // let currentFilters = {
    //     availability: 'all',
    //     floor: 'all'
    // };

    const urlParams = new URLSearchParams(window.location.search);
    const unitCode = urlParams.get('unit') || '17A04';
    const level = urlParams.get('level') || '';
    const floor = urlParams.get('floor') || '';



    function getUnitType(){
        Papa.parse('./assets/data/SolyVieTypes.csv', {
            download: true,
            header: true,
            complete: function (results) {
                // const path = floor == 'Floor' ? 'G' + level : level;
                
                const unit = results.data.find(row => row['Unit Code'] === level);

                if (!unit) {
                    $('#errorMessage').text(`Unit ${unitCode} not found in CSV.`);
                    return;
                }
                const typeCode = unit['Type Code'] ? 'G' + unit['Type Code'] : unit['Type Code'];


                const planImagePath = `/assets/images/catalogue/${level}/${typeCode}.jpg`; 
                $('#planImage').attr('src', planImagePath).on('error', () => {
                    // $('#planImage').attr('src', '/assets/images/catalogue/1A/1.jpg'); 
                });
                $('#bedrooms').text(unit['BEDROOM'] || '0');
                $('#bathrooms').text(unit['BATHROOM'] || '0');
                // $('#unitName').text(unitType);
            },
            error: function (error) {
                console.error('Error loading CSV:', error);
                $('#errorMessage').text('Error loading unit data. Please try again later.');
            }
        });
    }
    getUnitType();

    function loadUnitData() {
        Papa.parse('./assets/data/SolyVieDatabase.csv', {
            download: true,
            header: true,
            complete: function (results) {
                const unit = results.data.find(row => row['Unit Code'] === unitCode);
                if (!unit) {
                    $('#errorMessage').text(`Unit ${unitCode} not found in CSV.`);
                    return;
                }

                // Update unit details
                $('#unitName').text(unit['Unit Type'] || 'GUSTO');
                $('#unitCode').text(`#${unit['Building Number'] || '01'} : ${unit['Floor Number'] || '2'} : ${unit['Row Number'] || '4'}`);
                $('#availabilityBtn').text(unit['Availability'] || 'AVAILABLE').toggleClass('bg-success', unit['Availability'] === 'Available').toggleClass('bg-danger', unit['Availability'] !== 'Available');
                $('#grossArea').text(`${unit['Gross Area'] || '0'} m²`);
                $('#totalArea').text(`${unit['Total Area'] || '0'} m²`);
                $('#totalPrice').text(`${parseInt(unit['Total Price'] || '0').toLocaleString()} EGP`);
                $('#priceContainer').toggleClass('bg-success', unit['Availability'] === 'Available').toggleClass('bg-danger', unit['Availability'] !== 'Available');

                const unitType = unit['Unit Type']?.toLowerCase() || '';
                // const unitInfo = bedroomBathroomMap[unitType] || { bedrooms: 5, bathrooms: 5 };

                const level = unit['Level'] || '1A';
                

                const carouselImages = [
                    `/assets/images/catalogue/${level}/preview (1).jpg`,
                    `/assets/images/catalogue/${level}/preview (2).jpg`
                ];
                $('.carousel-inner').empty();
                carouselImages.forEach((imgSrc, index) => {
                    const isActive = index === 0 ? 'active' : '';
                    $('.carousel-inner').append(`
                        <div class="carousel-item ${isActive}">
                            <img src="${imgSrc}" class="d-block w-100" alt="Project ${index + 1}">
                        </div>
                    `);
                });
            },
            error: function (error) {
                console.error('Error loading CSV:', error);
                $('#errorMessage').text('Error loading unit data. Please try again later.');
            }
        });
    }

    $('.plan-container').click(function () {
        const src = $('#planImage').attr('src');
        $('#overlayImage').attr('src', src);
        $('#fullScreenOverlay').show();
    });
    $('#fullScreenOverlay button').click(function () {
        $('#fullScreenOverlay').hide();
    });

    loadUnitData();

});