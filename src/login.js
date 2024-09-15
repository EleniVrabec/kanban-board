import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseConfig } from "./main.js";

// Initialize Firebase and Auth
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // Initialize auth here

// Wait for DOM content to load before attaching event listeners
document.addEventListener("DOMContentLoaded", () => {
  
  // Handle form submission for login
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      // Sign in the user
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Redirect to Kanban board once logged in
          window.location.href = "index.html";
        })
        .catch((error) => {
          console.error("Login failed:", error);
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

      // Simple input validation
      if (!email || !password) {
        alert("Email and password cannot be empty!");
        return;
      }

      // Sign up the user
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Redirect to Kanban board after signing up
          window.location.href = "index.html";
        })
        .catch((error) => {
          console.error("Signup failed:", error);
          alert("Signup failed: " + error.message);
        });
    });
  }
});
