import { Groq } from 'groq-sdk';
import { db } from './database';

class RealAIChatbot {
  constructor() {
    // For demo purposes, we'll include the key here
    // In production, this should be in environment variables
    const apiKey = import.meta.env?.VITE_GROQ_API_KEY || null;
    
    if (apiKey) {
      this.groq = new Groq({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true // Enable browser usage
      });
      console.log('✅ Groq API configurata correttamente:', apiKey.substring(0, 20) + '...');
    } else {
      this.groq = null;
      console.log('🚀 Groq API key non configurata. Usando modalità simulata.');
      console.log('🔍 Debug - import.meta.env:', import.meta.env);
    }
    
    this.model = "llama3-8b-8192"; // Updated to supported Groq model
    this.conversationHistory = [];
  }

  // Get financial data for context
  getFinancialContext() {
    try {
      const portfolio = db.getPortfolioSummary();
      const investments = db.getInvestments();
      const pacPlans = db.getPACPlans();
      const expenses = db.getExpenses().slice(0, 10); // Last 10 expenses
      const transactions = db.getTransactions().slice(0, 10); // Last 10 transactions

      return {
        portfolio: {
          totalIncome: portfolio.totalIncome || 0,
          totalExpenses: portfolio.totalExpenses || 0,
          totalInvestments: portfolio.totalInvestments || 0,
          netWorth: portfolio.netWorth || 0,
          cashFlow: portfolio.cashFlow || 0
        },
        investments: investments.map(inv => ({
          name: inv.name,
          symbol: inv.symbol,
          type: inv.type,
          quantity: inv.quantity,
          purchasePrice: inv.purchasePrice,
          currentValue: inv.currentValue || inv.quantity * inv.purchasePrice
        })),
        pacPlans: pacPlans.map(pac => ({
          assetName: pac.assetName,
          amount: pac.amount,
          frequency: pac.frequency,
          isActive: pac.isActive,
          totalInvested: pac.totalInvested || 0
        })),
        recentExpenses: expenses.map(exp => ({
          category: exp.category,
          amount: exp.amount,
          description: exp.description,
          date: exp.date
        })),
        recentTransactions: transactions.map(trans => ({
          type: trans.type,
          amount: trans.amount,
          category: trans.category,
          description: trans.description,
          date: trans.date
        }))
      };
    } catch (error) {
      console.error('Error getting financial context:', error);
      return {
        portfolio: { totalIncome: 0, totalExpenses: 0, totalInvestments: 0, netWorth: 0, cashFlow: 0 },
        investments: [],
        pacPlans: [],
        recentExpenses: [],
        recentTransactions: []
      };
    }
  }

  // Create system prompt with financial context
  createSystemPrompt(userName = 'Utente') {
    const financialData = this.getFinancialContext();
    
    return `Sei un assistente finanziario AI esperto che aiuta con la gestione delle finanze personali. 
    
L'utente si chiama ${userName}. Usa sempre il suo nome quando parli con lui in modo naturale e professionale. 

DATI FINANZIARI ATTUALI DELL'UTENTE:
Portfolio Summary:
- Patrimonio netto: €${financialData.portfolio.netWorth.toLocaleString('it-IT')}
- Entrate totali: €${financialData.portfolio.totalIncome.toLocaleString('it-IT')}
- Spese totali: €${financialData.portfolio.totalExpenses.toLocaleString('it-IT')}
- Investimenti totali: €${financialData.portfolio.totalInvestments.toLocaleString('it-IT')}
- Cash flow: €${financialData.portfolio.cashFlow.toLocaleString('it-IT')}

Investimenti attuali:
${financialData.investments.map(inv => 
  `- ${inv.name} (${inv.symbol}): ${inv.quantity} unità a €${inv.purchasePrice} cad. (Valore: €${inv.currentValue.toLocaleString('it-IT')})`
).join('\\n')}

Piani PAC attivi:
${financialData.pacPlans.filter(pac => pac.isActive).map(pac => 
  `- ${pac.assetName}: €${pac.amount}/${pac.frequency} (Totale investito: €${pac.totalInvested.toLocaleString('it-IT')})`
).join('\\n')}

Ultime spese (${financialData.recentExpenses.length}):
${financialData.recentExpenses.map(exp => 
  `- ${exp.category}: €${exp.amount} (${exp.description})`
).join('\\n')}

ISTRUZIONI:
- Rispondi sempre in italiano
- Sii specifico e usa i dati reali dell'utente
- Fornisci consigli pratici e personalizzati
- Se l'utente chiede analisi, usa i dati sopra riportati
- Sii professionale ma amichevole
- Non inventare dati che non hai
- Concentrati su consigli di investimento, budgeting, e pianificazione finanziaria`;
  }

