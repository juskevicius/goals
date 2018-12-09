//Add-form events:
//1. When clicked on overlay, hide the form 
setTimeout(
  () => {
    document.getElementsByClassName("r-overlay")[0].addEventListener('click', 
    () => {
      document.getElementsByClassName("r-overlay")[0].style.display = 'none';},
      true);
  },
  1000);
//2. When clicked on the form, don't hide it
setTimeout(
  () => {
    document.getElementsByClassName("form-add")[0].addEventListener('click', 
    () => {
      document.getElementsByClassName("r-overlay")[0].style.display = 'initial';
    });
  }, 
  1100);
//3. When clicked on the link, show the form
setTimeout(
  () => {
    document.getElementById("showAddForm").addEventListener('click', 
    () => {
      document.getElementsByClassName("r-overlay")[0].style.display = 'initial';
    });
  }, 
  1100);

//MyOwn-form events:
//1. When clicked on overlay, hide the form 
setTimeout(
  () => {
    document.getElementsByClassName("r-overlay")[1].addEventListener('click', 
    () => {
      document.getElementsByClassName("r-overlay")[1].style.display = 'none';},
      true);
  },
  1000);
//2. When clicked on the form, don't hide it
setTimeout(
  () => {
    document.getElementsByClassName("form-myOwn")[0].addEventListener('click', 
    () => {
      document.getElementsByClassName("r-overlay")[1].style.display = 'initial';
    });
  }, 
  1100);
//3. When clicked on the link, show the form
setTimeout(
  () => {
    document.getElementById("showMyOwnForm").addEventListener('click', 
    () => {
      document.getElementsByClassName("r-overlay")[1].style.display = 'initial';
    });
  }, 
  1100);



//Current-form events:
//1. When clicked on overlay, hide the form 
setTimeout(
  () => {
    document.getElementsByClassName("r-overlay")[2].addEventListener('click', 
    () => {
      document.getElementsByClassName("r-overlay")[2].style.display = 'none';},
      true);
  },
  1000);
//2. When clicked on the form, don't hide it
setTimeout(
  () => {
    document.getElementsByClassName("form-current")[0].addEventListener('click', 
    () => {
      document.getElementsByClassName("r-overlay")[2].style.display = 'initial';
    });
  }, 
  1100);
//3. When clicked on the link, show the form
setTimeout(
  () => {
    document.getElementsByClassName("middle-text")[0].addEventListener('click', 
    () => {
      document.getElementsByClassName("r-overlay")[2].style.display = 'initial';
    });
  }, 
  1100);

setTimeout(
  () => {
    document.getElementsByClassName("gauge-chart")[0].getElementsByTagName("text")[0].addEventListener('click', 
    () => {
      document.getElementsByClassName("r-overlay")[2].style.display = 'initial';
    });
  }, 
  1100);

setTimeout(
  () => {
    document.getElementsByClassName("gauge-chart")[0].getElementsByTagName("text")[1].addEventListener('click', 
    () => {
      document.getElementsByClassName("r-overlay")[2].style.display = 'initial';
    });
  }, 
  1100);

//Current-form. Set default date value
setTimeout( () => { document.getElementById('date-picker').valueAsDate = new Date(); }, 1000);
