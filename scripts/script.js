import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  set,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://we-are-the-champions-79de6-default-rtdb.firebaseio.com/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const endorcementsInDB = ref(database, "endorcements");

const endorcementTextarea = document.getElementById("endorcement-textarea");
const fromBtn = document.getElementById("from-input");
const toBtn = document.getElementById("to-input");
const publishBtn = document.getElementById("publish-btn");
const endorcementContainer = document.getElementById("endorcement-container");

let endorcementArr = [];
let endorcementLikedID = JSON.parse(localStorage.getItem("likedID"));

if (!endorcementLikedID) {
  endorcementLikedID = [];
}

publishBtn.addEventListener("click", function () {
  if (
    endorcementTextarea.value != 0 &&
    fromBtn.value != 0 &&
    toBtn.value != 0
  ) {
    const endorcementObj = {
      endorcementText: endorcementTextarea.value,
      fromText: fromBtn.value,
      toText: toBtn.value,
      likes: 0,
    };
    console.log(endorcementTextarea.value);
    push(endorcementsInDB, endorcementObj);
  }
});

onValue(endorcementsInDB, function (snapshot) {
  if (snapshot.exists()) {
    endorcementArr = Object.entries(snapshot.val());
    clearEndorcementContainer();
    refreshEndorcementContainer();
  }
});

function refreshEndorcementContainer() {
  for (let i = 0; i < endorcementArr.length; i++) {
    let currentEndorcement = endorcementArr[i];
    appendToEndorcementContainer(currentEndorcement);
  }
}

function clearEndorcementContainer() {
  endorcementContainer.innerHTML = "";
}

function appendToEndorcementContainer(endorcementArr) {
  const endorcementID = endorcementArr[0];
  const endorcementObj = endorcementArr[1];

  let newDiv = document.createElement("div");
  let footerDiv = document.createElement("div");
  let toH4 = document.createElement("h4");
  let endorcementP = document.createElement("p");
  let fromH4 = document.createElement("h4");
  let likeH4 = document.createElement("h4");

  newDiv.addEventListener("click", function () {
    if (endorcementLikedID.indexOf(endorcementID) === -1) {
      let likes = Number(endorcementObj.likes);
      likes++;
      set(ref(database, `endorcements/${endorcementID}/likes`), likes).then(
        () => {
          console.log("likes updated");
        }
      );
      endorcementLikedID.push(endorcementID);
      localStorage.setItem("liked", JSON.stringify(endorcementLikedID));
      clearEndorcementContainer();
      refreshEndorcementContainer();
      console.log("liked!");
    } else {
      console.log("already liked");
    }
  });

  toH4.textContent = endorcementObj.toText;
  endorcementP.textContent = endorcementObj.endorcementText;
  fromH4.textContent = endorcementObj.fromText;
  likeH4.textContent = `♥ ${endorcementObj.likes}`;

  footerDiv.append(fromH4, likeH4);
  newDiv.append(toH4, endorcementP, footerDiv);
  newDiv.className = "endorcement-box";
  endorcementContainer.append(newDiv);
}
