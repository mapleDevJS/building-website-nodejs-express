const pixGrid = (function () {
  function centerImage(theImage) {
    const diffX = (window.innerWidth - theImage.width) / 2;
    const diffY = (window.innerHeight - theImage.height) / 2;
    theImage.style.top = `${diffY}px`;
    theImage.style.left = `${diffX}px`;
    return theImage;
  }

  function createOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'overlay';
    overlay.style.position = 'absolute';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.7)';
    overlay.style.cursor = 'pointer';
    overlay.style.width = `${window.innerWidth}px`;
    overlay.style.height = `${window.innerHeight}px`;
    overlay.style.top = `${window.pageYOffset}px`;
    overlay.style.left = `${window.pageXOffset}px`;
    document.body.appendChild(overlay);
    return overlay;
  }

  function handleImageLoad(largeImage, overlay) {
    if (largeImage.height > window.innerHeight) {
      const ratio = window.innerHeight / largeImage.height;
      largeImage.height *= ratio;
      largeImage.width *= ratio;
    }
    if (largeImage.width > window.innerWidth) {
      const ratio = window.innerWidth / largeImage.width;
      largeImage.height *= ratio;
      largeImage.width *= ratio;
    }
    centerImage(largeImage);
    overlay.appendChild(largeImage);
  }

  function onImageClick(e) {
    if (e.target.tagName === 'IMG') {
      const overlay = createOverlay();
      const imageSrc = e.target.src;
      const largeImage = document.createElement('img');
      largeImage.id = 'largeImage';
      largeImage.src = `${imageSrc.substr(0, imageSrc.length - 7)}.jpg`;
      largeImage.style.display = 'block';
      largeImage.style.position = 'absolute';
      largeImage.addEventListener('load', () => handleImageLoad(largeImage, overlay));
      largeImage.addEventListener('click', () => {
        document.body.removeChild(overlay);
      });

      // Event listeners for scroll and resize.
      window.addEventListener('scroll', () => {
        overlay.style.top = `${window.pageYOffset}px`;
        overlay.style.left = `${window.pageXOffset}px`;
      });
      window.addEventListener('resize', () => {
        overlay.style.width = `${window.innerWidth}px`;
        overlay.style.height = `${window.innerHeight}px`;
        overlay.style.top = `${window.pageYOffset}px`;
        overlay.style.left = `${window.pageXOffset}px`;
        centerImage(largeImage);
      });
    }
  }

  const gridNode = document.querySelector('.pixgrid');
  gridNode.addEventListener('click', onImageClick, false);
})();
