# LyrixSync - Local Development Guide

This guide will help you set up and run the LyrixSync application on your local machine for continued development.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (which includes npm)
- [Git](https://git-scm.com/)

## Getting Started

1. **Clone the repository:**
   If you have downloaded the project as a zip file, unzip it. Otherwise, you can clone it if it's in a git repository.

2. **Install dependencies:**
   Navigate to the project's root directory in your terminal and run:
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a file named `.env.local` in the root of your project. Copy the contents of the `.env` file into it. You will need to add your Gemini API key to this file for the AI features to work.
   ```
   GEMINI_API_KEY=YOUR_API_KEY
   ```

4. **Run the development server:**
   You can start the web application with:
   ```bash
   npm run dev
   ```
   This will start the Next.js development server, typically on `http://localhost:9002`.

5. **Run the Genkit AI flows:**
   For the AI-powered lyric generation to work, you need to run the Genkit development server in a separate terminal:
   ```bash
   npm run genkit:dev
   ```
   This will start the Genkit server, which your Next.js application will communicate with.

## Building for Android (using Capacitor)

To turn your web app into an Android application, you can use [Capacitor](https://capacitorjs.com/). Here are the general steps you would take after setting up your local development environment.

1.  **Install Capacitor:**
    ```bash
    npm install @capacitor/core @capacitor/cli @capacitor/android
    ```

2.  **Initialize Capacitor:**
    ```bash
    npx cap init LyrixSync com.example.lyrixsync --web-dir=out
    ```
    This will configure Capacitor for your project.

3.  **Build the Next.js app:**
    Before you can use Capacitor, you need a static build of your Next.js app. You'll first need to modify your `next.config.ts` to support static exports. 
    
    Add `output: 'export'` to your `next.config.ts` file.

    Then, run the build command:
    ```bash
    npm run build
    ```
    This will create a static version of your site in the `out` directory.

4.  **Add the Android platform:**
    ```bash
    npx cap add android
    ```

5.  **Sync your web app with the native project:**
    ```bash
    npx cap sync
    ```

6.  **Open in Android Studio:**
    ```bash
    npx cap open android
    ```
    This will open your project in Android Studio, where you can build your APK.
