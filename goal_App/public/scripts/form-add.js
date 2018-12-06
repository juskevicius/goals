setTimeout(
  () => {
    document.getElementsByClassName("r-overlay")[0].addEventListener('click', 
    () => {
      document.getElementsByClassName("r-overlay")[0].style.display = 'none';},
      true);
  },
  1000);

setTimeout(
  () => {
    document.getElementsByClassName("form-add")[0].addEventListener('click', 
    () => {
      document.getElementsByClassName("r-overlay")[0].style.display = 'initial';
    });
  }, 
  1100);

setTimeout(
  () => {
    document.getElementById("showAddForm").addEventListener('click', 
    () => {
      document.getElementsByClassName("r-overlay")[0].style.display = 'initial';
    });
  }, 
  1100);
