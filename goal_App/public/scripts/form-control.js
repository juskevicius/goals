//Add-form events:
//1. When clicked on overlay, hide the form 

for(let i = 0; i < document.getElementsByClassName("r-overlay").length; i++) {
  let overlay = document.getElementsByClassName("r-overlay")[i];
  overlay.addEventListener('click', 
  () => {
    overlay.style.display = 'none';},
    true);
  }

for(let i = 0; i < document.getElementsByClassName("overlay2").length; i++) {
  let overlay = document.getElementsByClassName("overlay2")[i];
  overlay.addEventListener('click', 
  () => {
    overlay.style.display = 'none';},
    true);
  }

//2. When clicked on the form, don't hide it

for(let i = 0; i < document.getElementsByClassName("r-overlay").length; i++) {
  let form = document.getElementsByClassName("r-overlay")[i].firstChild;
  form.addEventListener('click', 
  () => {
    form.parentElement.style.display = 'initial';
  });
}

for(let i = 0; i < document.getElementsByClassName("overlay2").length; i++) {
  let form = document.getElementsByClassName("overlay2")[i].firstChild;
  form.addEventListener('click', 
  () => {
    form.parentElement.style.display = 'initial';
  });
}

//3. When clicked on the link, show the form

/*
document.getElementById("showAddForm").addEventListener('click', 
() => {
  document.getElementsByClassName("form-add-overlay")[0].style.display = 'initial';
});

document.getElementById("showMyOwnForm").addEventListener('click', 
() => {
  document.getElementsByClassName("form-myOwn-overlay")[0].style.display = 'initial';
});

document.getElementById("showOthersForm").addEventListener('click', 
() => {
  document.getElementsByClassName("form-others-overlay")[0].style.display = 'initial';
});*/

setTimeout(
  () => {
    if (document.getElementsByClassName("middle-text")[0]) {
      
      document.getElementsByClassName("middle-text")[0].addEventListener('click', 
      () => {
      document.getElementsByClassName("form-current-overlay")[0].style.display = 'initial';
      });

      document.getElementsByClassName("gauge-chart")[0].getElementsByTagName("text")[0].addEventListener('click', 
      () => {
        document.getElementsByClassName("form-current-overlay")[0].style.display = 'initial';
      });

      document.getElementsByClassName("gauge-chart")[0].getElementsByTagName("text")[1].addEventListener('click', 
      () => {
        document.getElementsByClassName("form-current-overlay")[0].style.display = 'initial';
      });

    }
  }, 
1000);

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
for(let i = 0; i < document.getElementsByClassName("triggerOfferTo").length; i++) {
  let trigger = document.getElementsByClassName("triggerOfferTo")[i];
  trigger.addEventListener('click', 
  () => {
    trigger.parentElement.parentElement.getElementsByClassName("form-offerTo-overlay")[0].style.display = 'initial';
  });
}
for(let i = 0; i < document.getElementsByClassName("triggerReject").length; i++) {
  let trigger = document.getElementsByClassName("triggerReject")[i];
  trigger.addEventListener('click', 
  () => {
    trigger.parentElement.parentElement.getElementsByClassName("form-reject-overlay")[0].style.display = 'initial';
  });
}
for(let i = 0; i < document.getElementsByClassName("triggerApprove").length; i++) {
  let trigger = document.getElementsByClassName("triggerApprove")[i];
  trigger.addEventListener('click', 
  () => {
    trigger.parentElement.parentElement.getElementsByClassName("form-approve-overlay")[0].style.display = 'initial';
  });
}
for(let i = 0; i < document.getElementsByClassName("triggerNegotiateMyOffered").length; i++) {
  let trigger = document.getElementsByClassName("triggerNegotiateMyOffered")[i];
  trigger.addEventListener('click', 
  () => {
    trigger.parentElement.parentElement.getElementsByClassName("form-negotiateMyOffered-overlay")[0].style.display = 'initial';
  });
}
for(let i = 0; i < document.getElementsByClassName("triggerNegotiateTheirOwn").length; i++) {
  let trigger = document.getElementsByClassName("triggerNegotiateTheirOwn")[i];
  trigger.addEventListener('click', 
  () => {
    trigger.parentElement.parentElement.getElementsByClassName("form-negotiateTheirOwn-overlay")[0].style.display = 'initial';
  });
}

/* Handle the Select element behaviour in Offer to.. form */

for(let i = 0; i < document.getElementsByClassName("offer-unit").length; i++) {
  document.getElementsByClassName("offer-unit")[i].addEventListener('change', addOfferElm, true);
}

