import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StepHelpDialog from './StepHelpDialog';

export default function FormSection({ title, hint, helpDefinitions, helpTitle, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-stone-50 transition-colors"
      >
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-bold text-stone-800">{title}</span>
          {helpDefinitions && (
            <button
              onClick={(e) => { e.stopPropagation(); setHelpOpen(true); }}
              className="text-xs font-semibold text-red-700 hover:text-red-900 underline underline-offset-2 bg-transparent border-none p-0 cursor-pointer"
            >
              Help me with this step
            </button>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-stone-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-stone-400 flex-shrink-0" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-5 pb-5">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {helpDefinitions && (
        <StepHelpDialog
          open={helpOpen}
          onClose={() => setHelpOpen(false)}
          title={helpTitle || title}
          definitions={helpDefinitions}
          tip={hint}
        />
      )}
    </div>
  );
}