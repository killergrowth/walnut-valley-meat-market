import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Info } from 'lucide-react';

export default function StepHelpDialog({ open, onClose, title, definitions, tip }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-chunkfive text-xl text-stone-900">{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 pt-1">
          {definitions.map((def, i) => (
            <div key={i} className="border border-stone-200 rounded-lg p-3">
              <div className="font-bold text-stone-900 text-sm">{def.term}</div>
              <div className="text-stone-600 text-sm mt-0.5">{def.description}</div>
            </div>
          ))}
          {tip && (
            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg mt-4">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800">{tip}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}