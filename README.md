# Rhea_todolist
# ToDo List Web App – Phase 2 (Full Stack Development)

**Author:** Rhea K N  
**Submission Title:** Rhea_KN_Todolist  
**Submission Type:** Phase 2 – Full Stack Implementation  
**Repository:** https://github.com/RheaNaveen/Rhea_todolist.git

---

## 🌐 Project Overview

This project is a full-stack ToDo List web application developed as part of the Full Stack Development course. It extends the initial frontend-only version (Phase 1) by integrating backend functionality using Node.js and a database.

The application allows users to:
- Add and manage tasks
- Organize them by categories and projects
- Set due dates
- Mark tasks as complete
- Delete tasks  
All data is now stored persistently in a database via backend integration.

---

## ✅ Features

### Frontend:
- Add tasks with title, category, due date, and project
- Add/select categories and projects
- Mark tasks as complete or incomplete
- Delete tasks
- Filter tasks by category
- Responsive and user-friendly UI

### Backend:
- Node.js Express server (`server.js`)
- Database integration using `db.js`
- REST API endpoints for CRUD operations
- Persistent storage in the database (instead of localStorage)
- Separated concerns between frontend and backend

---

## 🛠️ Technologies Used

### Frontend:
- HTML5  
- CSS3  
- Vanilla JavaScript  

### Backend:
- Node.js  
- Express.js  
- Database (e.g., MongoDB / MySQL / SQLite – depending on `db.js` implementation)

---

## 📁 Folder Structure

Rhea_KN_Todolist/
├── public/
│ ├── index.html # Main HTML file
│ ├── style.css # CSS styling
│ └── script.js # Frontend logic
├── server.js # Express server setup
├── db.js # Database configuration and queries
├── package.json # Node dependencies
└── README.md # Documentation


---

## 🚀 How to Run the Project

### 🔧 Prerequisites
- Node.js installed
- Database setup as per `db.js` (e.g., MongoDB/MySQL running)

### 🖥️ Steps

1. **Clone the repository**  
   ```bash
   git clone https://github.com/RheaNaveen/Rhea_KN_Todolist.git
   cd Rhea_KN_Todolist

Install dependencies

npm install
Configure the database
Update connection details in db.js according to your local setup.

Start the server
node server.js
Access the app
Open your browser and go to http://localhost:3000 (or the port specified in server.js).
