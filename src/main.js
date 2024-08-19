
// Import the functions  from the SDKs 
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore"; 
import { once } from "process";


// https://firebase.google.com/docs/web/setup#available-libraries

// Firebase configuration
const firebaseConfig = {
    
  apiKey: "AIzaSyBySBvnT0IhFUE9jJi7Mb8j5Hk3eMlMAaw",
  authDomain: "sticky-notes-fe-flex.firebaseapp.com",
  projectId: "sticky-notes-fe-flex",
  storageBucket: "sticky-notes-fe-flex.appspot.com",
  messagingSenderId: "255948648370",
  appId: "1:255948648370:web:23c9d73fee6d68bda23eab"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize db
 const db = getFirestore(app); 
/* --------------------------------------------------------------------- */


// Event listener to add a note when the button is clicked
document.getElementById("addNoteBtn").addEventListener("click", async () => {
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

// Function to add a note to Firestore
async function addNote(noteContent, person, color, status) {
    try {
        console.log("Color Input:", colorInput);

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

// Function to display notes on the page
async function displayNotes() {
    const toDoList = document.getElementById("toDoList");
    const inProgressList = document.getElementById("inProgressList");
    const doneList = document.getElementById("doneList");
    
    toDoList.innerHTML = ''; // Clear the lists before adding notes
    inProgressList.innerHTML = '';
    doneList.innerHTML = '';

    const querySnapshot = await getDocs(collection(db, "notes"));
    querySnapshot.forEach((doc) => {
        const note = doc.data();
        const li = document.createElement("li");
        li.textContent = `${note.content}  -  Assigned to: ${note.person}`;
        li.style.backgroundColor = note.color || "#ffffff";
        li.dataset.id = doc.id;

        // Add delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", () => deleteNote(doc.id));
        li.appendChild(deleteBtn);

        // Add event listeners for dragging and status change
        li.draggable = true;
        li.addEventListener('dragstart', handleDragStart);
        li.addEventListener('dragend', handleDragEnd);

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
    // Add dragover and drop event listeners to the columns
    addDropListeners(toDoList);
    addDropListeners(inProgressList);
    addDropListeners(doneList);
}
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
    });

    column.addEventListener('drop', async (event) => {
        event.preventDefault();
          // Stop the event from bubbling further
        event.stopPropagation();
        const id = event.dataTransfer.getData('text/plain');
        const newStatus = column.parentElement.querySelector('h2').textContent;
        console.log(`Dropped note with ID: ${id} into column: ${newStatus}`);
        await updateNoteStatus(id, newStatus);
         // Refresh the display after moving the note
         displayNotes();
    },{once: true });
}
async function updateNoteStatus(id, newStatus) {
    try {
        const noteRef = doc(db, "notes", id);
        await updateDoc(noteRef, {
            status: newStatus
        });
        console.log(`Note with ID: ${id} updated to status: ${newStatus}`);
       /*  displayNotes();  */// Refresh the notes after updating status
    } catch (e) {
        console.error("Error updating status: ", e);
    }
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



// Display notes when the page loads
displayNotes();
