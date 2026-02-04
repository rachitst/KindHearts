# ❤️ KindHearts - Smart Donation & Relief Platform

**Bridging the gap between generous donors, needy institutes, and local shopkeepers with transparency and AI.**

<div align="center">
  <img src="./public/KindHearts%20Logo.png" alt="KindHearts Logo" width="300" />
</div>

## 🚀 Overview

**KindHearts** is a comprehensive, transparent, and AI-powered platform designed to streamline the donation process. Unlike traditional platforms where money often gets lost in transit, KindHearts ensures that **funds are directed to local shopkeepers** who fulfill specific requests raised by verified institutes (orphanages, old age homes, shelters).

Our ecosystem connects four key pillars:
1.  **Donors**: Who want to donate securely and track their impact.
2.  **Institutes**: Who need specific supplies (Food, Medical, Education).
3.  **Shopkeepers**: Local vendors who fulfill these orders.
4.  **Admins**: Who oversee and verify the entire process.

---

## ✨ Key Features

### 👨‍👩‍👧 For Donors
*   **Transparent Tracking**: Track your donation from "Payment" to "Delivered" with real-time updates.
*   **AI Assistant (Sahayak)**: A smart chatbot to guide you through the donation process and answer FAQs.
*   **Impact Reports**: Visual analytics of how your contributions have changed lives.
*   **Smart Recommendations**: Get suggestions for causes that match your interests.
*   **Recurring Donations**: Set up monthly support for your favorite institutes.

### 🏢 For Institutes
*   **Easy Request Raising**: Create specific requests for items (e.g., "50kg Rice", "20 Textbooks").
*   **Urgency Levels**: Mark requests as Low, Medium, or Critical to get immediate attention.
*   **Dashboard Analytics**: Track pending, processing, and completed requests.
*   **Delivery Confirmation**: Secure OTP/Proof-based system to confirm receipt of goods.
*   **Institute Chatbot**: Dedicated AI support for managing requests.

### 🏪 For Shopkeepers
*   **Kanban Order Management**: A Trello-like drag-and-drop board to manage orders (New -> In Progress -> Ready -> Delivered).
*   **Inventory & Payments**: Track earnings and manage stock availability.
*   **Direct Fulfillment**: Receive orders directly from verified institutes in your locality.

### 🛡️ For Admins
*   **Ecosystem Monitoring**: Real-time charts and graphs showing donation trends and user distribution.
*   **Verification Portal**: Tools to verify new institutes and shopkeepers.
*   **Shopkeeper Rotation**: Fairness algorithms to distribute orders among local vendors.

---

## 🛠️ Tech Stack

**Frontend:**
*   ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) **React.js** (Vite)
*   ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) **TypeScript**
*   ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) **Tailwind CSS**
*   **Framer Motion** (Animations)
*   **Redux Toolkit** (State Management)
*   **Recharts / Chart.js** (Data Visualization)

**Backend & Services:**
*   ![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white) **Node.js & Express**
*   ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white) **MongoDB**
*   **Groq API** (AI Chatbots)
*   **Clerk** (Authentication)

---

## 📸 Workflow

1.  **Institute Raises Request**: "We need 100 blankets."
2.  **Platform Matches**: The request is assigned to a nearby verified Shopkeeper.
3.  **Donor Funds It**: A donor sees the request and pays for the blankets.
4.  **Shopkeeper Delivers**: The shopkeeper delivers the items to the institute.
5.  **Institute Confirms**: The institute verifies delivery, and the cycle is complete.

---

## 🔧 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
*   Node.js (v18+)
*   MongoDB (Local or Atlas URL)
*   Groq API Key (for Chatbots)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/kindhearts.git
    cd kindhearts
    ```

2.  **Install Frontend Dependencies**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**
    Create a `.env` file in the root directory:
    ```env
    VITE_API_URL=http://localhost:5000
    VITE_GROQ_API_KEY=your_groq_api_key
    VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
    ```

4.  **Run the Development Server**
    ```bash
    npm run dev
    ```

5.  **Backend Setup** (If applicable)
    Navigate to the backend folder and install dependencies:
    ```bash
    cd backend
    npm install
    npm start
    ```

---

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ by Team KindHearts
</p>
