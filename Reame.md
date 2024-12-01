## <a name="tech-stack">⚙️ Tech Stack</a>

- MongoDB
- React.js
- Tailwind CSS
- Node.js
- Express.js
- TypeScript

# <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

**Cloning the Repository**

```bash
git clone https://github.com/skp544/e-book-platform.git
cd e-book-platform/server
```

**Installation**

Install the project dependencies using npm:

```bash
npm install
```

**Set Up Environment Variables**

Create a new file named `.env` in the root of your project and add the following content:

```env
PORT = 8000

MONGODB_URI = mongodb://localhost:27017/ebook

MAILTRAP_TEST_USER=""
MAILTRAP_TEST_PASS=""

VERIFICATION_MAIL = verification@email.com
VERIFICATION_LINK =http://localhost:8000/auth/verify

JWT_SECRET=""

NODE_ENV="development"
BOOK_API_URL = http://localhost:8000/book

AUTH_SUCCESS_URL = http://localhost:5173/profile

CLOUD_NAME=""
CLOUD_API_KEY=""
CLOUD_API_SECRET =""

AWS_ACCESS_KEY_ID = ""
AWS_SECRET_ACCESS_KEY = ""
AWS_BUCKET_NAME = ""

AWS_PRIVATE_BUCKET = ""
```

Replace the values with your actual credentials

**Running the Project**

```bash
npm run dev
```

Open [http://localhost:8000](http://localhost:8000) in your browser to view the API.
