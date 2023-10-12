// Animation for the homepage
setTimeout(() => {
  body.style.backgroundPosition = "left";
  body.style.transition = "all 2s linear";
  body.style.opacity = "0";
  startscreen.style.display = "none";
  setTimeout(() => {
    body.style.opacity = "1";
    login.style.display = "flex";
  }, 2500);
}, 500);