  // Send message to AI
  async sendMessage(userMessage, userName = 'Utente') {
    try {
      // Add user message to conversation history
      this.conversationHistory.push({
        role: "user",
        content: userMessage
      });

      // Keep only last 10 messages to avoid token limit
      if (this.conversationHistory.length > 10) {
        this.conversationHistory = this.conversationHistory.slice(-10);
      }

      const systemPrompt = this.createSystemPrompt(userName);

      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          ...this.conversationHistory
        ],
        model: this.model,
        temperature: 0.7,
        max_tokens: 1024
      });

      const aiResponse = completion.choices[0]?.message?.content || "Scusa, non riesco a rispondere al momento.";

      // Add AI response to conversation history
      this.conversationHistory.push({
        role: "assistant",
        content: aiResponse
      });

      return aiResponse;

    } catch (error) {
      console.error('AI Chat Error:', error);
      
      // Fallback to simulated responses if API fails
      return this.getSimulatedResponse(userMessage);
    }
  }

  // Fallback simulated response
  getSimulatedResponse(query) {
    const financialData = this.getFinancialContext();
    const queryLower = query.toLowerCase();
    
    if (queryLower.includes('portafoglio') || queryLower.includes('situazione')) {
      return `📈 **Analisi del tuo portafoglio (Simulata - API non disponibile):**

💰 **Patrimonio netto**: €${financialData.portfolio.netWorth.toLocaleString('it-IT')}
📊 **Cash flow**: €${financialData.portfolio.cashFlow.toLocaleString('it-IT')}
💼 **Investimenti**: €${financialData.portfolio.totalInvestments.toLocaleString('it-IT')}

**Raccomandazioni:**
• Il tuo patrimonio netto di €${financialData.portfolio.netWorth.toLocaleString('it-IT')} è ${financialData.portfolio.netWorth > 10000 ? 'buono' : 'in crescita'}
• Cash flow ${financialData.portfolio.cashFlow >= 0 ? 'positivo - ottimo lavoro!' : 'negativo - considera di ridurre le spese'}
• Hai ${financialData.investments.length} investimenti attivi

*Nota: Questa è una risposta simulata. Per l'AI reale, configura l'API key di Groq.*`;
    }
    
    return `🤖 **Risposta Simulata** (API AI non configurata)

Ho ricevuto la tua domanda: "${query}"

**I tuoi dati attuali:**
- Patrimonio: €${financialData.portfolio.netWorth.toLocaleString('it-IT')}
- Investimenti: €${financialData.portfolio.totalInvestments.toLocaleString('it-IT')}
- Cash Flow: €${financialData.portfolio.cashFlow.toLocaleString('it-IT')}

Per abilitare l'AI reale:
1. Ottieni una API key gratuita da console.groq.com
2. Aggiungi la chiave nelle impostazioni
3. Ricarica l'app

*Questa è una demo della funzionalità AI.*`;
  }

  // Clear conversation history
  clearHistory() {
    this.conversationHistory = [];
  }

  // Check if API is configured
  isConfigured() {
    return !!(import.meta.env?.VITE_GROQ_API_KEY);
  }
}

export const realAIChatbot = new RealAIChatbot();