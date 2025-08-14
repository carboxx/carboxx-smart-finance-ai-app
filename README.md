# 💰 Finance Dashboard - Personal Finance Management System

A comprehensive personal finance dashboard with advanced AI-powered features for investment tracking, expense management, and intelligent financial analysis.

## 🚀 Live Demo

[View Live Demo](https://your-demo-url.vercel.app) *(Deploy link will be added)*

## 📋 Features

### 💼 Portfolio Management
- **Real-time Investment Tracking**: Monitor stocks, ETFs, cryptocurrencies, and bonds
- **PAC Plans (Dollar Cost Averaging)**: Automated investment planning with scheduling
- **Performance Analytics**: Gain/loss tracking with percentage calculations
- **Multi-asset Support**: Comprehensive asset class coverage

### 🤖 Intelligent Chat Assistant
- **RAG (Retrieval-Augmented Generation)**: AI assistant with access to your financial data
- **Memory System**: Persistent conversation history across multiple chat sessions
- **Financial Analysis**: Automated insights and personalized recommendations
- **Multi-chat Management**: Topic-based conversation organization

### 📊 Expense & Income Tracking
- **Category-based Organization**: Detailed expense categorization
- **Budget Management**: Set and monitor budget limits
- **Cash Flow Analysis**: Real-time income vs expense monitoring
- **Recurring Transactions**: Automated tracking for regular expenses

### 🎨 Modern UI/UX
- **Dark Mode Support**: Complete dark/light theme switching
- **Responsive Design**: Mobile-first responsive layout
- **Smooth Animations**: Framer Motion powered interactions
- **Modern Components**: Clean, professional interface design

## 🛠 Technology Stack

### Frontend
- **React 19** - Latest React with modern features
- **Vite** - Next generation build tool
- **Tailwind CSS 3** - Utility-first CSS framework
- **Framer Motion** - Production-ready motion library
- **Recharts** - Composable charting library

### UI Components
- **Heroicons** - Beautiful hand-crafted SVG icons
- **Headless UI** - Unstyled, accessible UI components
- **Custom Components** - Reusable, modular component architecture

### Data Management
- **LocalStorage Database** - Client-side data persistence
- **Custom Database Layer** - Abstracted data operations
- **Real-time Updates** - Reactive data synchronization

### AI & Advanced Features
- **RAG System** - Retrieval-Augmented Generation for contextual AI responses
- **Memory Management** - Persistent conversation context
- **Financial Analysis Engine** - Automated insight generation
- **Chat Management System** - Multi-session conversation handling

## 🏗 Architecture

```
src/
├── components/          # Reusable UI components
│   ├── Dashboard.jsx   # Main dashboard with analytics
│   ├── Investments.jsx # Portfolio management
│   ├── Chat.jsx       # AI assistant interface
│   ├── Layout.jsx     # Application shell
│   └── Modal.jsx      # Reusable modal system
├── lib/                # Core business logic
│   ├── database.js    # Data persistence layer
│   ├── chatbot.js     # AI assistant engine
│   ├── chatManager.js # Conversation management
│   └── types.js       # TypeScript definitions
├── hooks/              # Custom React hooks
│   └── useTheme.js    # Theme management
└── index.css          # Global styles
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/carboxx/finance-dashboard.git
   cd finance-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
npm run preview
```

## 💡 Key Features Deep Dive

### 🤖 AI-Powered Financial Assistant

The integrated AI assistant provides intelligent financial analysis through:

- **Real-time Data Analysis**: Direct access to your portfolio and transaction data
- **Contextual Recommendations**: Personalized advice based on your financial patterns
- **Memory Persistence**: Remembers previous conversations for better context
- **Multi-topic Conversations**: Separate chat sessions for different financial topics

### 📈 Advanced Portfolio Analytics

- **Real-time Performance Tracking**: Live updates of investment values
- **Risk Assessment**: Portfolio diversification analysis
- **Historical Trends**: Track performance over time
- **PAC Optimization**: Dollar-cost averaging strategy recommendations

### 🎯 Smart Budget Management

- **Automated Categorization**: Intelligent expense categorization
- **Budget Alerts**: Real-time notifications for budget limits
- **Savings Goals**: Track progress toward financial objectives
- **Cash Flow Forecasting**: Predictive financial planning

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for configuration:

```env
VITE_APP_TITLE=Finance Dashboard
VITE_API_BASE_URL=http://localhost:3000
```

### Theme Customization

The theme can be customized in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom color palette
      }
    }
  }
}
```

## 📱 Mobile Responsiveness

The application is fully responsive with:
- Mobile-first design approach
- Touch-optimized interactions
- Responsive navigation
- Adaptive layouts for all screen sizes

## 🔒 Data Security

- **Local Storage**: All data stored locally in browser
- **No External APIs**: Complete data privacy
- **Secure by Design**: No sensitive data transmission
- **User Control**: Full data ownership and control

## 🚀 Performance Optimizations

- **Code Splitting**: Dynamic imports for optimal loading
- **Lazy Loading**: Components loaded on demand
- **Memoization**: React.memo for performance optimization
- **Efficient Re-renders**: Optimized state management

## 📊 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Antonio Carbone**
- GitHub: [@carboxx](https://github.com/carboxx)
- Portfolio: [Your Portfolio URL]

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first approach
- Framer Motion for smooth animations
- The open-source community for inspiration and tools

---

⭐ **Star this repository if you found it helpful!**
