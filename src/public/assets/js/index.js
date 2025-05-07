function changeImage(src) {
    document.getElementById('mainImage').style.backgroundImage = `url('${src}')`;
  }

  function enterFullscreen() {
    const elem = document.getElementById('mainImage');
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { 
      elem.msRequestFullscreen();
    }
  }