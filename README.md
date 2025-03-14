# CultureX Media Uploader - Frontend

CultureX Media Uploader Frontend is a **React.js** application that allows users to securely upload and view media files. It integrates with an Express.js backend and AWS S3 for media storage.

Base URL - https://culturex-front.onrender.com

---

## 📌 Features
- **Google Authentication**
- **Upload Media Files** (Images & Videos)
- **View Uploaded Media**
- **File Type Tagging** for better organization
- **Separate Image & Video Display**

---

## 🛠 Tech Stack
- **React.js** (Frontend Framework)
- **Axios** (API Calls)
- **React Router** (Navigation)
- **Toast Notifications** (Message Promt)
- **CSS** for Styling (No Tailwind)

---

## 🚀 Setup & Installation

### 1⃣ Clone Repository
```sh
git clone https://github.com/smitmendapara/culturex-front.git
cd culturex-front
```

### 2⃣ Install Dependencies
```sh
npm install
```

### 3⃣ Configure Environment Variables
Create a `.env` file in the root directory from the `example.env` and add the respective values.

### 4⃣ Run the Application
```sh
npm start
```

---

## 📚 Usage Guide
### Authentication
- Users must be logged in to upload or view media.
- If not authenticated, users are redirected to the login page.

### Uploading Media
- Click on **Choose File** to select an image or video.
- Press **Upload** to send the file to the server.
- Uploaded files are displayed in their respective sections (Images/Videos).

### Viewing Media
- **Images** are displayed in a grid format.
- **Videos** are displayed with a play button.
- File type and size are displayed as tags.

---
