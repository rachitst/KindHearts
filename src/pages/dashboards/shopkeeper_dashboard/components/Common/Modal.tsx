import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxWidth = 'max-w-4xl' 
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with modern blur effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
            onClick={onClose}
            style={{ marginTop: 0 }}
          />

          {/* Modal Container */}
          <motion.div 
            className="fixed inset-0 z-[9999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="min-h-screen flex items-center justify-center p-4">
              {/* Modal Content */}
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                transition={{ 
                  duration: 0.3,
                  type: "spring",
                  stiffness: 300,
                  damping: 25
                }}
                className={`
                  w-full ${maxWidth} bg-gradient-to-b from-white via-white to-gray-50
                  rounded-2xl overflow-hidden relative shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]
                  border border-gray-100
                `}
                onClick={e => e.stopPropagation()}
              >
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-b from-blue-500/10 to-transparent rounded-bl-full" />

                {/* Header */}
                <div className="relative px-8 py-6 border-b border-gray-100 bg-white">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <h2 className="text-2xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        {title}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Please fill in all the required information below
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200 group"
                    >
                      <X 
                        size={20} 
                        className="text-gray-400 group-hover:text-gray-600 transition-colors" 
                      />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="max-h-[calc(90vh-8rem)] overflow-y-auto">
                  <div className="p-8 bg-gradient-to-b from-white to-gray-50/50">
                    {children}
                  </div>
                </div>

                {/* Bottom Decoration */}
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal; 