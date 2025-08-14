import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Investments from './components/Investments';
import Expenses from './components/Expenses';
import Income from './components/Income';
import Chat from './components/Chat';
import Settings from './components/Settings';

function App() {
  const [currentPage, setCurrentPage] = useState('/');

  const renderPage = () => {
    switch (currentPage) {
      case '/':
        return <Dashboard onNavigate={setCurrentPage} />;
      case '/investments':
        return <Investments />;
      case '/expenses':
        return <Expenses />;
      case '/income':
        return <Income />;
      case '/chat':
        return <Chat />;
      case '/settings':
        return <Settings />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default App;