# Smart Finance AI App

A personal finance dashboard with AI-powered insights that helps you manage your money better. Chat with an AI assistant that knows your financial data and get personalized advice on investments, expenses, and financial planning.

## What it does

This app lets you track your investments, plan your expenses, and chat with an AI that understands your financial situation. The AI can answer questions like "Should I increase my PAC investment?" or "How are my expenses this month?" based on your actual data.

The cool part is the AI assistant - it's not just generic advice, it actually looks at your portfolio, spending habits, and financial goals to give you personalized recommendations. Plus it remembers your conversations, so you can have ongoing discussions about your financial strategy.

## Main features

**Investment tracking** - Keep track of your stocks, ETFs, crypto, and set up dollar-cost averaging (PAC) plans that automatically invest for you over time.

**Smart expenses** - Categorize your spending and see where your money goes. The app calculates your cash flow and helps you understand your financial patterns.

**AI financial advisor** - Chat in natural language about your finances. Ask anything from "How's my portfolio doing?" to "What should I invest in next?" and get answers based on your real data.

**Privacy focused** - All your data stays in your browser. There's even a privacy mode to hide amounts with one click when someone's looking over your shoulder.

## Tech stuff

Built with React 19 and modern web technologies. The AI uses Groq's Llama model for fast responses. Everything is responsive and works great on mobile too.

The app uses local storage for your data (no server needed) and integrates with Groq's API for the AI features. Dark mode included because who doesn't love dark mode?

## Setup

You'll need Node.js installed, then:

```bash
git clone https://github.com/carboxx/carboxx-smart-finance-ai-app.git
cd carboxx-smart-finance-ai-app
npm install
npm run dev
```

For the AI features to work, you'll need a free Groq API key. Create a `.env` file and add:
```
VITE_GROQ_API_KEY=your_key_here
```

Get your free key at console.groq.com - takes like 2 minutes to set up.

## About

This is a portfolio project I built to showcase modern React development with AI integration. It demonstrates working with real-time data, state management, API integration, and building intuitive user interfaces.

The focus was on creating something actually useful while showing off technical skills like React 19 features, AI integration, responsive design, and clean code architecture.
