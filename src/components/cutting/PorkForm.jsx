import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { DollarSign, ChevronRight, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import FormSection from './FormSection';

const thicknessOptions = ['1/2"', '3/4"', '1"'];
const perPackOptions = ['1', '2', '3', '4'];

export default function PorkForm() {
  const [quantity, setQuantity] = useState('half');
  const [customerInfo, setCustomerInfo] = useState({ fullName: '', email: '', phone: '' });
  const [sections, setSections] = useState({
    loin: { choices: ['chops'], thickness: '3/4"', perPack: '2' },
    shoulder: { choices: ['steaks'], thickness: '3/4"', perPack: '2' },
    roast: { choices: ['save'] },
    spareRibs: { choices: ['whole'] },
    belly: { choices: ['bacon'] },
    ham: { choices: ['cure'] },
    hamOptions: { choices: ['whole'], thickness: '3/4"', perPack: '2' },
    hamHocks: { choices: ['cure'] },
    grind: { choices: ['ground'], sausageLevel: 'mild' },
  });

  const [pickupLocation, setPickupLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ fullName: false, email: false, phone: false, pickupLocation: false });
  
  const isWhole = quantity === 'whole';
  const maxOptions = isWhole ? 2 : 1;
  const deposit = isWhole ? 200 : 100;

  const updateSection = (section, field, value) => {
    setSections(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const toggleChoice = (section, choice) => {
    setSections(prev => {
      const currentChoices = prev[section].choices || [];
      let newChoices;
      
      if (currentChoices.includes(choice)) {
        // Remove if already selected (but keep at least one)
        newChoices = currentChoices.filter(c => c !== choice);
        if (newChoices.length === 0) newChoices = [choice];
      } else {
        // Add if not at max
        if (isWhole && currentChoices.length < 2) {
          newChoices = [...currentChoices, choice];
        } else if (!isWhole) {
          newChoices = [choice];
        } else {
          // At max for whole, replace oldest
          newChoices = [currentChoices[1] || currentChoices[0], choice];
        }
      }
      
      return { ...prev, [section]: { ...prev[section], choices: newChoices } };
    });
  };

  const isChoiceSelected = (section, choice) => {
    return sections[section].choices?.includes(choice) || false;
  };

  const renderChoiceItem = (section, value, label, id) => {
    const selected = isChoiceSelected(section, value);
    
    if (isWhole) {
      return (
        <div className="flex items-center space-x-2">
          <Checkbox 
            id={id} 
            checked={selected}
            onCheckedChange={() => toggleChoice(section, value)}
          />
          <Label htmlFor={id} className="cursor-pointer">{label}</Label>
        </div>
      );
    }
    
    return (
      <div className="flex items-center space-x-2">
        <RadioGroupItem value={value} id={id} />
        <Label htmlFor={id}>{label}</Label>
      </div>
    );
  };

  const renderSectionWrapper = (section, children) => {
    if (isWhole) {
      return <div className="space-y-3">{children}</div>;
    }
    return (
      <RadioGroup 
        value={sections[section].choices?.[0] || ''} 
        onValueChange={(v) => updateSection(section, 'choices', [v])}
      >
        <div className="space-y-3">{children}</div>
      </RadioGroup>
    );
  };

  const handleSubmit = async () => {
    const errors = {
      fullName: !customerInfo.fullName,
      email: !customerInfo.email,
      phone: !customerInfo.phone,
      pickupLocation: !pickupLocation,
    };
    setFieldErrors(errors);
    if (errors.fullName || errors.email || errors.phone || errors.pickupLocation) {
      const firstErrorField = errors.fullName ? 'pork-fullName' : errors.email ? 'pork-email' : errors.phone ? 'pork-phone' : 'pork-pickup';
      const el = document.getElementById(firstErrorField);
      if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.focus(); }
      return;
    }
    
    setIsSubmitting(true);
    try {
      const hamOptLabel = sections.hamOptions.choices.map(c => {
        if (c === 'whole') return 'Leave Whole';
        if (c === 'half') return 'Cut in Half';
        if (c === 'center') return `Center Cut (ham steaks + 2 small roasts) — ${sections.hamOptions.thickness} thick, ${sections.hamOptions.perPack}/pack`;
        if (c === 'steaks') return `All Ham Steaks — ${sections.hamOptions.thickness} thick, ${sections.hamOptions.perPack}/pack`;
        return c;
      }).join(' & ');

      const orderDetails = {
        'Quantity': isWhole ? 'Whole Hog' : 'Half Hog',
        'Pickup Location': pickupLocation,
        'Deposit': `$${deposit}`,
        'Pork Loin': sections.loin.choices.map(c => c === 'chops' ? `Pork Chops — ${sections.loin.thickness} thick, ${sections.loin.perPack}/pack` : 'Put Into Grind').join(' & '),
        'Pork Shoulder': sections.shoulder.choices.map(c => c === 'steaks' ? `Cut Into Steaks — ${sections.shoulder.thickness} thick, ${sections.shoulder.perPack}/pack` : c === 'whole' ? 'Leave Whole (for pulled pork)' : 'Put Into Grind').join(' & '),
        'Spare Ribs': sections.spareRibs.choices.map(c => c === 'whole' ? 'Leave Whole' : c === 'half' ? 'Cut in Half' : 'Put Into Grind').join(' & '),
        'Pork Belly': sections.belly.choices.map(c => c === 'bacon' ? 'Cure for Bacon' : c === 'fresh' ? 'Do Not Cure (Fresh Side)' : 'Put Into Grind').join(' & '),
        'Ham': sections.ham.choices.map(c => c === 'cure' ? 'Cure (Traditional Ham)' : c === 'fresh' ? 'Do Not Cure (Fresh Pork Roast)' : 'Put Into Grind').join(' & '),
        'Ham Cut Options': hamOptLabel,
        'Ground Pork Options': sections.grind.choices.map(c => c === 'ground' ? 'Ground Pork (1# or 2# packages)' : `Breakfast Sausage — ${sections.grind.sausageLevel}`).join(' & '),
      };

      await base44.functions.invoke('sendCuttingOrder', {
        animalType: 'pork',
        customerInfo,
        orderDetails
      });

      base44.analytics.track({
        eventName: 'order_submitted',
        properties: {
          meat_type: 'pork',
          quantity: quantity,
        }
      });

      const depositLinks = {
        whole: 'https://pay.smrtpayments.com/wvp/hog-whole',
        half: 'https://pay.smrtpayments.com/wvp/hog-half',
      };
      window.location.href = depositLinks[quantity];
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
          {[
            { id: 'whole', label: 'Whole Hog', hangingWeight: 200, price: '$3.50/lb', takeHome: 130, freezer: '6-8 cu ft', deposit: 200, estTotal: 700, note: 'May choose 2 options per section' },
            { id: 'half', label: 'Half Hog', hangingWeight: 100, price: '$3.75/lb', takeHome: 65, freezer: '3-4 cu ft', deposit: 100, estTotal: 375, note: 'May choose 1 option per section' },
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setQuantity(opt.id)}
              className={`p-3 rounded-xl border-2 text-center transition-all ${
                quantity === opt.id ? 'border-red-600 bg-red-50' : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="font-bold text-stone-900 text-base">{opt.label}</div>
              <div className="text-xs text-stone-500">~{opt.hangingWeight} lbs hanging</div>
              <div className="text-sm font-bold text-red-600 mt-1">{opt.price}</div>
              <div className="border-t border-stone-200 mt-2 pt-2 space-y-0.5">
                <div className="text-xs text-blue-700 font-medium">~{opt.takeHome} lbs take-home</div>
                <div className="text-xs text-cyan-700">❄ {opt.freezer}</div>
                <div className="text-xs text-stone-500">Est. ~${opt.estTotal.toLocaleString()}</div>
              </div>
              <div className="text-xs text-stone-400 mt-1 italic">{opt.note}</div>
            </button>
          ))}
        </div>
      </FormSection>

      {/* Customer Info */}
      <FormSection title="3. Your Information" defaultOpen>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label className={fieldErrors.fullName ? 'text-red-600' : ''}>Full Name *</Label>
            <Input
              id="pork-fullName"
              value={customerInfo.fullName}
              onChange={(e) => { setCustomerInfo({...customerInfo, fullName: e.target.value}); setFieldErrors(p => ({...p, fullName: false})); }}
              placeholder="John Smith"
              className={fieldErrors.fullName ? 'border-red-500 ring-1 ring-red-500' : ''}
            />
            {fieldErrors.fullName && <p className="text-xs text-red-600 mt-1">Required</p>}
          </div>
          <div>
            <Label className={fieldErrors.email ? 'text-red-600' : ''}>Email *</Label>
            <Input
              id="pork-email"
              type="email"
              value={customerInfo.email}
              onChange={(e) => { setCustomerInfo({...customerInfo, email: e.target.value}); setFieldErrors(p => ({...p, email: false})); }}
              placeholder="john@email.com"
              className={fieldErrors.email ? 'border-red-500 ring-1 ring-red-500' : ''}
            />
            {fieldErrors.email && <p className="text-xs text-red-600 mt-1">Required</p>}
          </div>
          <div>
            <Label className={fieldErrors.phone ? 'text-red-600' : ''}>Phone *</Label>
            <Input
              id="pork-phone"
              value={customerInfo.phone}
              onChange={(e) => { setCustomerInfo({...customerInfo, phone: e.target.value}); setFieldErrors(p => ({...p, phone: false})); }}
              placeholder="(316) 555-1234"
              className={fieldErrors.phone ? 'border-red-500 ring-1 ring-red-500' : ''}
            />
            {fieldErrors.phone && <p className="text-xs text-red-600 mt-1">Required</p>}
          </div>
        </div>
        <div className="mt-4">
          <Label className={fieldErrors.pickupLocation ? 'text-red-600' : ''}>Pickup Location *</Label>
          <Select
            value={pickupLocation}
            onValueChange={(v) => { setPickupLocation(v); setFieldErrors(p => ({...p, pickupLocation: false})); }}
          >
            <SelectTrigger id="pork-pickup" className={fieldErrors.pickupLocation ? 'border-red-500 ring-1 ring-red-500' : ''}>
              <SelectValue placeholder="Select a location..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="El Dorado — 1000 S. Main St., El Dorado, KS 67042">El Dorado — 1000 S. Main St.</SelectItem>
              <SelectItem value="Andover — 620 N. Andover Rd., Andover, KS 67002">Andover — 620 N. Andover Rd.</SelectItem>
              <SelectItem value="Augusta — 293 7th St., Augusta, KS 67010">Augusta — 293 7th St.</SelectItem>
            </SelectContent>
          </Select>
          {fieldErrors.pickupLocation && <p className="text-xs text-red-600 mt-1">Required</p>}
        </div>
      </FormSection>

      {/* Pork Loin */}
      <FormSection title="4. Pork Loin" helpDefinitions={[
        { term: 'Pork Chops', description: 'Bone-in or boneless slices cut across the loin. The most popular option — great for grilling, pan-frying, or baking. You choose thickness and how many per package.' },
        { term: 'Put Into Grind', description: 'Loin meat is added to your ground pork or sausage. Produces a lean ground pork.' },
      ]} hint={`Lean, tender meat. Perfect for chops, roasts, or grilling.${isWhole ? ' (Select up to 2)' : ''}`}>
        {renderSectionWrapper('loin', <>
          {renderChoiceItem('loin', 'chops', 'Pork Chops', 'loin-chops')}
          {isChoiceSelected('loin', 'chops') && (
            <div className="ml-6 grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Thickness</Label>
                <Select value={sections.loin.thickness} onValueChange={(v) => updateSection('loin', 'thickness', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {thicknessOptions.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Per Pack</Label>
                <Select value={sections.loin.perPack} onValueChange={(v) => updateSection('loin', 'perPack', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {perPackOptions.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          {renderChoiceItem('loin', 'grind', 'Put Into Grind', 'loin-grind')}
        </>)}
      </FormSection>

      {/* Pork Shoulder */}
      <FormSection title="5. Pork Shoulder" helpDefinitions={[
        { term: 'Cut Into Steaks', description: 'The shoulder is sliced into steaks. Shoulder steaks are flavorful and great for grilling or braising, though they have more connective tissue than loin chops.' },
        { term: 'Leave Whole (for pulled pork)', description: 'The shoulder is kept as a large roast. The classic choice for slow-smoking or slow-cooking into pulled pork. Usually 6–10 lbs.' },
        { term: 'Put Into Grind', description: 'Shoulder meat is added to your ground pork. Shoulder has good fat content, making it excellent for sausage or flavorful ground pork.' },
      ]} hint={`Leave whole for pulled pork.${isWhole ? ' (Select up to 2)' : ''}`}>
        {renderSectionWrapper('shoulder', <>
          {renderChoiceItem('shoulder', 'steaks', 'Cut Into Steaks', 'shoulder-steaks')}
          {isChoiceSelected('shoulder', 'steaks') && (
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
                <Label className="text-xs">Per Package</Label>
                <Select value={sections.shoulder.perPack} onValueChange={(v) => updateSection('shoulder', 'perPack', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {perPackOptions.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          {renderChoiceItem('shoulder', 'whole', 'Leave Whole (for pulled pork)', 'shoulder-whole')}
          {renderChoiceItem('shoulder', 'grind', 'Put Into Grind', 'shoulder-grind')}
        </>)}
      </FormSection>

      {/* Spare Ribs */}
      <FormSection title="6. Spare Ribs" helpDefinitions={[
        { term: 'Leave Whole', description: 'Full rack of spare ribs kept intact. The classic choice for smoking or BBQ. A full rack is typically enough for 2–3 people.' },
        { term: 'Cut in Half', description: 'Each rack is cut into two half-racks. Easier to store and fits better in smaller smokers or ovens.' },
        { term: 'Put Into Grind', description: 'The rib meat is trimmed off and added to your ground pork.' },
      ]} hint={`Classic BBQ favorite. Best smoked low and slow.${isWhole ? ' (Select up to 2)' : ''}`}>
        {renderSectionWrapper('spareRibs', <>
          {renderChoiceItem('spareRibs', 'whole', 'Leave Whole', 'ribs-whole')}
          {renderChoiceItem('spareRibs', 'half', 'Cut in Half', 'ribs-half')}
          {renderChoiceItem('spareRibs', 'grind', 'Put Into Grind', 'ribs-grind')}
        </>)}
      </FormSection>

      {/* Pork Belly */}
      <FormSection title="7. Pork Belly" helpDefinitions={[
        { term: 'Cure for Bacon', description: 'The belly is salt-cured and smoked to make traditional bacon. This is where bacon comes from — sliced and packaged just like store-bought bacon, but from your own animal.' },
        { term: 'Do Not Cure (Fresh Side)', description: 'The belly is packaged fresh without curing. Great for braising, making pork belly buns, or cooking low and slow. Rich, fatty, and very flavorful.' },
        { term: 'Put Into Grind', description: 'Belly meat is added to your ground pork. Adds significant fat content — great for rich sausage blends.' },
      ]} hint={`Cure it for delicious homemade bacon, or keep fresh for braising.${isWhole ? ' (Select up to 2)' : ''}`}>
        {renderSectionWrapper('belly', <>
          {renderChoiceItem('belly', 'bacon', 'Cure for Bacon', 'belly-bacon')}
          {renderChoiceItem('belly', 'fresh', 'Do Not Cure (Fresh Side)', 'belly-fresh')}
          {renderChoiceItem('belly', 'grind', 'Put Into Grind', 'belly-grind')}
        </>)}
      </FormSection>

      {/* Ham */}
      <FormSection title="8. Ham" helpDefinitions={[
        { term: 'Cure (Traditional Ham)', description: 'The ham is salt-cured and smoked, just like a traditional holiday ham. Ready to heat and serve or glaze. This is the classic Easter or Christmas ham.' },
        { term: 'Do Not Cure (Fresh Pork Roast)', description: 'The ham is kept fresh and unprocessed — essentially a very large pork roast. You cook it yourself however you like: roasted, slow-cooked, etc.' },
        { term: 'Put Into Grind', description: 'Ham meat is added to your ground pork total.' },
      ]} hint={`Cured ham is holiday-ready. Fresh ham is like a large pork roast.${isWhole ? ' (Select up to 2)' : ''}`}>
        {renderSectionWrapper('ham', <>
          {renderChoiceItem('ham', 'cure', 'Cure (Traditional Ham)', 'ham-cure')}
          {renderChoiceItem('ham', 'fresh', 'Do Not Cure (Fresh Pork Roast)', 'ham-fresh')}
          {renderChoiceItem('ham', 'grind', 'Put Into Grind', 'ham-grind')}
        </>)}
      </FormSection>

      {/* Ham Options */}
      <FormSection title="9. Ham Cut Options" helpDefinitions={[
        { term: 'Leave Whole (if possible)', description: 'The ham is kept in one large piece. Best for large gatherings or presentations. May be split if it\'s too large for packaging.' },
        { term: 'Cut in Half', description: 'The ham is cut into two pieces. Easier to store and still great for smaller gatherings or holiday meals.' },
        { term: 'Center Cut (ham steaks + 2 small roasts)', description: 'The center is sliced into ham steaks, leaving two smaller roasts on each end. Great if you want both quick-cooking steaks and roasts from the same ham.' },
        { term: 'All Ham Steaks', description: 'The entire ham is sliced into individual steaks. Great for quick weeknight meals — ham steaks cook in minutes on a skillet or grill.' },
      ]} hint={`Whole is great for large gatherings. Steaks cook quickly.${isWhole ? ' (Select up to 2)' : ''}`}>
        {renderSectionWrapper('hamOptions', <>
          {renderChoiceItem('hamOptions', 'whole', 'Leave Whole (if possible)', 'hamopt-whole')}
          {renderChoiceItem('hamOptions', 'half', 'Cut in Half', 'hamopt-half')}
          {renderChoiceItem('hamOptions', 'center', 'Center Cut (ham steaks + 2 small roasts)', 'hamopt-center')}
          {renderChoiceItem('hamOptions', 'steaks', 'All Ham Steaks', 'hamopt-steaks')}
          {(isChoiceSelected('hamOptions', 'center') || isChoiceSelected('hamOptions', 'steaks')) && (
            <div className="ml-6 grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Thickness</Label>
                <Select value={sections.hamOptions.thickness} onValueChange={(v) => updateSection('hamOptions', 'thickness', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {thicknessOptions.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Per Pack</Label>
                <Select value={sections.hamOptions.perPack} onValueChange={(v) => updateSection('hamOptions', 'perPack', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {perPackOptions.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </>)}
      </FormSection>

      {/* Grind Options */}
      <FormSection title="10. Ground Pork Options" helpDefinitions={[
        { term: 'Ground Pork', description: 'Plain unseasoned ground pork, packaged in 1 lb or 2 lb packages. Use in meatballs, dumplings, stir fry, meat sauces, or any recipe calling for ground pork.' },
        { term: 'Breakfast Sausage', description: 'Ground pork seasoned with a traditional breakfast sausage blend (sage, pepper, and spices). Choose your heat level — mild, medium (spicy), or hot. Great for morning patties or crumbles.' },
      ]} hint={`Ground pork is versatile. Breakfast sausage adds seasoning.${isWhole ? ' (Select up to 2)' : ''}`}>
        {renderSectionWrapper('grind', <>
          {renderChoiceItem('grind', 'ground', 'Ground Pork (1# or 2# packages)', 'grind-plain')}
          {renderChoiceItem('grind', 'sausage', 'Breakfast Sausage', 'grind-sausage')}
          {isChoiceSelected('grind', 'sausage') && (
            <div className="ml-6">
              <Label className="text-xs">Spice Level</Label>
              <Select value={sections.grind.sausageLevel} onValueChange={(v) => updateSection('grind', 'sausageLevel', v)}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="mild">Mild</SelectItem>
                  <SelectItem value="medium">Spicy (Medium)</SelectItem>
                  <SelectItem value="hot">Hot</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </>)}
      </FormSection>

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
          {isSubmitting ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Submitting...</> : 'Submit Pork Order'}
        </Button>
      </div>
    </div>
  );
}