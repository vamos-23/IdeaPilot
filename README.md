# 🚀 IdeaPilot

<div align="center">
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/NativeWind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="NativeWind" />
  <img src="https://img.shields.io/badge/Reanimated-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="Reanimated" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white" alt="TanStack Query" />
  <img src="https://img.shields.io/badge/Zustand-443322?style=for-the-badge" alt="Zustand" />

  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />

  <img src="https://img.shields.io/badge/Neon_PostgreSQL-000000?style=for-the-badge&logo=neon&logoColor=34D59A" alt="NeonDB" />
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
  <img src="https://img.shields.io/badge/Sentry-362D59?style=for-the-badge&logo=sentry&logoColor=white" alt="Sentry" />
</div>

<br />

<div align="center">
<h3>📱 Download for Android</h3>
<p>Scan the QR code below with your Android camera to download the APK directly to your device:</p>
<img src="https://quickchart.io/qr?text=https://github.com/vamos-23/IdeaPilot/releases/download/v1.0.0/ideapilot_v1.apk&size=250&margin=2&dark=5c50cf&centerImageUrl=https%3A%2F%2Fraw.githubusercontent.com%2Fvamos-23%2FIdeaPilot%2Fmain%2Ffrontend%2Fassets%2Fimages%2Flogo.png" alt="Download IdeaPilot APK" />
<br />
<p><em>(Alternatively, <a href="https://github.com/vamos-23/IdeaPilot/releases/download/v1.0.0/ideapilot_v1.apk">click here to download the APK</a> directly).</em></p>
<p>
<blockquote>
⚠️ <strong>Note for Android Users:</strong> Because this app is downloaded directly from GitHub rather than the Google Play Store, your browser may display a <em>"File might be harmful"</em> warning. This is a standard Android security prompt for all external APKs. It is completely safe to tap <strong>"Download anyway"</strong> to proceed with the installation.
<br><br>
🛡️ <strong>Samsung Galaxy Users:</strong> If your phone blocks the installation entirely, you may have Samsung's <strong>Auto Blocker</strong> enabled. To install the app, temporarily disable it by navigating to <strong>Settings > Security and privacy > Auto Blocker</strong>. This release is perfectly safe to install.
</blockquote>
</p>
</div>

## 📖 Overview
IdeaPilot is a mobile application built for students and developers to browse, brainstorm, and track project concepts they want to build. The dashboard acts as a central hub, allowing users to seamlessly toggle between recommended ideas, AI tools, and saved projects using dynamic in-screen tabs without relying on separate screen navigation. 

By leveraging static animations and fluid gesture handlers, the UI maintains a highly professional feel. To keep data handled correctly based on its type and use case, the storage layer is divided across multiple services:
* **Firebase Cloud Firestore:** Manages user-specific project data and live recommendations, making it straightforward to add, edit, or delete personal project lists.
* **NeonDB (PostgreSQL):** Safely retains historical chat logs and vector embeddings generated during AI conversations.
* **Redis:** Serves as a quick, temporary cache for active chat sessions to avoid loading delays mid-conversation.

>⚠️ **Infrastructure Note: Free-Tier Backend Cold Starts**
 
>The backend environment for IdeaPilot runs on Render's free tier, which puts the server instance to sleep after 15 minutes of inactivity to save resources. 
 
>**What this means for you:** If you open the app for the first time after a period of inactivity, the very first action requiring the central server (like pulling data or interacting with the chat) might take **up to 50 seconds** to process while the Node.js container boots back up. 
 
>**How it was handled:** To help make this lag less noticeable, the frontend app kicks off an asynchronous *pre-warm ping* the exact moment it mounts. This triggers the server's boot sequence in the background while you are looking at the initial splash or onboarding screens, giving the system a head start. While the backend might not be instantly available if you rush straight to the AI chat screen, this approach significantly cuts down the waiting time. Once the free-tier instance is fully awake, typical API requests and Redis lookups process smoothly in milliseconds.

---

## ✨ Application Preview

### ⚡ Core Capabilities
| Dashboard & UI | Chat & AI Context | Offline State & Sync |
|:---:|:---:|:---:|
| <img width="320" height="480" alt="Dashboard UI" src="https://github.com/user-attachments/assets/4e6a6053-4e5c-45a3-b48b-a2f0d595f467" /> | <img width="320" height="480" alt="AIChatScreen" src="https://github.com/user-attachments/assets/b3448f2e-0e26-4c82-a915-485884f28558" /> | <img width="320" height="480" alt="OfflineSync" src="https://github.com/user-attachments/assets/d2117a0f-28ea-499d-b128-cf21f8a906c8" /> |
| *Fluid in-screen tab routing with dynamic skeleton loading states.* | *Conversational AI using NeonDB vector indexing and Redis caching.* | *Optimistic UI updates syncing state smoothly with data caches.* |

<br>

### 🛠️ Project Ideation & Management
| Project Creation | Rich Details View |
|:---:|:---:|
| <img width="320" height="480" alt="ProjectCreation" src="https://github.com/user-attachments/assets/c535cc06-b3e7-4593-b52a-d463e670385e" /> | <img width="320" height="480" alt="ProjectDetails" src="https://github.com/user-attachments/assets/6691138a-7d07-4db2-ba8e-848d506204ff" /> |
| *Seamless data entry form with immediate list reconciliation.* | *Deep-linked project views featuring dynamic tag rendering.* |

