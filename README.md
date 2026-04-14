# 🏠 MIT Hostel Roommate Finder

<p align="center">
  <b>Find your hostel roommate before you even move in.</b><br/>
  A simple, fast, and intuitive platform for connecting students sharing the same room.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-active-success?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/version-1.0-blue?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/license-MIT-green?style=for-the-badge"/>
</p>

---

## ✨ Overview

Moving into a hostel without knowing your roommate can be awkward.

**MIT Hostel Roommate Finder** solves this by allowing students to:

* Enter their room details
* Instantly discover who they’re sharing with
* Connect before arrival

> ⚡ Built for speed, simplicity, and real student needs.

---

## 🚀 Features

* 👤 **User Registration**

  * Name, Room Number, Phone Number

* 🏠 **Room-Based Matching**

  * Automatically groups users by room

* 🔄 **Real-Time Visibility**

  * If your roommate joins, you see them instantly

* 🚫 **Smart Constraints**

  * One user → One room
  * Maximum 2 occupants per room

* 📱 **Minimal & Clean UI**

  * Fast, distraction-free experience

---

## 🧠 How It Works

```mermaid
flowchart TD
    A[User Enters Details] --> B{Valid Input?}
    B -->|No| C[Show Error]
    B -->|Yes| D{Already Registered?}
    D -->|Yes| E[Reject Entry]
    D -->|No| F{Room Full?}
    F -->|Yes| G[Reject Entry]
    F -->|No| H[Save User]
    H --> I[Display Room Occupants]
```

---

## 🛠️ Tech Stack

| Layer    | Technology             |
| -------- | ---------------------- |
| Frontend | HTML, CSS, JavaScript  |
| Storage  | LocalStorage (Browser) |
| Backend  | *(Planned: Supabase)*  |

---

## 📦 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Nekhilesh-Agarwal/Mit-Hostel-Roommate-Finder.git
cd Mit-Hostel-Roommate-Finder
```

### 2. Run the project

Simply open:

```bash
index.html
```

> No installation required 🚀

---

## 📸 Screenshots

> *(Add your screenshots here for maximum impact)*

| Home Page                                | Room View                                |
| ---------------------------------------- | ---------------------------------------- |
| ![](https://via.placeholder.com/300x200) | ![](https://via.placeholder.com/300x200) |

---

## ⚙️ Core Logic

* Users are stored locally
* Room occupancy is dynamically calculated
* Constraints enforced before insertion
* UI updates instantly after submission

---

## 🔒 Limitations

* Data is stored in browser only (not shared globally)
* No authentication system yet
* No real-time sync across devices

---

## 🔮 Future Roadmap

* 🌐 Cloud backend (Supabase / Firebase)
* 🔐 Authentication (Login / Signup)
* 📊 Admin dashboard
* 🧠 AI-based roommate compatibility matching
* 📢 Notifications when roommate joins
* 📱 Mobile-first UI improvements
* 🚀 Full deployment (Vercel / AWS)

---

## 🤝 Contributors

* **Nekhilesh Agarwal**

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 💡 Inspiration

Starting hostel life is a big transition.

This project aims to remove uncertainty and help students feel:

* More comfortable
* More connected
* Better prepared

---

## 🌟 Support

If you like this project:

⭐ Star the repo
🍴 Fork it
📢 Share it with your friends

---

<p align="center">
  Built with ❤️ by students, for students
</p>
