# Necxis-Assignment
# 🔄 React Native + Next.js WebView App with Firebase Auth & Push Notifications

This project is a hybrid integration of a **React Native CLI app** with a **Next.js web application**, using Firebase for both **Google Sign-In** and **Push Notifications** (FCM). It allows a user to log in using Google via a web interface embedded in the mobile app, and handles native push notifications using Firebase Cloud Messaging.

Everything was coded using **Visual Studio Code**, and the Android emulator was run using **Android Studio** (only for testing).

---

## 📌 Project Overview

- 👩‍💻 Coded completely in **VS Code**
- 📱 Mobile app built using **React Native CLI**
- 🌐 Web app built using **Next.js**
- 🔐 Login via **Google Sign-In using Firebase Auth**
- 🔔 Push notifications with **Firebase Cloud Messaging (FCM)**
- 📦 Firebase used for authentication + messaging
- 🔗 **WebView** used to embed web login in mobile app

---

## 🧱 Tech Stack

| Platform        | Tech                        |
|----------------|-----------------------------|
| Mobile App      | React Native CLI + WebView  |
| Web App         | Next.js + Firebase Auth     |
| Notifications   | Firebase Cloud Messaging    |
| UI              | Material UI (MUI) (Web)     |
| Auth Provider   | Google Sign-In              |
| Emulator        | Android Studio              |
| Code Editor     | Visual Studio Code          |

---

## 🚀 How to Run the Mobile App

### 📋 Prerequisites
- VS Code installed
- Android Studio (for running emulator)
- Node.js
- Firebase project setup
- Firebase `google-services.json` file (for Android)

### 🛠 Steps

1. **Open VS Code**
2. Go to `mobile-app` folder
3. Install dependencies:
   npm install


Make sure the Android emulator is running via Android Studio

Run the app:
npx react-native run-android
On app start, you will see the embedded web app inside the mobile app (via WebView)

Firebase will request notification permissions, and log the FCM token in console

After signing in via Google, you’ll receive a welcome alert with your name and email

### 🌐 How to Run the Web App (Next.js)
📋 Prerequisites
Firebase project created

Google Sign-In enabled in Firebase Auth

Firebase config set up in lib/firebase.ts

🛠 Steps
Open VS Code and go to web-app folder

Install dependencies:
npm install

Run the project:
npm run dev

Open browser: http://localhost:3000