---

## 🏗️ Architectural Decisions & The "Why"

This project focuses on handling practical issues around data syncing, quick chat context lookups, and clean diagnostic routing.

### 1. Client-Side Synchronization & Responsive UI Updates
* **Technology:** TanStack Query (React Query)
* **Implementation:** Instead of using basic `useEffect` loops to fetch network data, the app relies on Tanstack Query's caching layer. When a user marks a project as saved or updates an item, the interface applies an **Optimistic UI update**. The app updates the visual screen immediately assuming the network call will succeed, hiding network latency and making transitions feel crisp even on slower connections.

### 2. Conversational Context & Semantic Search Indexing
* **Technology:** NeonDB (PostgreSQL with `pgvector`), HNSW Indexing, and Redis
* **Implementation:** Chat histories and their corresponding vector embeddings are stored reliably inside a serverless **NeonDB** PostgreSQL database. 
  * To keep semantic similarity lookups from slowing down as chat records grow, the database uses **HNSW (Hierarchical Navigable Small World)** indexing. This groups related vector nodes together, allowing the AI to search through relevant context points efficiently.
  * To protect the database from redundant queries during an active discussion, **Redis** acts as an in-memory cache to immediately hold and serve the current conversation's structural context.

### 3. Build-Time Environment Injection & Error Isolation
* **Technology:** Expo Application Services (EAS) & Sentry
* **Implementation:** The app utilizes a decoupled structure set up inside `eas.json` and EAS Dashboards to keep development workflows clean and separate from test releases:
  * The **Preview Build** compiles into a direct `.apk` file that links safely to the live production server, giving reviewers an immediate, working version of the application.
  * **Sentry** logs native errors cleanly into a dedicated `preview` tag, ensuring that test sessions are easily distinguishable from internal developer builds.
  * Environment variables (like Firebase keys and API URLs) are injected strictly at compilation time using `EXPO_PUBLIC_` prefixes, decoupling the codebase from environment-checking conditional logic.

### 4. Persistent App State Recovery
* **Technology:** Zustand & AsyncStorage
* **Implementation:** Zustand handles global client states like theme layouts and basic user identity. Combining this with persistent storage enables the application to remember authentication states and interface configurations between cold reopens, avoiding sudden flashes of unauthorized screens while the state reconciles.

---

## 🚀 Future Improvements & Roadmap

While IdeaPilot provides a solid foundation for project planning, the architecture was designed with extensibility in mind. Current plans for upcoming iterations include:

* **Advanced Reanimated Transitions:** Upgrading the current static animations to fluid, shared-element transitions using `react-native-reanimated`. This will make navigation between the dashboard list and the project detail screens feel deeply native and buttery smooth.
* **Enhanced AI Context Parsing:** Refining the backend prompt engineering and NeonDB vector chunking strategies. The goal is to evolve the AI from providing basic brainstorming advice to parsing complex, multi-turn architectural logic and generating tailored boilerplate code.
* **Comprehensive Testing Suite:** Implementing Jest for unit testing core Zustand state logic and React Native Testing Library for component rendering to ensure long-term stability as features scale.
* **Expanded Offline Mode:** Enhancing TanStack Query's offline cache to allow users to fully create and edit project details while disconnected, queuing the mutations for background sync the moment network connectivity returns.

---

## 🛠️ Tech Stack

**Frontend Frameworks & Design:**
* React Native (Expo SDK)
* React Navigation & Expo Router
* NativeWind (TailwindCSS framework)
* React Native Reanimated & Gesture Handler

**State Management & Networking:**
* TanStack Query (React Query)
* Zustand
* Axios

**Backend Services & Databases:**
* Node.js & Express.js
* NeonDB (PostgreSQL with `pgvector` extension)
* Redis (Session caching)
* Firebase Cloud Firestore & Authentication

**DevOps & Error Tracking:**
* Expo EAS (Cloud Builds)
* Sentry (Native Telemetry)

---

## 💻 Local Development Setup

To replicate and run this project locally on your machine:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/vamos-23/IdeaPilot.git](https://github.com/vamos-23/IdeaPilot.git)
   cd IdeaPilot
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env.development` file in the root directory. You will need to provide your own keys for the external services to run the app locally:
   ```env
   # Telemetry
   EXPO_PUBLIC_SENTRY_DSN=your_sentry_dsn_here

   # Backend Routing (Points to your local machine)
   EXPO_PUBLIC_API_URL=http://your_local_ip:3000/api

   # Google Services Local File Paths
   GOOGLE_SERVICES_JSON_DEV=./google-services-dev.json

   # Firebase credentials (Development Mode)
   EXPO_PUBLIC_FIREBASE_API_KEY=your_dev_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_dev_auth_domain
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_dev_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_dev_storage_bucket
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_dev_messaging_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_dev_app_id
   EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_dev_measurement_id
   ```

4. **Start the Development Server:**
   ```bash
   npx expo start --clear
   ```

> **Note on Backend Setup:** To fully utilize the AI chat and Redis caching features locally, you will also need to spin up the IdeaPilot Node.js backend server. Ensure it is running on your local network and update the `EXPO_PUBLIC_API_URL` in your `.env.development` file accordingly.
