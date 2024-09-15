var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},t={},n={},o=e.parcelRequireb085;null==o&&((o=function(e){if(e in t)return t[e].exports;if(e in n){var o=n[e];delete n[e];var i={id:e,exports:{}};return t[e]=i,o.call(i.exports,i,i.exports),i.exports}var r=Error("Cannot find module '"+e+"'");throw r.code="MODULE_NOT_FOUND",r}).register=function(e,t){n[e]=t},e.parcelRequireb085=o);var i=o("fhN3L"),r=o("6AR8M"),l=o("3JaYo");// Initialize Firebase and Auth
const a=(0,i.initializeApp)(l.firebaseConfig),d=(0,r.getAuth)(a);// Wait for DOM content to load before attaching event listeners
document.addEventListener("DOMContentLoaded",()=>{// Handle form submission for login
let e=document.getElementById("login-form");e&&e.addEventListener("submit",e=>{e.preventDefault();let t=document.getElementById("email").value,n=document.getElementById("password").value;// Sign in the user
(0,r.signInWithEmailAndPassword)(d,t,n).then(e=>{// Redirect to Kanban board once logged in
window.location.href="index.html"}).catch(e=>{console.error("Login failed:",e),alert("Login failed: "+e.message)})});// Handle sign-up button click
let t=document.getElementById("signup-btn");t&&t.addEventListener("click",()=>{let e=prompt("Enter email:"),t=prompt("Enter password:");// Simple input validation
if(!e||!t){alert("Email and password cannot be empty!");return}// Sign up the user
(0,r.createUserWithEmailAndPassword)(d,e,t).then(e=>{// Redirect to Kanban board after signing up
window.location.href="index.html"}).catch(e=>{console.error("Signup failed:",e),alert("Signup failed: "+e.message)})})});//# sourceMappingURL=index.b3fe0b7a.js.map

//# sourceMappingURL=index.b3fe0b7a.js.map
