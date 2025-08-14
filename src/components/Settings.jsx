import React, { useState } from 'react';
import { 
  Cog6ToothIcon, 
  MoonIcon, 
  SunIcon, 
  ComputerDesktopIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ShieldCheckIcon,
  BellIcon,
  UserIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useThemeContext } from '../context/ThemeContext';
import { useUserContext } from '../context/UserContext';

export default function Settings() {
  const { theme, toggleTheme } = useThemeContext();
  const { userProfile, updateProfile } = useUserContext();
  const [notifications, setNotifications] = useState({
    budgetAlerts: true,
    investmentUpdates: false,
    monthlyReports: true
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: userProfile.name,
    email: userProfile.email
  });

  const exportData = () => {
    const data = {
      investments: JSON.parse(localStorage.getItem('finance_app_investments') || '[]'),
      pacPlans: JSON.parse(localStorage.getItem('finance_app_pac_plans') || '[]'),
      transactions: JSON.parse(localStorage.getItem('finance_app_transactions') || '[]'),
      expenses: JSON.parse(localStorage.getItem('finance_app_expenses') || '[]'),
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finance-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSaveProfile = () => {
    updateProfile(profileForm);
    setIsEditingProfile(false);
  };

  const handleCancelEdit = () => {
    setProfileForm({
      name: userProfile.name,
      email: userProfile.email
    });
    setIsEditingProfile(false);
  };

  const clearAllData = () => {
    if (confirm('⚠️ ATTENZIONE: Questa azione eliminerà TUTTI i tuoi dati (investimenti, PAC, spese, ecc.). Sei sicuro?')) {
      if (confirm('⚠️ ULTIMA CONFERMA: I dati verranno persi per sempre. Procedere?')) {
        localStorage.clear();
        window.location.reload();
      }
    }
  };

  const settingsSections = [
    {
      title: "👤 Profilo Utente",
      settings: [
        {
          name: "Nome Utente",
          description: "Come vuoi essere chiamato dall'AI",
          component: (
            <div className="flex items-center space-x-2">
              {isEditingProfile ? (
                <>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Il tuo nome"
                  />
                  <button 
                    onClick={handleSaveProfile}
                    className="btn-primary py-1 px-3 text-sm"
                  >
                    Salva
                  </button>
                  <button 
                    onClick={handleCancelEdit}
                    className="btn-secondary py-1 px-3 text-sm"
                  >
                    Annulla
                  </button>
                </>
              ) : (
                <>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {userProfile.name}
                  </span>
                  <button 
                    onClick={() => setIsEditingProfile(true)}
                    className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                    title="Modifica nome"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          )
        },
        {
          name: "Email (opzionale)",
          description: "Per notifiche e recupero dati",
          component: (
            <div className="flex items-center space-x-2">
              {isEditingProfile ? (
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="nome@email.com"
                />
              ) : (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {userProfile.email || 'Non impostata'}
                </span>
              )}
            </div>
          )
        }
      ]
    },
    {
      title: "🎨 Aspetto",
      settings: [
        {
          name: "Tema",
          description: "Scegli il tema dell'interfaccia",
          component: (
            <div className="flex space-x-2">
              <button 
                onClick={() => toggleTheme('light')}
                className={`p-2 rounded-lg ${theme === 'light' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
              >
                <SunIcon className="h-5 w-5" />
              </button>
              <button 
                onClick={() => toggleTheme('dark')}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
              >
                <MoonIcon className="h-5 w-5" />
              </button>
              <button 
                onClick={() => toggleTheme('system')}
                className={`p-2 rounded-lg ${theme === 'system' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
              >
                <ComputerDesktopIcon className="h-5 w-5" />
              </button>
            </div>
          )
        }
      ]
    },
    {
      title: "🔔 Notifiche",
      settings: [
        {
          name: "Avvisi Budget",
          description: "Ricevi notifiche quando superi i limiti di budget",
          component: (
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={notifications.budgetAlerts}
                onChange={(e) => setNotifications({...notifications, budgetAlerts: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          )
        },
        {
          name: "Report Mensili",
          description: "Ricevi riassunti mensili delle tue finanze",
          component: (
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={notifications.monthlyReports}
                onChange={(e) => setNotifications({...notifications, monthlyReports: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          )
        }
      ]
    },
    {
      title: "💾 Dati & Backup",
      settings: [
        {
          name: "Esporta Dati",
          description: "Scarica un backup completo dei tuoi dati",
          component: (
            <button 
              onClick={exportData}
              className="btn-primary flex items-center space-x-2"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              <span>Esporta</span>
            </button>
          )
        },
        {
          name: "Cancella Tutto",
          description: "Elimina tutti i dati dall'applicazione",
          component: (
            <button 
              onClick={clearAllData}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center space-x-2"
            >
              <TrashIcon className="h-4 w-4" />
              <span>Elimina Tutto</span>
            </button>
          )
        }
      ]
    },
    {
      title: "🔒 Privacy & Sicurezza",
      settings: [
        {
          name: "Archiviazione Locale",
          description: "I dati sono salvati solo nel tuo browser",
          component: (
            <div className="flex items-center text-green-600">
              <ShieldCheckIcon className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Sicuro</span>
            </div>
          )
        }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Impostazioni
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Configura l'app secondo le tue preferenze
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-8">
        {settingsSections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {section.title}
            </h2>
            <div className="space-y-6">
              {section.settings.map((setting) => (
                <div key={setting.name} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {setting.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {setting.description}
                    </p>
                  </div>
                  <div className="ml-4">
                    {setting.component}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* App Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card text-center"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Finance Dashboard
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Versione 1.0.0 • Sviluppato da Antonio Carbone
        </p>
        <div className="mt-4 flex justify-center space-x-4 text-xs text-gray-400">
          <span>React 19</span>
          <span>•</span>
          <span>Tailwind CSS</span>
          <span>•</span>
          <span>AI-Powered</span>
        </div>
      </motion.div>
    </div>
  );
}