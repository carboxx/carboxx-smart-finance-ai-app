import React from 'react';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export default function Settings() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center py-12">
        <Cog6ToothIcon className="mx-auto h-16 w-16 text-gray-400" />
        <h2 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Impostazioni
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Configura preferenze, tema, notifiche e backup
        </p>
        <div className="mt-6 space-y-4">
          <div className="card max-w-md mx-auto text-left">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Tema
            </h3>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input type="radio" name="theme" value="light" className="mr-2" />
                Chiaro
              </label>
              <label className="flex items-center">
                <input type="radio" name="theme" value="dark" className="mr-2" />
                Scuro
              </label>
              <label className="flex items-center">
                <input type="radio" name="theme" value="auto" className="mr-2" defaultChecked />
                Automatico
              </label>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}