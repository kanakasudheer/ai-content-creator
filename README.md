# AI Content Writer

A modern web application for generating high-quality content using the Gemini API. This project leverages React, TypeScript, and Vite for a fast and efficient development experience.

## Features

- Generate content using the Gemini API
- User authentication (Login & Sign Up)
- Customizable prompts and output sections
- Related topics suggestions
- Responsive and modern UI

## Getting Started

### 1. Clone the Repository

```sh
git clone https://github.com/kanakasudheer/ai-content-creator.git
cd Ai-content creator
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory and add your Gemini API key:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run the Development Server

```sh
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

## Project Structure

```
.
├── App.tsx
├── constants.ts
├── index.html
├── index.tsx
├── metadata.json
├── package.json
├── README.md
├── tsconfig.json
├── types.ts
├── vite.config.ts
├── components/
│   ├── ContentGenerator.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── LoginPage.tsx
│   ├── OutputSection.tsx
│   ├── PromptInputSection.tsx
│   ├── RelatedTopicsSection.tsx
│   ├── SignUpPage.tsx
│   └── common/
│       ├── Button.tsx
│       ├── LoadingSpinner.tsx
│       ├── Select.tsx
│       ├── TextArea.tsx
│       └── icons/
│           ├── CheckCircleIcon.tsx
│           ├── ClipboardIcon.tsx
│           ├── DownloadIcon.tsx
│           ├── MoonIcon.tsx
│           ├── SparklesIcon.tsx
│           └── SunIcon.tsx
└── services/
    └── geminiService.ts
```

## Scripts

- `npm run dev` – Start the development server
- `npm run build` – Build the app for production

## Technologies Used

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Gemini API](https://ai.google.dev/gemini-api/docs/)


