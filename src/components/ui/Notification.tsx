import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

interface NotificationContextType {
  showNotification: (message: string, type?: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((message: string, type: NotificationType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[300] flex flex-col gap-3 pointer-events-none w-full max-w-md px-6 items-center">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } }}
              className="pointer-events-auto w-full flex justify-center"
            >
              <div className={`
                w-full p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] backdrop-blur-md border flex items-center gap-4
                ${n.type === 'success' ? 'bg-emerald-50/95 border-emerald-100 text-emerald-900' :
                  n.type === 'error' ? 'bg-rose-50/95 border-rose-100 text-rose-900' :
                    n.type === 'warning' ? 'bg-amber-50/95 border-amber-100 text-amber-900' :
                      'bg-blue-50/95 border-blue-100 text-blue-900'}
              `}>
                <div className={`
                  shrink-0 p-2 rounded-xl
                  ${n.type === 'success' ? 'bg-emerald-500/10 text-emerald-600' :
                    n.type === 'error' ? 'bg-rose-500/10 text-rose-600' :
                      n.type === 'warning' ? 'bg-amber-500/10 text-amber-600' :
                        'bg-blue-500/10 text-blue-600'}
                `}>
                  {n.type === 'success' && <CheckCircle size={20} />}
                  {n.type === 'error' && <AlertCircle size={20} />}
                  {n.type === 'warning' && <AlertTriangle size={20} />}
                  {n.type === 'info' && <Info size={20} />}
                </div>

                <div className="flex-1 text-center">
                  <p className="text-sm font-bold leading-tight">{n.message}</p>
                </div>

                <button
                  onClick={() => removeNotification(n.id)}
                  className="shrink-0 p-1 hover:bg-black/5 rounded-lg transition-all opacity-40 hover:opacity-100"
                >
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};
