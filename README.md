# StudioSpace API 🎨
### The Engine Behind Creative Spaces.

**StudioSpace API** powers the backend of a creative studio marketplace, connecting creators with inspiring spaces through studio management, secure access, and reliable booking operations.

Designed to keep the platform's core operations organized, protected, and dependable.

---

## ✨ Core Capabilities

- **Studio Management** — Create, retrieve, update, and delete studio listings.
- **Secure Authentication** — Handle authentication-related operations with JWT verification.
- **Protected Endpoints** — Validate requests and control access to private operations.
- **Booking Management** — Handle studio reservations, booking statuses, and cancellations.
- **Conflict Prevention** — Prevent overlapping reservations when an existing booking is confirmed.
- **Database Integration** — Store and manage application data with MongoDB.
- **Cookie Handling** — Process cookie-based authentication data securely.

## 🧰 Technology Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Backend API framework |
| MongoDB | Database |
| jose | JWT verification |
| cookie-parser | Cookie parsing |
| CORS | Cross-origin resource sharing |
| dotenv | Environment configuration |

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB connection

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/tawfiqb69/studiospace-server.git
```

**2. Navigate to the project**

```bash
cd studiospace-server
```

**3. Install dependencies**

```bash
npm install
```

**4. Configure environment variables**

Create a `.env` file in the project root and add the environment variables required by the application.

**5. Start the server**

```bash
node index.js
```

The local backend server runs on port `8000`.

## 🌐 Project Links

- **Live Frontend:** [StudioSpace](https://studiospace-client-beta.vercel.app)
- **GitHub Repository:** [StudioSpace Server](https://github.com/tawfiqb69/studiospace-server)

---

<p align="center">
  <strong>STUDIOSPACE API</strong><br/>
  <sub>Built for creators. Engineered for reliable bookings.</sub>
</p>