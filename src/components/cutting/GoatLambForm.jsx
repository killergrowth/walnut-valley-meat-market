import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { DollarSign, ChevronRight, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import FormSection from './FormSection';

const thicknessOptions = ['1/2"', '3/4"', '1"'];
const perPackOptions = ['1', '2', '3', '4'];

export default function GoatLambForm({ animalType }) {
  const [quantity, setQuantity] = useState('half');
  const [customerInfo, setCustomerInfo] = useState({ fullName: '', email: '', phone: '' });
  const [sections, setSections] = useState({
    chops: { choice: 'chops', thickness: '3/4"', perPack: '2' },
    shoulder: { choice: 'steaks', thickness: '3/4"', perPack: '2' },
    spareRibs: { choice: 'whole' },
    leg: { choice: 'steaks', thickness: '3/4"', perPack: '2' },
    grind: { packageSize: '1#' },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  
  const animalName = animalType === 'goat' ? 'Goat' : 'Lamb';
  const isWhole = quantity === 'whole';
  const deposit = animalType === 'goat' 
    ? (isWhole ? 150 : 75) 
    : (isWhole ? 200 : 100);

  const updateSection = (section, field, value) => {
    setSections(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const handleSubmit = async () => {
    if (!customerInfo.fullName || !customerInfo.email || !customerInfo.phone) {
      toast.error('Please fill in all customer information fields');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const orderDetails = {
        quantity: isWhole ? `Whole ${animalName}` : `Half ${animalName}`,
        deposit: `$${deposit}`,
        chops: sections.chops,
        shoulder: sections.shoulder,
        spareRibs: sections.spareRibs,
        leg: sections.leg,
        grindPackageSize: sections.grind.packageSize
      };

      await base44.functions.invoke('sendCuttingOrder', {
        animalType,
        customerInfo,
        orderDetails
      });
      
      setShowSuccessDialog(true);
    } catch (error) {
      toast.error('Failed to submit order. Please try again or call us.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <DialogTitle className="text-2xl font-bold text-center">Thank You for Your Order!</DialogTitle>
            <DialogDescription className="text-center text-base pt-2">
              You will be contacted directly by phone within 24 hours for consultation and final pricing.
              <br /><br />
              <span className="font-semibold text-stone-700">Thank you for your business!</span>
            </DialogDescription>
          </DialogHeader>
          <Button 
            onClick={() => setShowSuccessDialog(false)} 
            className="w-full mt-4 bg-red-700 hover:bg-red-800"
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>

      {/* Quantity */}
      <FormSection title="2. Select Quantity" defaultOpen>
        <div className="grid grid-cols-2 gap-3">
          {(animalType === 'goat' ? [
            { id: 'whole', label: 'Whole Goat', weight: '~40 lbs', price: '$6.00/lb' },
            { id: 'half', label: 'Half Goat', weight: '~20 lbs', price: '$6.00/lb' },
          ] : [
            { id: 'whole', label: 'Whole Lamb', weight: '~50 lbs', price: '$7.00/lb' },
            { id: 'half', label: 'Half Lamb', weight: '~25 lbs', price: '$7.00/lb' },
          ]).map((opt) => (
            <button
              key={opt.id}
              onClick={() => setQuantity(opt.id)}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                quantity === opt.id ? 'border-red-600 bg-red-50' : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="font-bold text-stone-900">{opt.label}</div>
              <div className="text-xs text-stone-500">{opt.weight}</div>
              <div className="text-sm font-bold text-red-600">{opt.price}</div>
            </button>
          ))}
        </div>
      </FormSection>

      {/* Customer Info */}
      <FormSection title="3. Your Information" defaultOpen>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label>Full Name *</Label>
            <Input 
              value={customerInfo.fullName}
              onChange={(e) => setCustomerInfo({...customerInfo, fullName: e.target.value})}
              placeholder="John Smith"
            />
          </div>
          <div>
            <Label>Email *</Label>
            <Input 
              type="email"
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
              placeholder="john@email.com"
            />
          </div>
          <div>
            <Label>Phone *</Label>
            <Input 
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
              placeholder="(316) 555-1234"
            />
          </div>
        </div>
      </FormSection>

      {/* Chops */}
      <FormSection title="4. Chops" helpDefinitions={[
        { term: 'Chops', description: 'Individual slices cut across the loin or rib section. Great for grilling, pan-frying, or broiling. You choose the thickness and how many per package.' },
        { term: 'Rack Roast', description: 'The ribs are left connected as a full rack, creating an elegant presentation roast. Perfect for special occasions — often called a "crown roast" when two are combined.' },
        { term: 'Grind', description: 'The meat from this section is added to your ground total.' },
      ]} hint="Chops are great for grilling. Rack roast is elegant for special occasions.">
        <RadioGroup value={sections.chops.choice} onValueChange={(v) => updateSection('chops', 'choice', v)}>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="chops" id="chops-chops" />
              <Label htmlFor="chops-chops">Chops</Label>
            </div>
            {sections.chops.choice === 'chops' && (
              <div className="ml-6 grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Thickness</Label>
                  <Select value={sections.chops.thickness} onValueChange={(v) => updateSection('chops', 'thickness', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {thicknessOptions.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Per Pack</Label>
                  <Select value={sections.chops.perPack} onValueChange={(v) => updateSection('chops', 'perPack', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {perPackOptions.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="rack" id="chops-rack" />
              <Label htmlFor="chops-rack">Rack Roast</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="grind" id="chops-grind" />
              <Label htmlFor="chops-grind">Grind</Label>
            </div>
          </div>
        </RadioGroup>
      </FormSection>

      {/* Shoulder */}
      <FormSection title="5. Shoulder" helpDefinitions={[
        { term: 'Cut Into Steaks', description: 'The shoulder is sliced into steaks. Flavorful but has more connective tissue — best braised or grilled over medium-low heat.' },
        { term: 'Leave Whole', description: 'The shoulder is kept as a large roast. Great for slow-roasting, braising, or smoking until fall-off-the-bone tender.' },
        { term: 'Put Into Grind', description: 'Shoulder meat is added to your ground total. The higher fat content from the shoulder makes for very flavorful ground meat.' },
      ]} hint="Best for slow cooking, braising, or stews. Very flavorful.">
        <RadioGroup value={sections.shoulder.choice} onValueChange={(v) => updateSection('shoulder', 'choice', v)}>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="steaks" id="shoulder-steaks" />
              <Label htmlFor="shoulder-steaks">Cut Into Steaks</Label>
            </div>
            {sections.shoulder.choice === 'steaks' && (
              <div className="ml-6 grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Thickness</Label>
                  <Select value={sections.shoulder.thickness} onValueChange={(v) => updateSection('shoulder', 'thickness', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {thicknessOptions.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Per Pack</Label>
                  <Select value={sections.shoulder.perPack} onValueChange={(v) => updateSection('shoulder', 'perPack', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {perPackOptions.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="whole" id="shoulder-whole" />
              <Label htmlFor="shoulder-whole">Leave Whole</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="grind" id="shoulder-grind" />
              <Label htmlFor="shoulder-grind">Put Into Grind</Label>
            </div>
          </div>
        </RadioGroup>
      </FormSection>

      {/* Spare Ribs */}
      <FormSection title="6. Spare Ribs" helpDefinitions={[
        { term: 'Leave Whole', description: 'The full rack of ribs kept intact. Great for smoking or grilling whole, and makes an impressive presentation.' },
        { term: 'Cut in Half', description: 'Each rack is cut into two smaller portions. Easier to store and great for smaller gatherings.' },
        { term: 'Put Into Grind', description: 'The rib meat is trimmed off and added to your ground total.' },
      ]} hint="Great for grilling or braising with Mediterranean flavors.">
        <RadioGroup value={sections.spareRibs.choice} onValueChange={(v) => updateSection('spareRibs', 'choice', v)}>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="whole" id="ribs-whole" />
              <Label htmlFor="ribs-whole">Leave Whole</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="half" id="ribs-half" />
              <Label htmlFor="ribs-half">Cut in Half</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="grind" id="ribs-grind" />
              <Label htmlFor="ribs-grind">Put Into Grind</Label>
            </div>
          </div>
        </RadioGroup>
      </FormSection>

      {/* Leg */}
      <FormSection title="7. Leg" helpDefinitions={[
        { term: 'Steaks', description: 'The leg is sliced into individual steaks. Great for grilling, pan-frying, or marinating. Lean and flavorful.' },
        { term: 'Whole', description: 'The entire leg kept as one large roast. A classic centerpiece for holidays or gatherings. Can be bone-in or boneless — ask us at pickup.' },
        { term: 'Half', description: 'The leg is split into two smaller pieces. Easier to handle and still great for roasting or slow-cooking.' },
        { term: 'Grind', description: 'Leg meat is added to your ground total. Leg is very lean, producing a low-fat ground meat.' },
      ]} hint="Leg roast is a classic centerpiece. Steaks are great for quick meals.">
        <RadioGroup value={sections.leg.choice} onValueChange={(v) => updateSection('leg', 'choice', v)}>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="steaks" id="leg-steaks" />
              <Label htmlFor="leg-steaks">Steaks</Label>
            </div>
            {sections.leg.choice === 'steaks' && (
              <div className="ml-6 grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Thickness</Label>
                  <Select value={sections.leg.thickness} onValueChange={(v) => updateSection('leg', 'thickness', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {thicknessOptions.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Per Pack</Label>
                  <Select value={sections.leg.perPack} onValueChange={(v) => updateSection('leg', 'perPack', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {perPackOptions.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="whole" id="leg-whole" />
              <Label htmlFor="leg-whole">Whole</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="half" id="leg-half" />
              <Label htmlFor="leg-half">Half</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="grind" id="leg-grind" />
              <Label htmlFor="leg-grind">Grind</Label>
            </div>
          </div>
        </RadioGroup>
      </FormSection>

      {/* Grind Package Size */}
      <FormSection title="8. Ground Meat Package Size" helpDefinitions={[
        { term: '1# Packages', description: 'Each package contains 1 pound of ground meat. Good for smaller households or single recipes.' },
        { term: '2# Packages', description: 'Each package contains 2 pounds of ground meat. More convenient for larger families or batch cooking.' },
      ]} hint="1# is perfect for single meals. 2# works well for larger families.">
        <RadioGroup value={sections.grind.packageSize} onValueChange={(v) => updateSection('grind', 'packageSize', v)}>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1#" id="grind-1" />
              <Label htmlFor="grind-1">1# Packages</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2#" id="grind-2" />
              <Label htmlFor="grind-2">2# Packages</Label>
            </div>
          </div>
        </RadioGroup>
      </FormSection>

      {/* Budget Helper Reminder */}
      <button
        onClick={() => window.dispatchEvent(new CustomEvent('openBudgetHelper'))}
        className="w-full bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl p-4 flex items-center justify-between transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-green-700" />
          </div>
          <div className="text-left">
            <div className="font-bold text-green-800">Need help with your budget?</div>
            <div className="text-green-600 text-sm">See estimated costs & freezer space</div>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-green-600" />
      </button>

      {/* Submit */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-stone-600">Required Deposit</div>
            <div className="text-3xl font-black text-red-700">${deposit.toLocaleString()}</div>
            <div className="text-xs text-stone-500">Applied to final balance at pickup</div>
          </div>
        </div>
        <Button 
          className="w-full bg-red-700 hover:bg-red-800 text-lg py-6"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Submitting...</> : `Submit ${animalName} Order`}
        </Button>
      </div>
    </div>
  );
}