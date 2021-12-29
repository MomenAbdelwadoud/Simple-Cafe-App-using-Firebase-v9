import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  where,
  query,
  orderBy,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const app = initializeApp({
  apiKey: "AIzaSyDPGZgz-7ZWNLTgDrMIC_GhL2YuPaKFtxs",
  authDomain: "cafe-82a09.firebaseapp.com",
  projectId: "cafe-82a09",
  storageBucket: "cafe-82a09.appspot.com",
  messagingSenderId: "414090219456",
  appId: "1:414090219456:web:4957db696305b2f4130225",
});

// View list
const cafeList = document.querySelector("#cafe-list");
function renderCafe(record) {
  let li = document.createElement("li");
  let name = document.createElement("span");
  let city = document.createElement("span");
  let cross = document.createElement("div");

  li.setAttribute("data-id", record.id);
  name.textContent = record.data().name;
  city.textContent = record.data().city;
  cross.textContent = "X";

  li.appendChild(name);
  li.appendChild(city);
  li.appendChild(cross);

  //   Delete data
  cross.addEventListener("click", (e) => {
    let current = e.target.parentElement.getAttribute("data-id");
    deleteDoc(doc(db, "cafes", current));
  });

  cafeList.appendChild(li);
}

const db = getFirestore(app);

// Get All Docs:
// const getting = await getDocs(collection(db, "cafes"));
// getting.forEach((doc) => {
//   console.log(doc);
//   renderCafe(doc);
// });

// Query selector:
// const q = await getDocs(
//   query(
//     collection(db, "cafes"),
//     where("city", "==", "Khartoum"),
//     orderBy("name")
//   )
// );
// q.forEach((cafe) => {
//   renderCafe(cafe);
// });

// Live changes:
const q = query(collection(db, "cafes"), orderBy("name"));
const unsub = onSnapshot(q, (snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type == "added") {
      renderCafe(change.doc);
    } else {
      let li = cafeList.querySelector("[data-id=" + change.doc.id + "]");
      cafeList.removeChild(li);
    }
  });
});

// Add Docs:
const form = document.getElementById("add-cafe-form");

form.addEventListener("submit", (e) => {
  try {
    e.preventDefault();
    const docref = addDoc(collection(db, "cafes"), {
      name: form.name.value,
      city: form.city.value,
    });
    // console.log(docref.id);
    form.name.value = "";
    form.city.value = "";
  } catch (error) {
    console.log(error);
  }
});
