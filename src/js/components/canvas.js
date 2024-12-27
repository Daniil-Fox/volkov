const canvas = document.getElementById("canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  const imageSources = [
    "./../img/animation/01.webp",
    "./../img/animation/02.webp",
    "./../img/animation/03.webp",
    "./../img/animation/04.webp",
    "./../img/animation/05.webp",
    "./../img/animation/06.webp",
  ];
  let currentImageIndex = 0;
  let lastImageTime = 0;
  let lastX = 0;
  let lastY = 0;
  const images = [];
  const interval = 60;
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  window.addEventListener("resize", (e) => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  });
  const loadImage = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(img);
    });
  };

  const drawImages = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    images.forEach((image) => {
      ctx.globalAlpha = image.opacity;
      ctx.drawImage(image.img, image.x, image.y, image.width, image.height);
    });
  };

  let lastTime = Date.now();
  const updateImages = () => {
    let updateTime = Date.now();
    lastTime = Date.now();
    images.forEach((image, index) => {
      // image.opacity -= 0.01;
      if (image.opacity <= 0) {
        images.splice(images.indexOf(image), 1);
      } else {
        // Smoothly move towards the cursor with a delay based on the index
        const delayFactor = 0.04 - index * 0.003;
        image.x += (image.targetX - image.x - 100) * delayFactor;
        image.y += (image.targetY - image.y - 100) * delayFactor;
      }
    });
    drawImages();
    requestAnimationFrame(updateImages);
  };

  document.addEventListener("mousemove", async (event) => {
    const now = Date.now();
    const x = event.clientX - 20;
    const y = event.clientY - 20;

    if (Math.abs(x - lastX) < interval && Math.abs(y - lastY) < interval)
      return; // Check if cursor moved at least 40px
    if (now - lastImageTime < 50) return; // Delay of 50ms
    const img = await loadImage(imageSources[currentImageIndex]);
    const newImage = {
      img,
      x,
      y,
      targetX: x - 20,
      targetY: y - 20,
      width: 0,
      height: 0,
      opacity: 1,
    };
    images.push(newImage);

    const growAnimation = () => {
      if (newImage.width < 140 && newImage.height < 90) {
        newImage.width += 3; // Increase width
        newImage.height += 1.5; // Increase height
        requestAnimationFrame(growAnimation);
      }
    };
    growAnimation();

    currentImageIndex = (currentImageIndex + 1) % imageSources.length;
    lastImageTime = now;
    lastX = x;
    lastY = y;

    document.addEventListener("mousemove", (e) => {
      newImage.targetX = e.clientX;
      newImage.targetY = e.clientY;
    });

    // Start fade-out after 100ms
    setTimeout(() => {
      const fadeOutAnimation = () => {
        if (newImage.opacity > 0) {
          newImage.opacity -= 0.05;
          requestAnimationFrame(fadeOutAnimation);
        } else {
          // Remove image from canvas
          setTimeout(() => {
            ctx.clearRect(
              newImage.x,
              newImage.y,
              newImage.width,
              newImage.height
            );
          }, 100);
        }
      };
      fadeOutAnimation();
    }, 300); // Delay before starting fade-out
  });

  updateImages();
}
