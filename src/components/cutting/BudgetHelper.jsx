import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DollarSign, Scale, Snowflake, Info } from 'lucide-react';

const animalData = {
  beef: {
    name: 'Beef',
    emoji: '🐄',
    sizes: ['whole', 'half', 'quarter'],
    sizeLabels: { whole: 'Whole', half: 'Half', quarter: 'Quarter' },
    pricing: {
      whole: { pricePerLb: 5.50, avgWeight: 700, deposit: 1200, freezerSpace: '14-18 cu ft' },
      half: { pricePerLb: 5.50, avgWeight: 350, deposit: 600, freezerSpace: '8-10 cu ft' },
      quarter: { pricePerLb: 5.75, avgWeight: 175, deposit: 300, freezerSpace: '4-6 cu ft' },
    },
    takeHomePercent: 0.6,
  },
  pork: {
    name: 'Pork',
    emoji: '🐷',
    sizes: ['whole', 'half'],
    sizeLabels: { whole: 'Whole Hog', half: 'Half Hog' },
    pricing: {
      whole: { pricePerLb: 4.00, avgWeight: 200, deposit: 400, freezerSpace: '6-8 cu ft' },
      half: { pricePerLb: 4.25, avgWeight: 100, deposit: 200, freezerSpace: '3-4 cu ft' },
    },
    takeHomePercent: 0.65,
  },
};

export default function BudgetHelper({ open, onClose }) {
  const [selectedAnimal, setSelectedAnimal] = useState('beef');
  const [selectedSize, setSelectedSize] = useState('half');

  const animal = animalData[selectedAnimal];
  const validSize = animal.sizes.includes(selectedSize) ? selectedSize : animal.sizes[0];
  const pricing = animal.pricing[validSize];
  const estimatedTotal = pricing.pricePerLb * pricing.avgWeight;
  const takeHome = Math.round(pricing.avgWeight * animal.takeHomePercent);

  // Reset size when changing animal if current size isn't valid
  React.useEffect(() => {
    if (!animal.sizes.includes(selectedSize)) {
      setSelectedSize(animal.sizes[0]);
    }
  }, [selectedAnimal]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-red-600" />
            Budget Helper
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Animal Selector */}
          <div>
            <label className="text-sm font-medium text-stone-700 mb-2 block">Select Animal</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(animalData).map(([key, data]) => (
                <button
                  key={key}
                  onClick={() => setSelectedAnimal(key)}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    selectedAnimal === key
                      ? 'border-red-600 bg-red-50'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{data.emoji}</div>
                  <div className="font-bold text-sm">{data.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div>
            <label className="text-sm font-medium text-stone-700 mb-2 block">Select Size</label>
            <div className={`grid gap-2 ${animal.sizes.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
              {animal.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    validSize === size
                      ? 'border-red-600 bg-red-50'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="font-bold">{animal.sizeLabels[size]}</div>
                  <div className="text-xs text-stone-500">~{animal.pricing[size].avgWeight} lbs</div>
                </button>
              ))}
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="bg-stone-50 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-stone-600">Price per lb (hanging weight)</span>
              <span className="font-bold">${pricing.pricePerLb.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-600">Avg hanging weight</span>
              <span className="font-bold">~{pricing.avgWeight} lbs</span>
            </div>
            <div className="border-t border-stone-200 pt-3 flex justify-between items-center">
              <span className="text-stone-800 font-medium">Estimated Total</span>
              <span className="text-xl font-black text-red-700">${estimatedTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-blue-700 mb-1">
                <Scale className="w-4 h-4" />
                <span className="text-sm font-medium">Take-Home</span>
              </div>
              <div className="text-lg font-bold text-blue-900">~{takeHome} lbs</div>
              <div className="text-xs text-blue-600">~{Math.round(animal.takeHomePercent * 100)}% of hanging weight</div>
            </div>
            <div className="bg-cyan-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-cyan-700 mb-1">
                <Snowflake className="w-4 h-4" />
                <span className="text-sm font-medium">Freezer Space</span>
              </div>
              <div className="text-lg font-bold text-cyan-900">{pricing.freezerSpace}</div>
              <div className="text-xs text-cyan-600">Recommended</div>
            </div>
          </div>

          {/* Deposit Info */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 mt-0.5" />
              <div className="text-sm text-amber-800">
                <strong>Deposit Required:</strong> ${pricing.deposit.toLocaleString()} (applied to final balance at pickup)
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="text-sm text-stone-600 space-y-2">
            <p><strong>What's included?</strong> Purchase of local livestock, dry aging, processing, and packaging.</p>
            <p><strong>Processing time:</strong> 2-4 weeks depending on inventory and dry aging.</p>
          </div>

          <Button onClick={onClose} className="w-full bg-red-700 hover:bg-red-800">
            Got It
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}