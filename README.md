# Pablo - Full-Stack Application

A modern full-stack application with React + TypeScript frontend and FastAPI + MongoDB backend.

## 🏗️ Architecture

### Frontend (`/frontend`)
- **React 19** with **TypeScript**
- **Tailwind CSS v4** for styling
- **Vite** for fast development and building
- **ESLint** + **Prettier** for code quality
- **Axios** for API calls with environment-based configuration

### Backend (`/backend`)
- **FastAPI** REST API
- **MongoDB** with Motor (async driver)
- **Pydantic** for data validation
- **Ruff** for linting and formatting
- **CORS** enabled for cross-origin requests
- Clean architecture with separation of concerns

## 📁 Project Structure

```
pablo/
├── frontend/
│   ├── src/
│   │   ├── api/          # API client and services
│   │   ├── config/       # Configuration files
│   │   ├── App.tsx       # Main component
│   │   └── main.tsx      # Entry point
│   ├── .env.example      # Environment variables template
│   ├── .prettierrc       # Prettier configuration
│   ├── eslint.config.js  # ESLint configuration
│   ├── package.json      # Dependencies and scripts
│   └── vite.config.ts    # Vite configuration
├── backend/
│   ├── app/
│   │   ├── api/          # API routes
│   │   ├── core/         # Core configuration
│   │   ├── db/           # Database connection
│   │   ├── models/       # Data models
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── services/     # Business logic
│   │   └── main.py       # Application entry point
│   ├── .env.example      # Environment variables template
│   ├── pyproject.toml    # Ruff configuration
│   └── requirements.txt  # Python dependencies
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and **npm**
- **Python** 3.11+
- **MongoDB** (local or cloud instance)

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env and set VITE_API_URL to your backend URL
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Available scripts:
   - `npm run dev` - Start development server
   - `npm run build` - Build for production
   - `npm run lint` - Run ESLint
   - `npm run lint:fix` - Fix ESLint issues
   - `npm run format` - Format code with Prettier
   - `npm run format:check` - Check code formatting

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   pip install -r requirements-dev.txt
   ```

4. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env and set MONGODB_URL and other variables
   ```

5. Start the development server:
   ```bash
   python -m app.main
   # or
   uvicorn app.main:app --reload
   ```

6. Available commands:
   - `python -m app.main` - Start the server
   - `ruff check .` - Run linter
   - `ruff check . --fix` - Fix linting issues
   - `ruff format .` - Format code

## 🔧 Configuration

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:8000
```

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=pablo_db
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
ENVIRONMENT=development
```

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Available Endpoints

- `GET /health` - Health check endpoint
- `GET /api/items` - List all items
- `POST /api/items` - Create a new item
- `GET /api/items/{id}` - Get item by ID
- `PUT /api/items/{id}` - Update item
- `DELETE /api/items/{id}` - Delete item

## 🧪 Example API Usage

### Create an Item
```bash
curl -X POST http://localhost:8000/api/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Item", "description": "A test item"}'
```

### List Items
```bash
curl http://localhost:8000/api/items
```

## 🎨 Code Quality

### Frontend
- **ESLint**: Modern React/TS rules configured
- **Prettier**: Consistent code formatting
- Run `npm run lint:fix` to fix issues automatically

### Backend
- **Ruff**: Fast Python linter and formatter
- Run `ruff check . --fix` to fix issues automatically
- Run `ruff format .` to format code

## 🔒 Security

- CORS is configured to allow specific origins only
- Environment variables for sensitive data
- Input validation with Pydantic schemas
- MongoDB connection with proper error handling

## 📦 Building for Production

### Frontend
```bash
cd frontend
npm run build
# Output will be in dist/ directory
```

### Backend
```bash
cd backend
# Set ENVIRONMENT=production in .env
# Use a production WSGI server like gunicorn
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linters and formatters
5. Submit a pull request

## 📝 License

This project is open source and available under the MIT License.
