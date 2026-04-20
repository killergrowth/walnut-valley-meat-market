import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import FormSection from './FormSection';

const WORKER_URL = 'https://walnut-valley-order.notifications-27c.workers.dev';
const thicknessOptions = ['1/2"', '3/4"', '1"'];
const perPackOptions = ['1', '2', '3', '4'];

export default function PorkForm() {
  const [quantity, setQuantity] = useState('half');
  const [customerInfo, setCustomerInfo] = useState({ fullName: '', email: '', phone: '' });
  const [sections, setSections] = useState({
    loin:       { choices: ['chops'],   thickness: '3/4"', perPack: '2' },
    shoulder:   { choices: ['steaks'],  thickness: '3/4"', perPack: '2' },
    roast:      { choices: ['save'] },
    spareRibs:  { choices: ['whole'] },
    belly:      { choices: ['bacon'] },
    ham:        { choices: ['cure'] },
    hamOptions: { choices: ['whole'],  thickness: '3/4"', perPack: '2' },
    hamHocks:   { choices: ['cure'] },
    grind:      { choices: ['ground'], sausageLevel: 'mild', packageSize: '1 lb' },
  });
  const [pickupLocation, setPickupLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ fullName: false, email: false, phone: false, pickupLocation: false });

  const isWhole  = quantity === 'whole';
  const deposit  = isWhole ? 200 : 100;

  const updateSection = (section, field, value) =>
    setSections(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));

  const toggleChoice = (section, choice) => {
    setSections(prev => {
      const current = prev[section].choices || [];
      let next;
      if (current.includes(choice)) {
        next = current.filter(c => c !== choice);
        if (next.length === 0) next = [choice];
      } else if (isWhole && current.length < 2) {
        next = [...current, choice];
      } else if (!isWhole) {
        next = [choice];
      } else {
        next = [current[1] || current[0], choice];
      }
      return { ...prev, [section]: { ...prev[section], choices: next } };
    });
  };

  const isSel = (section, choice) => sections[section]?.choices?.includes(choice) || false;

  const renderChoiceItem = (section, value, label, id) => {
    if (isWhole) {
      return (
        <div key={id} className="flex items-center space-x-2">
          <Checkbox id={id} checked={isSel(section, value)} onCheckedChange={() => toggleChoice(section, value)} />
          <Label htmlFor={id} className="cursor-pointer">{label}</Label>
        </div>
      );
    }
    return (
      <div key={id} className="flex items-center space-x-2">
        <RadioGroupItem value={value} id={id} />
        <Label htmlFor={id}>{label}</Label>
      </div>
    );
  };

  const renderSectionWrapper = (section, children) => {
    if (isWhole) return <div className="space-y-3">{children}</div>;
    return (
      <RadioGroup value={sections[section].choices?.[0] || ''} onValueChange={v => updateSection(section, 'choices', [v])}>
        <div className="space-y-3">{children}</div>
      </RadioGroup>
    );
  };

  const buildSelections = () => {
    const s = sections;
    const hamIsGrind = isSel('ham', 'grind');

    const hamOptLabel = hamIsGrind ? 'N/A — ham is going to grind' :
      s.hamOptions.choices.map(c =>
        c === 'whole'  ? 'Leave Whole (if possible)' :
        c === 'half'   ? 'Cut in Half' :
        c === 'center' ? `Center Cut (ham steaks + 2 small roasts) — ${s.hamOptions.thickness} thick, ${s.hamOptions.perPack}/pack` :
        c === 'steaks' ? `All Ham Steaks — ${s.hamOptions.thickness} thick, ${s.hamOptions.perPack}/pack` : c
      ).join(' & ');

    const grindLabel = s.grind.choices.map(c =>
      c === 'ground'  ? `Ground Pork — ${s.grind.packageSize} packages` :
      c === 'sausage' ? `Breakfast Sausage — ${s.grind.sausageLevel}` : c
    ).join(' & ');

    return [
      { section: 'Pork Loin', fields: { Selection: s.loin.choices.map(c =>
        c === 'chops' ? `Pork Chops — ${s.loin.thickness} thick, ${s.loin.perPack}/pack` : 'Put Into Grind').join(' & ') }},
      { section: 'Pork Shoulder', fields: { Selection: s.shoulder.choices.map(c =>
        c === 'steaks' ? `Cut Into Steaks — ${s.shoulder.thickness} thick, ${s.shoulder.perPack}/pack` :
        c === 'whole'  ? 'Leave Whole (for pulled pork)' : 'Put Into Grind').join(' & ') }},
      { section: 'Pork Roast', fields: { Selection: s.roast.choices.map(c =>
        c === 'save' ? 'Save Roast' : 'Put Into Grind').join(' & ') }},
      { section: 'Spare Ribs', fields: { Selection: s.spareRibs.choices.map(c =>
        c === 'whole' ? 'Leave Whole' : c === 'half' ? 'Cut in Half' : 'Put Into Grind').join(' & ') }},
      { section: 'Pork Belly', fields: { Selection: s.belly.choices.map(c =>
        c === 'bacon' ? 'Cure for Bacon' : c === 'fresh' ? 'Do Not Cure (Fresh Side)' : 'Put Into Grind').join(' & ') }},
      { section: 'Ham', fields: { Selection: s.ham.choices.map(c =>
        c === 'cure'  ? 'Cure (Traditional Ham)' :
        c === 'fresh' ? 'Do Not Cure (Fresh Pork Roast)' : 'Put Into Grind').join(' & ') }},
      { section: 'Ham Cut Options', fields: { Selection: hamOptLabel }},
      { section: 'Ham Hocks', fields: { Selection: s.hamHocks.choices.map(c =>
        c === 'cure'  ? 'Cure (for Ham & Beans)' :
        c === 'fresh' ? 'Leave Fresh' : 'Put Into Grind').join(' & ') }},
      { section: 'Ground Pork Options', fields: { Selection: grindLabel }},
    ];
  };

  const handleSubmit = async () => {
    const errors = { fullName: !customerInfo.fullName, email: !customerInfo.email, phone: !customerInfo.phone, pickupLocation: !pickupLocation };
    setFieldErrors(errors);
    if (Object.values(errors).some(Boolean)) {
      const id = errors.fullName ? 'pork-fullName' : errors.email ? 'pork-email' : errors.phone ? 'pork-phone' : 'pork-pickup';
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setIsSubmitting(true);
    try {
      const depositMap = { whole: '$200', half: '$100' };
      const payload = {
        animal: 'pork', quantity,
        contact: { name: customerInfo.fullName, email: customerInfo.email, phone: customerInfo.phone, pickup: pickupLocation },
        selections: buildSelections(),
        deposit: depositMap[quantity] || '',
        pdfBase64: null,
      };
      const res  = await fetch(WORKER_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      const fallback = { whole: 'https://pay.smrtpayments.com/wvp/hog-whole', half: 'https://pay.smrtpayments.com/wvp/hog-half' };
      window.location.href = data.redirectUrl || fallback[quantity];
    } catch {
      toast.error('Failed to submit order. Please try again or call us.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const hint = isWhole ? 'Whole hog: up to 2 options.' : 'Half hog: select 1 option.';

  return (
    <div className="space-y-6">

      {/* Quantity */}
      <FormSection title="2. Select Quantity" defaultOpen>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'whole', label: 'Whole Hog', hw: 200, price: '$3.50/lb', th: 130, fr: '6-8 cu ft',  dep: 200, est: 700, note: 'Up to 2 per section' },
            { id: 'half',  label: 'Half Hog',  hw: 100, price: '$3.75/lb', th: 65,  fr: '3-4 cu ft',  dep: 100, est: 375, note: '1 per section' },
          ].map(o => (
            <button key={o.id} onClick={() => setQuantity(o.id)}
              className={`p-3 rounded-xl border-2 text-center transition-all ${quantity === o.id ? 'border-red-600 bg-red-50' : 'border-stone-200 hover:border-stone-300'}`}>
              <div className="font-bold text-stone-900">{o.label}</div>
              <div className="text-xs text-stone-500">~{o.hw} lbs hanging</div>
              <div className="text-sm font-bold text-red-600 mt-1">{o.price}</div>
              <div className="border-t border-stone-200 mt-2 pt-2 space-y-0.5">
                <div className="text-xs text-blue-700 font-medium">~{o.th} lbs take-home</div>
                <div className="text-xs text-cyan-700">❄ {o.fr}</div>
                <div className="text-xs text-stone-500">Est. ~${o.est.toLocaleString()}</div>
              </div>
              <div className="text-xs text-stone-400 mt-1 italic">{o.note}</div>
            </button>
          ))}
        </div>
      </FormSection>

      {/* Customer Info */}
      <FormSection title="3. Your Information" defaultOpen>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { id: 'pork-fullName', label: 'Full Name *', key: 'fullName', placeholder: 'John Smith', type: 'text' },
            { id: 'pork-email',    label: 'Email *',     key: 'email',    placeholder: 'john@email.com', type: 'email' },
            { id: 'pork-phone',    label: 'Phone *',     key: 'phone',    placeholder: '(316) 555-1234', type: 'tel' },
          ].map(f => (
            <div key={f.id}>
              <Label className={fieldErrors[f.key] ? 'text-red-600' : ''}>{f.label}</Label>
              <Input id={f.id} type={f.type} value={customerInfo[f.key]}
                onChange={e => { setCustomerInfo({ ...customerInfo, [f.key]: e.target.value }); setFieldErrors(p => ({ ...p, [f.key]: false })); }}
                placeholder={f.placeholder} className={fieldErrors[f.key] ? 'border-red-500 ring-1 ring-red-500' : ''} />
              {fieldErrors[f.key] && <p className="text-xs text-red-600 mt-1">Required</p>}
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Label className={fieldErrors.pickupLocation ? 'text-red-600' : ''}>Pickup Location *</Label>
          <Select value={pickupLocation} onValueChange={v => { setPickupLocation(v); setFieldErrors(p => ({ ...p, pickupLocation: false })); }}>
            <SelectTrigger id="pork-pickup" className={fieldErrors.pickupLocation ? 'border-red-500 ring-1 ring-red-500' : ''}><SelectValue placeholder="Select a location..." /></SelectTrigger>
            <SelectContent>
              <SelectItem value="El Dorado — 1000 S. Main St., El Dorado, KS 67042">El Dorado — 1000 S. Main St.</SelectItem>
              <SelectItem value="Andover — 620 N. Andover Rd., Andover, KS 67002">Andover — 620 N. Andover Rd.</SelectItem>
              <SelectItem value="Augusta — 293 7th St., Augusta, KS 67010">Augusta — 293 7th St.</SelectItem>
            </SelectContent>
          </Select>
          {fieldErrors.pickupLocation && <p className="text-xs text-red-600 mt-1">Required</p>}
        </div>
      </FormSection>

      {/* 4. Pork Loin */}
      <FormSection title="4. Pork Loin" hint={hint}>
        {renderSectionWrapper('loin', <>
          {renderChoiceItem('loin','chops', 'Pork Chops', 'loin-chops')}
          {isSel('loin','chops') && <div className="ml-6 grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Thickness</Label><Select value={sections.loin.thickness} onValueChange={v=>updateSection('loin','thickness',v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{thicknessOptions.map(t=><SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
            <div><Label className="text-xs">Per Pack</Label><Select value={sections.loin.perPack} onValueChange={v=>updateSection('loin','perPack',v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{perPackOptions.map(p=><SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></div>
          </div>}
          {renderChoiceItem('loin','grind', 'Put Into Grind', 'loin-grind')}
        </>)}
      </FormSection>

      {/* 5. Pork Shoulder */}
      <FormSection title="5. Pork Shoulder" hint={hint}>
        {renderSectionWrapper('shoulder', <>
          {renderChoiceItem('shoulder','steaks', 'Cut Into Steaks', 'shoulder-steaks')}
          {isSel('shoulder','steaks') && <div className="ml-6 grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Thickness</Label><Select value={sections.shoulder.thickness} onValueChange={v=>updateSection('shoulder','thickness',v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{thicknessOptions.map(t=><SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
            <div><Label className="text-xs">Per Package</Label><Select value={sections.shoulder.perPack} onValueChange={v=>updateSection('shoulder','perPack',v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{perPackOptions.map(p=><SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></div>
          </div>}
          {renderChoiceItem('shoulder','whole', 'Leave Whole (for pulled pork)', 'shoulder-whole')}
          {renderChoiceItem('shoulder','grind', 'Put Into Grind',                'shoulder-grind')}
        </>)}
      </FormSection>

      {/* 5b. Pork Roast */}
      <FormSection title="5b. Pork Roast" hint={hint}>
        {renderSectionWrapper('roast', <>
          {renderChoiceItem('roast','save',  'Save Roast',    'roast-save')}
          {renderChoiceItem('roast','grind', 'Put Into Grind', 'roast-grind')}
        </>)}
      </FormSection>

      {/* 6. Spare Ribs */}
      <FormSection title="6. Spare Ribs" hint={hint}>
        {renderSectionWrapper('spareRibs', <>
          {renderChoiceItem('spareRibs','whole', 'Leave Whole',    'ribs-whole')}
          {renderChoiceItem('spareRibs','half',  'Cut in Half',    'ribs-half')}
          {renderChoiceItem('spareRibs','grind', 'Put Into Grind', 'ribs-grind')}
        </>)}
      </FormSection>

      {/* 7. Pork Belly */}
      <FormSection title="7. Pork Belly" hint={hint}>
        {renderSectionWrapper('belly', <>
          {renderChoiceItem('belly','bacon', 'Cure for Bacon',            'belly-bacon')}
          {renderChoiceItem('belly','fresh', 'Do Not Cure (Fresh Side)',  'belly-fresh')}
          {renderChoiceItem('belly','grind', 'Put Into Grind',            'belly-grind')}
        </>)}
      </FormSection>

      {/* 8. Ham */}
      <FormSection title="8. Ham" hint={hint}>
        {renderSectionWrapper('ham', <>
          {renderChoiceItem('ham','cure',  'Cure (Traditional Ham)',        'ham-cure')}
          {renderChoiceItem('ham','fresh', 'Do Not Cure (Fresh Pork Roast)', 'ham-fresh')}
          {renderChoiceItem('ham','grind', 'Put Into Grind',                 'ham-grind')}
        </>)}
      </FormSection>

      {/* 9. Ham Cut Options — hidden if ham = grind */}
      {!isSel('ham','grind') && (
        <FormSection title="9. Ham Cut Options" hint={hint}>
          {renderSectionWrapper('hamOptions', <>
            {renderChoiceItem('hamOptions','whole',  'Leave Whole (if possible)',                        'hamopt-whole')}
            {renderChoiceItem('hamOptions','half',   'Cut in Half',                                      'hamopt-half')}
            {renderChoiceItem('hamOptions','center', 'Center Cut (ham steaks + 2 small roasts)',         'hamopt-center')}
            {renderChoiceItem('hamOptions','steaks', 'All Ham Steaks',                                   'hamopt-steaks')}
            {(isSel('hamOptions','center')||isSel('hamOptions','steaks')) && <div className="ml-6 grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Thickness</Label><Select value={sections.hamOptions.thickness} onValueChange={v=>updateSection('hamOptions','thickness',v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{thicknessOptions.map(t=><SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
              <div><Label className="text-xs">Per Pack</Label><Select value={sections.hamOptions.perPack} onValueChange={v=>updateSection('hamOptions','perPack',v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{perPackOptions.map(p=><SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></div>
            </div>}
          </>)}
        </FormSection>
      )}

      {/* 9b. Ham Hocks */}
      <FormSection title="9b. Ham Hocks" hint={hint}>
        {renderSectionWrapper('hamHocks', <>
          {renderChoiceItem('hamHocks','cure',  'Cure (for Ham & Beans)', 'hocks-cure')}
          {renderChoiceItem('hamHocks','fresh', 'Leave Fresh',            'hocks-fresh')}
          {renderChoiceItem('hamHocks','grind', 'Put Into Grind',         'hocks-grind')}
        </>)}
      </FormSection>

      {/* 10. Ground Pork Options */}
      <FormSection title="10. Ground Pork Options" hint={hint}>
        {renderSectionWrapper('grind', <>
          {renderChoiceItem('grind','ground',  'Ground Pork', 'grind-plain')}
          {isSel('grind','ground') && (
            <div className="ml-6">
              <Label className="text-xs">Package Size</Label>
              <Select value={sections.grind.packageSize} onValueChange={v=>updateSection('grind','packageSize',v)}>
                <SelectTrigger className="w-36"><SelectValue/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 lb">1 lb packages</SelectItem>
                  <SelectItem value="2 lb">2 lb packages</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {renderChoiceItem('grind','sausage', 'Breakfast Sausage', 'grind-sausage')}
          {isSel('grind','sausage') && (
            <div className="ml-6">
              <Label className="text-xs">Spice Level</Label>
              <Select value={sections.grind.sausageLevel} onValueChange={v=>updateSection('grind','sausageLevel',v)}>
                <SelectTrigger className="w-40"><SelectValue/></SelectTrigger>
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
        <div className="mb-4">
          <div className="text-sm text-stone-600">Required Deposit</div>
          <div className="text-3xl font-black text-red-700">${deposit.toLocaleString()}</div>
          <div className="text-xs text-stone-500">Applied to final balance at pickup</div>
        </div>
        <Button className="w-full bg-red-700 hover:bg-red-800 text-lg py-6" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? <><Loader2 className="w-5 h-5 mr-2 animate-spin"/> Submitting...</> : 'Submit Pork Order'}
        </Button>
      </div>

    </div>
  );
}
