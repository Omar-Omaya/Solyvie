
$(document).ready(function () {
    $.getJSON('./assets/data/images.json', function (data) {
      if (data.images && data.images.length > 0) {
        $('#mainImage').css('background-image', `url('${data.images[0]}')`);
      }

      const $thumbs = $('.thumbnails');

      data.images.forEach(img => {
        const thumb = $(`
          <div class="thumbnail" style="background-image: url('${img}');"></div>
        `);
        thumb.on('click', function () {
          $('#mainImage').css('background-image', `url('${img}')`);
        });
        $thumbs.append(thumb);
      });
    });
});