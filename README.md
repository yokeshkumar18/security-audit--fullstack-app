# Security Audit Log Dashboard

**Live Demo (Frontend):** [Pending Vercel URL]
**Live API (Backend):** [https://security-audit-fullstack-app.onrender.com](https://security-audit-fullstack-app.onrender.com)

A robust, full-stack (MERN) application designed for security engineers to seamlessly upload, view, and investigate massive volumes of system audit logs without performance degradation.

## Tech Stack

**Frontend:**
- React (Vite)
- CSS (Custom Glassmorphic UI)
- Lucide React (Icons)
- React Hot Toast (Notifications)
- Axios (HTTP Client)

**Backend:**
- Node.js & Express
- MongoDB & Mongoose
- MongoDB Memory Server (Local Testing)
- Cors & Dotenv

## Architecture

This application follows a classic **Client-Server Architecture** with a decoupled frontend and backend.

- **Frontend:** A responsive Single Page Application (SPA) built with React. It uses local state to manage query parameters (filters, page, sort direction) and communicates with the backend via RESTful APIs. It implements debounced search to prevent API spamming.
- **Backend:** A Node/Express REST API that acts as the controller. It translates incoming HTTP requests and query parameters into optimized MongoDB queries.
- **Database:** MongoDB is used for its schema flexibility and ability to handle large JSON document insertions efficiently. 

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (Local instance running on 27017, or a MongoDB Atlas URI)

### 1. Backend Setup
1. Navigate to the `server` directory: `cd server`
2. Install dependencies: `npm install`
3. Start the server: `npm start` (Runs on port 5000)
*Note: If no `MONGO_URI` is found in a `.env` file, the server will automatically spin up an in-memory database for quick local testing.*

### 2. Frontend Setup
1. Open a new terminal and navigate to the `client` directory: `cd client`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev` (Runs on port 5173)

### 3. Populating Data
1. Run `node generateMockData.js` in the root directory to generate a `mockData10k.json` file.
2. Open the React app and click "Bulk Upload JSON" to push the 10,000 records to the database.

## API Endpoints

### `POST /api/logs/bulk`
Accepts an array of log objects and inserts them into the database in a single batch operation.
- **Body:** `[ { actor, action, resource, role, severity, timestamp ... } ]`
- **Response:** `{ message: 'Successfully inserted 10000 logs.' }`

### `GET /api/logs`
Fetches logs based on query parameters.
- **Query Params:** `page`, `limit`, `search`, `severity`, `role`, `sortBy`, `sortOrder`
- **Response:** `{ logs: [...], totalRecords: 10000, currentPage: 1, totalPages: 200 }`

## Technical Decisions

*   **Server-Side Pagination & Filtering:** To handle massive datasets (10,000+ logs), all pagination, sorting, and filtering are offloaded to the database via Mongoose queries (`.find()`, `.sort()`, `.skip()`, `.limit()`). This ensures the frontend remains lightning fast and doesn't crash the browser.
*   **Bulk Upload Optimization:** The backend uses `Log.insertMany()` instead of looping through individual `save()` calls. This executes a single network request to the database, drastically reducing insertion time and avoiding timeouts. Express JSON limit was increased to `50mb` to allow massive payloads.
*   **Debounced Search:** The frontend search input features a 300ms debounce. This prevents the browser from firing an API request on every single keystroke, significantly reducing unnecessary server load.
*   **UX Polish:** Included loading states (spinners), an empty state (when no logs match the filters), and toast notifications for upload feedback to create a premium, production-ready feel.