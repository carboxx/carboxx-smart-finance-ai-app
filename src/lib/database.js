// Database locale con localStorage
const DB_PREFIX = 'finance_app_';

export class Database {
  constructor() {
    this.initializeDatabase();
  }

  initializeDatabase() {
    const tables = ['users', 'transactions', 'investments', 'pac_plans', 'expenses', 'budgets'];
    tables.forEach(table => {
      if (!localStorage.getItem(DB_PREFIX + table)) {
        localStorage.setItem(DB_PREFIX + table, JSON.stringify([]));
      }
    });
    
    // Add sample data if database is empty
    this.addSampleDataIfEmpty();
  }

  addSampleDataIfEmpty() {
    const pacPlans = this.getTable('pac_plans');
    const investments = this.getTable('investments');
    const transactions = this.getTable('transactions');
    
    // Add sample PAC if none exist
    if (pacPlans.length === 0) {
      this.addPACPlan({
        assetName: 'MSCI World ETF',
        assetSymbol: 'SWDA',
        amount: 300,
        frequency: 'monthly'
      });
      
      this.addPACPlan({
        assetName: 'S&P 500 ETF',
        assetSymbol: 'SPY',
        amount: 200,
        frequency: 'monthly'
      });
    }
    
    // Add sample investment if none exist
    if (investments.length === 0) {
      this.addInvestment({
        name: 'Apple Inc.',
        symbol: 'AAPL',
        type: 'azione',
        quantity: 10,
        purchasePrice: 150,
        purchaseDate: '2024-01-15'
      });
    }
    
    // Add sample transactions if none exist
    if (transactions.length === 0) {
      this.addTransaction({
        type: 'income',
        amount: 3000,
        category: 'Stipendio',
        description: 'Stipendio mensile',
        date: new Date().toISOString()
      });
    }
  }

  // Utility methods
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  getTable(tableName) {
    return JSON.parse(localStorage.getItem(DB_PREFIX + tableName) || '[]');
  }

  saveTable(tableName, data) {
    localStorage.setItem(DB_PREFIX + tableName, JSON.stringify(data));
  }

  // Transactions
  addTransaction(transaction) {
    const transactions = this.getTable('transactions');
    const newTransaction = {
      id: this.generateId(),
      ...transaction,
      date: transaction.date || new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    transactions.push(newTransaction);
    this.saveTable('transactions', transactions);
    return newTransaction;
  }

  getTransactions(filters = {}) {
    let transactions = this.getTable('transactions');
    
    if (filters.type) {
      transactions = transactions.filter(t => t.type === filters.type);
    }
    if (filters.category) {
      transactions = transactions.filter(t => t.category === filters.category);
    }
    if (filters.dateFrom) {
      transactions = transactions.filter(t => new Date(t.date) >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
      transactions = transactions.filter(t => new Date(t.date) <= new Date(filters.dateTo));
    }
    
    return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  // Investments
  addInvestment(investment) {
    const investments = this.getTable('investments');
    const newInvestment = {
      id: this.generateId(),
      ...investment,
      createdAt: new Date().toISOString(),
      currentValue: investment.quantity * investment.purchasePrice
    };
    investments.push(newInvestment);
    this.saveTable('investments', investments);
    return newInvestment;
  }

  getInvestments() {
    return this.getTable('investments');
  }

  updateInvestmentPrice(investmentId, currentPrice) {
    const investments = this.getTable('investments');
    const investment = investments.find(i => i.id === investmentId);
    if (investment) {
      investment.currentPrice = currentPrice;
      investment.currentValue = investment.quantity * currentPrice;
      investment.performance = ((currentPrice - investment.purchasePrice) / investment.purchasePrice) * 100;
      investment.lastUpdated = new Date().toISOString();
      this.saveTable('investments', investments);
    }
  }

  // PAC Plans (Piano di Accumulo Capitale)
  addPACPlan(plan) {
    const pacPlans = this.getTable('pac_plans');
    const newPlan = {
      id: this.generateId(),
      ...plan,
      isActive: true,
      createdAt: new Date().toISOString(),
      nextExecutionDate: this.calculateNextExecution(plan.frequency)
    };
    pacPlans.push(newPlan);
    this.saveTable('pac_plans', pacPlans);
    return newPlan;
  }

  getPACPlans() {
    return this.getTable('pac_plans');
  }

  calculateNextExecution(frequency) {
    const now = new Date();
    switch (frequency) {
      case 'weekly':
        return new Date(now.setDate(now.getDate() + 7)).toISOString();
      case 'monthly':
        return new Date(now.setMonth(now.getMonth() + 1)).toISOString();
      case 'quarterly':
        return new Date(now.setMonth(now.getMonth() + 3)).toISOString();
      default:
        return new Date(now.setMonth(now.getMonth() + 1)).toISOString();
    }
  }

  // Expenses
  addExpense(expense) {
    const expenses = this.getTable('expenses');
    const newExpense = {
      id: this.generateId(),
      ...expense,
      date: expense.date || new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    expenses.push(newExpense);
    this.saveTable('expenses', expenses);
    return newExpense;
  }

  getExpenses(filters = {}) {
    let expenses = this.getTable('expenses');
    
    if (filters.category) {
      expenses = expenses.filter(e => e.category === filters.category);
    }
    if (filters.recurring !== undefined) {
      expenses = expenses.filter(e => e.recurring === filters.recurring);
    }
    
    return expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  // Budgets
  addBudget(budget) {
    const budgets = this.getTable('budgets');
    const newBudget = {
      id: this.generateId(),
      ...budget,
      spent: 0,
      createdAt: new Date().toISOString()
    };
    budgets.push(newBudget);
    this.saveTable('budgets', budgets);
    return newBudget;
  }

  getBudgets() {
    return this.getTable('budgets');
  }

  updateBudgetSpent(budgetId, amount) {
    const budgets = this.getTable('budgets');
    const budget = budgets.find(b => b.id === budgetId);
    if (budget) {
      budget.spent += amount;
      this.saveTable('budgets', budgets);
    }
  }

  // Analytics
  getPortfolioSummary() {
    const transactions = this.getTable('transactions');
    const investments = this.getTable('investments');
    const expenses = this.getTable('expenses');

    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = expenses
      .reduce((sum, e) => sum + e.amount, 0);

    const totalInvestments = investments
      .reduce((sum, i) => sum + (i.currentValue || i.quantity * i.purchasePrice), 0);

    const netWorth = totalIncome - totalExpenses + totalInvestments;

    return {
      totalIncome,
      totalExpenses,
      totalInvestments,
      netWorth,
      cashFlow: totalIncome - totalExpenses
    };
  }
}

export const db = new Database();