function addOfferElm(ev) {
  let lastOfferElmNode = ev.currentTarget.parentElement.parentElement.childNodes.length - 2;
  if (ev.currentTarget.parentElement == ev.currentTarget.parentElement.parentElement.childNodes[lastOfferElmNode]) {
    let offerToElm = ev.currentTarget.parentElement.parentElement.firstChild.cloneNode(true);
    let nr = lastOfferElmNode;
    offerToElm.getElementsByTagName("select")[0].setAttribute("name", "owner[" + (nr + 1) + "]");
    offerToElm.getElementsByTagName("select")[0].setAttribute("onchange", "addOfferElm(event)");
    offerToElm.getElementsByTagName("input")[0].setAttribute("name", "weight[" + (nr + 1) + "]");
    offerToElm.getElementsByTagName("input")[1].setAttribute("name", "oInitScore[" + (nr + 1) + "]");
    offerToElm.getElementsByTagName("input")[2].setAttribute("name", "oTargScore[" + (nr + 1) + "]");
    offerToElm.getElementsByTagName("input")[3].setAttribute("name", "oComment[" + (nr + 1) + "]");
    offerToElm.getElementsByTagName("input")[4].setAttribute("name", "childTo[" + (nr + 1) + "]");
    offerToElm.getElementsByTagName("input")[5].setAttribute("name", "name[" + (nr + 1) + "]");
    let tasks = offerToElm.getElementsByClassName("task-row");
    for (let i = 0; i < tasks.length; i++) {
      let currDescrName = tasks[i].getElementsByTagName("input")[0].getAttribute("name");
      let newDescrName = currDescrName .replace("task", "task[" + (nr + 1) + "]");
      tasks[i].getElementsByTagName("input")[0].setAttribute("name", newDescrName);
      let currWeightName = tasks[i].getElementsByTagName("input")[1].getAttribute("name");
      let newWeightName = currWeightName.replace("task", "task[" + (nr + 1) + "]");
      tasks[i].getElementsByTagName("input")[1].setAttribute("name", newWeightName);
    }
    let makeOfferButton = ev.currentTarget.parentElement.parentElement.lastChild;
    ev.currentTarget.parentElement.parentElement.insertBefore(offerToElm, makeOfferButton);
  }
}

//Current-form. Set default date value
if (document.getElementById('date-picker')) {
  document.getElementById('date-picker').valueAsDate = new Date();
}

// Add a goal form. If clicked on "Add tasks", show task fields
document.getElementById("triggerAddTasks").addEventListener('click', 
  () => { document.getElementsByClassName("task-group")[0].style.display = 'initial'; }
);

let taskElements = document.getElementsByClassName("task-input-descr");
for (let i = 0; i < taskElements.length; i++) {
  taskElements[i].setAttribute('oninput', 'addTaskElements(event)');
}

//When a new task is being entered, add more input fields for new tasks to enter 
function addTaskElements(ev) {
  let lastTask = ev.currentTarget.parentElement.parentElement.parentElement.childNodes.length - 2;
  if (ev.currentTarget.parentElement.parentElement == ev.currentTarget.parentElement.parentElement.parentElement.childNodes[lastTask]) {
    let nr = lastTask + 1;
    let taskElement = ev.currentTarget.parentElement.parentElement.parentElement.firstChild.cloneNode(true);
    taskElement.getElementsByTagName("label")[0].innerHTML = "Task nr " + (nr + 1) + ":";
    taskElement.getElementsByTagName("input")[0].value = '';
    
    let currDescrName = ev.currentTarget.getAttribute('name');
    let newDescrName = currDescrName.replace("][" + (nr - 1) + "][", "][" + nr + "][");
    if (newDescrName !== currDescrName) {
      taskElement.getElementsByTagName("input")[0].setAttribute('name', newDescrName);
    } else {
      taskElement.getElementsByTagName("input")[0].setAttribute('name', 'task[' + nr + '][description]');
    }
    
    taskElement.getElementsByTagName("input")[0].setAttribute('oninput', 'addTaskElements(event)');
    taskElement.getElementsByTagName("input")[1].value = '';
    
    let currWeightName = ev.currentTarget.parentElement.getElementsByTagName("input")[1].getAttribute('name');
    let newWeightName = currWeightName.replace("][" + (nr - 1) + "][", "][" + nr + "][");
    if (newWeightName !== currWeightName) {
      taskElement.getElementsByTagName("input")[1].setAttribute('name', newWeightName);
    } else {
      taskElement.getElementsByTagName("input")[1].setAttribute('name', 'task[' + nr + '][weight]');
    }
    
    let lastTaskRow = ev.currentTarget.parentElement.parentElement.parentElement.lastChild;
    ev.currentTarget.parentElement.parentElement.parentElement.insertBefore(taskElement, lastTaskRow);
  }
}
