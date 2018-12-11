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

//MyOwn-form events:
//1. When clicked on overlay, hide the form 
setTimeout(
  () => {
    for(let i = 0; i < document.getElementsByClassName("overlay2").length; i++) {
      let overlay = document.getElementsByClassName("overlay2")[i];
      overlay.addEventListener('click', 
      () => {
        overlay.style.display = 'none';},
        true);
      }
  },
  1000);
//2. When clicked on the form, don't hide it

setTimeout(
  () => {
    for(let i = 0; i < document.getElementsByClassName("overlay2").length; i++) {
      let form = document.getElementsByClassName("overlay2")[i].firstChild;
      form.addEventListener('click', 
      () => {
        form.parentElement.style.display = 'initial';
      });
    }
  }, 
  1100);

//3. When clicked on the link, show the form
setTimeout(
  () => {
    for(let i = 0; i < document.getElementsByClassName("triggerRemove").length; i++) {
      let trigger = document.getElementsByClassName("triggerRemove")[i];
      trigger.addEventListener('click', 
      () => {
        trigger.parentElement.parentElement.getElementsByClassName("form-remove-overlay")[0].style.display = 'initial';
      });
    }
    for(let i = 0; i < document.getElementsByClassName("triggerAccept").length; i++) {
      let trigger = document.getElementsByClassName("triggerAccept")[i];
      trigger.addEventListener('click', 
      () => {
        trigger.parentElement.parentElement.getElementsByClassName("form-acceptOffer-overlay")[0].style.display = 'initial';
      });
    }
    for(let i = 0; i < document.getElementsByClassName("triggerNegotiateOffered").length; i++) {
      let trigger = document.getElementsByClassName("triggerNegotiateOffered")[i];
      trigger.addEventListener('click', 
      () => {
        trigger.parentElement.parentElement.getElementsByClassName("form-negotiateOffered-overlay")[0].style.display = 'initial';
      });
    }
    for(let i = 0; i < document.getElementsByClassName("triggerNegotiateOwn").length; i++) {
      let trigger = document.getElementsByClassName("triggerNegotiateOwn")[i];
      trigger.addEventListener('click', 
      () => {
        trigger.parentElement.parentElement.getElementsByClassName("form-negotiateOwn-overlay")[0].style.display = 'initial';
      });
    }
    for(let i = 0; i < document.getElementsByClassName("triggerEdit").length; i++) {
      let trigger = document.getElementsByClassName("triggerEdit")[i];
      trigger.addEventListener('click', 
      () => {
        trigger.parentElement.parentElement.getElementsByClassName("form-edit-overlay")[0].style.display = 'initial';
      });
    }
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



