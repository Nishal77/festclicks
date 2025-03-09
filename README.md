# FestClicks

<div align="center">
  <img src="src/assets/logodash.png" alt="FestClicks Logo" width="250px" />
  <h3>A Modern Event Discovery & Media Sharing Platform</h3>
</div>

## 📌 Overview

FestClicks is an interactive web platform designed for discovering, joining, and sharing media from various events and festivals. The application enables users to explore upcoming events, upload their own event media, and connect with the event community.

## ✨ Features

- **Elegant Dashboard**: Discover trending and upcoming events with an intuitive user interface
- **Event Exploration**: Browse through events with detailed information including dates, descriptions, and attendee count
- **Media Upload**: Share your event photos with customizable categorization options
- **User Authentication**: Secure login/logout functionality with personalized user experience
- **Responsive Design**: Optimized viewing experience across all device sizes

## 🛠️ Technologies Used

- **Frontend**:
  - React.js
  - Tailwind CSS for styling
  - Lucide React for icons
  - Custom components

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later) or yarn (v1.22.0 or later)

## 🚀 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/Nishal77/festclicks.git
cd festclicks
```

### 2. Set up environment variables

Create a `.env` file in the root directory of the project. **This file should never be committed to your repository for security reasons.**

Add the following environment variables to your `.env` file:

```
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
DATABASE_URL=your_database_url_here
AUTH_SECRET=your_auth_secret_here
STORAGE_URL=your_storage_url_here
```

> **Note:** You need to replace the placeholder values with your actual API keys and URLs. Create an account with the relevant services to obtain these keys.

### 3. Install dependencies

```bash
npm install
# or
yarn install
```

### 4. Start the development server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

### 5. Building for production

```bash
npm run build
# or
yarn build
```

The optimized production build will be generated in the `dist` directory.

## 📱 Usage

1. **Authentication**: Start by creating an account or logging in
2. **Explore Events**: Browse through the event dashboard to discover upcoming events
3. **Join Events**: Click the "Join Event" button on any event card to participate
4. **Upload Media**: Click the "Upload" button in the navbar to share your event photos
   - Select up to 100 photos
   - Choose appropriate categories and media types
   - Add relevant descriptions

## 🤝 Contributing

We welcome contributions from the community! Here's how you can contribute:

### Setting up for development

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YourUsername/festclicks.git
   cd festclicks
   ```
3. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. Create your `.env` file as described in the setup section (not committed to git)
5. Install dependencies:
   ```bash
   npm install
   ```

### Making changes

1. Make your changes to the codebase
2. Test your changes thoroughly
3. Ensure your code follows the project's coding standards
4. Commit your changes with descriptive commit messages:
   ```bash
   git commit -m "Add: detailed description of your changes"
   ```
5. Push your changes to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
6. Create a Pull Request from your fork to the main repository

### Pull Request Guidelines

- Provide a clear, descriptive title for your PR
- Include a detailed description of the changes made
- Reference any related issues using GitHub issue numbers
- Make sure all tests pass and no new bugs are introduced
- Be responsive to code review comments and feedback

## ⚠️ Important Note About `.env` Files

The `.env` file contains sensitive information and should **never** be committed to version control. We've included it in the `.gitignore` file, but always double-check that you don't accidentally commit it.

To ensure your `.env` file is not tracked:

```bash
git check-ignore -v .env
```

If you've accidentally committed it in the past, you can remove it from tracking:

```bash
git rm --cached .env
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Contact

Nishal N Poojary - [GitHub Profile](https://github.com/Nishal77)

Project Link: [https://github.com/Nishal77/festclicks](https://github.com/Nishal77/festclicks)
