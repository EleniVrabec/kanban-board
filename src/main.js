// Import the Firebase functions from the SDKs
import { getAuth, onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyBySBvnT0IhFUE9jJi7Mb8j5Hk3eMlMAaw",
  authDomain: "sticky-notes-fe-flex.firebaseapp.com",
  projectId: "sticky-notes-fe-flex",
  storageBucket: "sticky-notes-fe-flex.appspot.com",
  messagingSenderId: "255948648370",
  appId: "1:255948648370:web:23c9d73fee6d68bda23eab"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  const authForm = document.getElementById("authForm");
  const kanbanBoard = document.getElementById("kanbanBoard");

  // Handle authentication state changes
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is logged in, show the Kanban board and hide the login form
      authForm.style.display = "none";
      kanbanBoard.style.display = "block";
      displayNotes();
    } else {
      // User is not logged in, show the login form and hide the Kanban board
      authForm.style.display = "block";
      kanbanBoard.style.display = "none";
    }
  });

  // Handle form submission for login
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          // Firebase will trigger the onAuthStateChanged listener
        })
        .catch((error) => {
          alert("Login failed: " + error.message);
        });
    });
  }

  // Handle sign-up button click
  const signUpButton = document.getElementById("signup-btn");
  if (signUpButton) {
    signUpButton.addEventListener("click", () => {
      const email = prompt("Enter email:");
      const password = prompt("Enter password:");

      if (!email || !password) {
        alert("Email and password cannot be empty!");
        return;
      }

      createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          // Firebase will trigger the onAuthStateChanged listener
        })
        .catch((error) => {
          alert("Signup failed: " + error.message);
        });
    });
  }

  // Logout button logic
  const logoutButton = document.getElementById("logoutBtn");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      signOut(auth).then(() => {
        // Firebase will trigger the onAuthStateChanged listener
      }).catch((error) => {
        console.error("Error signing out:", error);
      });
    });
  }

  // Event listener to add a note when the button is clicked
  const addNoteButton = document.getElementById("addNoteBtn");
  if (addNoteButton) {
    addNoteButton.addEventListener("click", async (event) => {
      event.preventDefault();

      const noteInput = document.getElementById("noteInput").value;
      const personInput = document.getElementById("personInput").value;
      const colorInput = document.getElementById("colorInput").value;
      const statusInput = document.getElementById("statusInput").value;

      if (noteInput.trim() !== "" && personInput.trim() !== "" && colorInput.trim() !== "") {
        await addNote(noteInput, personInput, colorInput, statusInput);
        await displayNotes();
        document.getElementById("noteInput").value = ""; // Clear the input fields
        document.getElementById("personInput").value = "";
      } else {
        alert("Please enter a note and assign it to someone!");
      }
    });
  }

  // Function to add a note to Firestore
  async function addNote(noteContent, person, color, status) {
    try {
      const docRef = await addDoc(collection(db, "notes"), {
        content: noteContent,
        person: person,
        color: color,
        status: status,
        timestamp: new Date()
      });
      console.log("Note added with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding note: ", e);
    }
  }
/* ------------------------------------------------------------------------------------ */
  // Function to display notes on the page
  async function displayNotes() {
    console.log("Displaying notes...");
    const toDoList = document.getElementById("toDoList");
    const inProgressList = document.getElementById("inProgressList");
    const doneList = document.getElementById("doneList");

    // Clear the lists before adding notes
    toDoList.innerHTML = '';
    inProgressList.innerHTML = '';
    doneList.innerHTML = '';

    const querySnapshot = await getDocs(collection(db, "notes"));
    querySnapshot.forEach((doc) => {
      const note = doc.data();
      console.log("Creating note: ", note.content);
      const li = document.createElement("li");
      li.textContent = `${note.content}  -  Assigned to: ${note.person}`;
      li.style.backgroundColor = note.color || "#ffffff";
      li.dataset.id = doc.id;
      li.draggable = true; 

       // Add drag-and-drop functionality to each note
      li.addEventListener("dragstart", handleDragStart);
      li.addEventListener("dragend", handleDragEnd);

      // Add delete button
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.classList.add("delete-btn");
      deleteBtn.addEventListener("click", () => deleteNote(doc.id));
      li.appendChild(deleteBtn);

      // Append the note to the correct column based on its status
      switch (note.status) {
        case "To Do":
          toDoList.appendChild(li);
          break;
        case "In Progress":
          inProgressList.appendChild(li);
          break;
        case "Done":
          doneList.appendChild(li);
          break;
      }
    });

    // Add drag-and-drop functionality to the columns
    addDropListeners(toDoList);
    addDropListeners(inProgressList);
    addDropListeners(doneList);
  }

  // Function to delete a note from Firestore
  async function deleteNote(id) {
    try {
      await deleteDoc(doc(db, "notes", id));
      console.log("Note deleted with ID: ", id);
      displayNotes(); // Refresh the notes after deletion
    } catch (e) {
      console.error("Error deleting note: ", e);
    }
  }

  // Add drag-and-drop functionality to columns
  function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.dataset.id);
    event.target.style.opacity = "0.5";
    console.log(`Dragging note with ID: ${event.target.dataset.id}`);
  }

  function handleDragEnd(event) {
    event.target.style.opacity = "1";
    console.log(`Finished dragging note with ID: ${event.target.dataset.id}`);
  }

  function addDropListeners(column) {
    column.addEventListener('dragover', (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
      console.log(`Dragging over column: ${column.id}`);
    });

    column.addEventListener('drop', async (event) => {
      event.preventDefault();
      const id = event.dataTransfer.getData('text/plain');
      const newStatus = column.querySelector('h2').textContent;
      console.log(`Dropped note with ID: ${id} into column: ${newStatus}`);
      await updateNoteStatus(id, newStatus);
      displayNotes(); // Refresh the display after moving the note
    });
  }

  // Function to update the status of a note in Firestore
  async function updateNoteStatus(id, newStatus) {
    try {
      const noteRef = doc(db, "notes", id);
      await updateDoc(noteRef, { status: newStatus });
      console.log(`Note with ID: ${id} updated to status: ${newStatus}`);
    } catch (e) {
      console.error("Error updating status: ", e);
    }
  }
});
