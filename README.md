# EchoWatch - Proactive AI Threat Detection System

---

## 🚀 The Idea: "Spidey Sense" for Security

**EchoWatch** is a smart, AI-powered early-warning system for public spaces. Instead of reactively recording incidents, EchoWatch proactively identifies potential threats *before* they escalate. It's designed to give security personnel the crucial seconds they need to intervene and de-escalate situations.

This project is a web-based demonstration of the core concept, using a live camera feed and a client-side AI model to detect potential threats in real-time.

---

## ✨ Key Features

* **Live Video Feed:** Accesses the device's camera for real-time monitoring.
* **AI-Powered Threat Detection:** Uses a custom-trained TensorFlow\.js model to identify threats (e.g., detecting a person holding a knife).
* **Real-Time Alerts:** When a threat is detected with sufficient confidence, the system triggers:

  * An **audible alarm** to alert nearby personnel.
  * A high-visibility **blinking banner** overlaid on the video feed.
  * A **risk factor percentage** to quantify the threat level.
* **Event Logging:** Each detected threat is logged in a sidebar with a timestamp for review.
* **Modern & Responsive UI:** Built with Tailwind CSS for a clean, professional dashboard that works on various screen sizes.

---

## 🛠️ Tech Stack

This demonstration is built entirely with client-side technologies, making it lightweight and easy to deploy.

* **Frontend:** HTML5, CSS3, JavaScript (ES6+)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **AI / Machine Learning:** [TensorFlow.js](https://www.tensorflow.org/js)
* **AI Model:** A custom image classification model trained with [Teachable Machine](https://teachablemachine.withgoogle.com/)

---

## 📂 Project Structure

```plaintext
/
├── frontend/
│   ├── models/
│   │   ├── model.json         # The AI model architecture  
│   │   ├── metadata.json      # Model class labels and info  
│   │   └── weights.bin        # The trained model weights  
│   ├── public/
│   │   ├── alert.mp3          # The audible alarm sound  
│   │   └── favicon.ico        # Browser tab icon  
│   │   ├──app.html            # The main dashboard page  
│   │   ├──index.html          # The landing page  
│   │   ├──settings.html       # A placeholder for settings
│   ├── scripts/
│   │   ├── settings.js        # The JS Script for the settings page  
│   │   └── app.js             # The JS script for the app page    
└── README.md                  # You are here  
```

---

## 🏃‍♂️ How to Run This Project

You can run this project locally with just a web server. The easiest method is using the **Live Server** extension in Visual Studio Code.

### Prerequisites

* [Visual Studio Code](https://code.visualstudio.com/)
* [Live Server Extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)

---

### Steps

1. **Clone the repository:**

```bash
git clone https://github.com/Sadiq-Teslim/echowatch.git
```

2. **Open the project in VS Code:**

```bash
cd echowatch
code .
```

3. **Run with Live Server:**

* In the VS Code Explorer, right-click on `frontend/app.html` or `frontend/index.html`.
* Select **"Open with Live Server"**.

4. **Grant Permissions:**

* Your browser will request permission to access your camera — **Allow it**.
* Click anywhere on the page once to enable the audio context (alarm sound).

The application should now be running in your browser.

---

## 🌐 Deployment

This project is optimized for static site hosting platforms. We're currently using [Netlify](https://www.netlify.com/).
The project is live at [https://echowatch.netlify.app](https://echowatch.netlify.app)
### Netlify Deployment Settings:

* **Build command:** *(leave this blank)*
* **Publish directory:** `frontend`

The code uses relative paths for all assets (`models/`, `public/`), so it will work without modifications once deployed.

---

## 🔮 Future Vision

This demo represents the foundation of the EchoWatch concept. A production-ready EchoWatch system would expand with:

* A robust backend (e.g., Node.js, Python) to manage multiple camera streams
* Advanced AI models (e.g., YOLOv8) for object detection and behavior monitoring (e.g., loitering, aggression detection)
* A centralized database for incident logging, analytics, and historical insights
* Integration with existing security systems and IoT infrastructure

---

## 💡 Contributing & Feedback

This is an early-stage prototype. Contributions, suggestions, or collaborations are welcome — feel free to open issues or pull requests to help enhance the project.

---

**EchoWatch** — Giving security systems the "spidey sense" they deserve. 🕸️🚨
---
**Built by Team Path Trackers for SafeCode Hackathon 2025**
