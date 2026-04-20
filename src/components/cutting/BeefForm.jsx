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
const thicknessOptions = ['1/2"', '3/4"', '1"', '1 1/4"'];
const perPackOptions = ['1', '2', '3', '4'];
const roastSizeOptions = ['2-3 lb', '3-4 lb', '4-5 lb'];

export default function BeefForm() {
  const [quantity, setQuantity] = useState('half');
  const [customerInfo, setCustomerInfo] = useState({ fullName: '', email: '', phone: '' });
  const [sections, setSections] = useState({
    rib:           { choices: ['ribeye'],  thickness: '1"',   perPack: '2', roastSize: '3-4 lb' },
    loin:          { choices: ['tbone'],   thickness: '1"',   perPack: '2', roastSize: '3-4 lb' },
    sirloin:       { choices: ['steaks'],  thickness: '1"',   perPack: '2', roastSize: '3-4 lb' },
    sirloinTip:    { choices: ['steak'],   thickness: '3/4"', perPack: '2', roastSize: '3-4 lb' },
    round:         { choices: ['steak'],   thickness: '3/4"', perPack: '2', roastSize: '3-4 lb' },
    rumpPikesPeak: { choices: ['save'] },
    chuck:         { choices: ['roast'],   roastSize: '3-4 lb' },
    arm:           { choices: ['roast'],   roastSize: '3-4 lb' },
    brisket:       { choices: ['whole'] },
    ribs:          { choice: 'save' },
    soupBones:     { choice: 'save' },
  });
  const [grindSettings, setGrindSettings] = useState({ leanness: '80%', packageSize: '1 lb' });
  const [patties, setPatties] = useState({ want: false, pounds: '10', size: '1/3 lb', perPack: '4' });
  const [organMeats, setOrganMeats] = useState({ liver: false, heart: false, tongue: false });
  const [pickupLocation, setPickupLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ fullName: false, email: false, phone: false, pickupLocation: false });

  const isWhole   = quantity === 'whole';
  const isQuarter = quantity === 'quarter';
  const deposit   = isWhole ? 1200 : isQuarter ? 300 : 600;

  const updateSection = (section, field, value) =>
    setSections(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));

  const toggleBeefChoice = (section, choice) => {
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
          <Checkbox id={id} checked={isSel(section, value)} onCheckedChange={() => toggleBeefChoice(section, value)} />
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
    return [
      { section: 'Rib Section', fields: { Selection: s.rib.choices.map(c =>
        c === 'ribeye' ? `Ribeye Steaks — ${s.rib.thickness} thick, ${s.rib.perPack}/pack` :
        c === 'primerib' ? `Prime Rib Roast — ${s.rib.roastSize}` : 'Grind').join(' & ') }},
      { section: 'Loin Section', fields: { Selection: s.loin.choices.map(c =>
        c === 'tbone' ? `T-Bone Steaks — ${s.loin.thickness} thick, ${s.loin.perPack}/pack` :
        c === 'kcfilet' ? `KC Strip & Filet — ${s.loin.thickness} thick, ${s.loin.perPack}/pack` :
        c === 'roast' ? `Loin Roast — ${s.loin.roastSize}` : 'Grind').join(' & ') }},
      { section: 'Sirloin Section', fields: { Selection: s.sirloin.choices.map(c =>
        c === 'steaks' ? `Sirloin Steaks — ${s.sirloin.thickness} thick, ${s.sirloin.perPack}/pack` :
        c === 'roast' ? `Sirloin Roast — ${s.sirloin.roastSize}` : 'Grind').join(' & ') }},
      { section: 'Sirloin Tip', fields: { Selection: s.sirloinTip.choices.map(c =>
        c === 'steak' ? `Sirloin Tip Steak — ${s.sirloinTip.thickness} thick, ${s.sirloinTip.perPack}/pack` :
        c === 'roast' ? `Sirloin Tip Roast — ${s.sirloinTip.roastSize}` : 'Grind').join(' & ') }},
      { section: 'Round Section', fields: { Selection: s.round.choices.map(c =>
        c === 'steak' ? `Round Steak — ${s.round.thickness} thick, ${s.round.perPack}/pack` :
        c === 'tenderized' ? 'Tenderized Round Steak (3/4" thick)' :
        c === 'minute' ? 'Minute Steak (3/4" thick)' :
        c === 'roast' ? `Round Roast — ${s.round.roastSize}` :
        c === 'stew' ? 'Stew Meat' : 'Grind').join(' & ') }},
      { section: 'Rump & Pikes Peak Roast', fields: { Selection: s.rumpPikesPeak.choices.map(c =>
        c === 'save' ? 'Save' : 'Grind').join(' & ') }},
      { section: 'Chuck Section', fields: {
        'Chuck Roast': s.chuck.choices.map(c => c === 'roast' ? `Chuck Roast — ${s.chuck.roastSize}` : c === 'stew' ? 'Stew Meat' : 'Grind').join(' & '),
        'Arm Roast':   s.arm.choices.map(c =>   c === 'roast' ? `Arm Roast — ${s.arm.roastSize}`     : c === 'stew' ? 'Stew Meat' : 'Grind').join(' & '),
      }},
      { section: 'Brisket', fields: { Selection: s.brisket.choices.map(c =>
        c === 'whole' ? 'Keep Whole' : c === 'half' ? 'Cut in Half' : c === 'halfbrisket' ? 'Half Brisket' : 'Grind').join(' & ') }},
      { section: 'Ribs & Soup Bones', fields: {
        'Beef Ribs':  s.ribs.choice      === 'save' ? 'Save' : 'Grind',
        'Soup Bones': s.soupBones.choice === 'save' ? 'Save (sliced ~1.25")' : 'Grind',
      }},
      { section: 'Ground Beef Settings', fields: { Leanness: grindSettings.leanness, 'Package Size': grindSettings.packageSize }},
      { section: 'Hamburger Patties', fields: { Patties: patties.want ? `Yes — ${patties.pounds} lbs, ${patties.size} patties, ${patties.perPack}/pack` : 'None' }},
      { section: 'Organ Meats', fields: {
        Liver:  organMeats.liver  ? 'Save' : 'No',
        Heart:  organMeats.heart  ? 'Save' : 'No',
        Tongue: organMeats.tongue ? 'Save' : 'No',
      }},
    ];
  };

  const handleSubmit = async () => {
    const errors = { fullName: !customerInfo.fullName, email: !customerInfo.email, phone: !customerInfo.phone, pickupLocation: !pickupLocation };
    setFieldErrors(errors);
    if (Object.values(errors).some(Boolean)) {
      const id = errors.fullName ? 'beef-fullName' : errors.email ? 'beef-email' : errors.phone ? 'beef-phone' : 'beef-pickup';
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (patties.want) {
      const grindKeys = ['rib','loin','sirloin','sirloinTip','round','rumpPikesPeak','chuck','arm','brisket'];
      const hasGrind = grindKeys.some(k => sections[k].choices?.includes('grind'));
      if (!hasGrind) toast.error("You've requested patties but haven't assigned any sections to grind — there may not be enough ground beef. You can still submit.");
    }
    setIsSubmitting(true);
    try {
      const depositMap = { whole: '$1,200', half: '$600', quarter: '$300' };
      const payload = {
        animal: 'beef', quantity,
        contact: { name: customerInfo.fullName, email: customerInfo.email, phone: customerInfo.phone, pickup: pickupLocation },
        selections: buildSelections(),
        deposit: depositMap[quantity] || '',
        pdfBase64: null,
      };
      const res  = await fetch(WORKER_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      const fallback = { whole: 'https://pay.smrtpayments.com/wvp/beef-whole', half: 'https://pay.smrtpayments.com/wvp/beef-half', quarter: 'https://pay.smrtpayments.com/wvp/beef-quarter' };
      window.location.href = data.redirectUrl || fallback[quantity];
    } catch {
      toast.error('Failed to submit order. Please try again or call us.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const SubRow = ({ label, children }) => (
    <div className="ml-6 mt-2">{label && <Label className="text-xs">{label}</Label>}{children}</div>
  );

  return (
    <div className="space-y-6">

      {/* Quantity */}
      <FormSection title="2. Select Quantity" defaultOpen>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'whole',   label: 'Whole',   hw: 700, price: '$5.50/lb', th: 420, fr: '14-18 cu ft', dep: 1200, est: 3850, note: 'Up to 2 per section' },
            { id: 'half',    label: 'Half',    hw: 350, price: '$5.50/lb', th: 180, fr: '8-10 cu ft',  dep: 600,  est: 1650, note: '1 per section' },
            { id: 'quarter', label: 'Quarter', hw: 175, price: '$5.75/lb', th: 105, fr: '4-6 cu ft',   dep: 300,  est: 863,  note: '1 per section' },
          ].map(o => (
            <button key={o.id} onClick={() => setQuantity(o.id)}
              className={`p-3 rounded-xl border-2 text-center transition-all ${quantity === o.id ? 'border-red-600 bg-red-50' : 'border-stone-200 hover:border-stone-300'}`}>
              <div className="font-bold text-stone-900">{o.label}</div>
              <div className="text-xs text-stone-500">~{o.hw} lbs hanging</div>
              <div className="text-sm font-semibold text-red-700 mt-1">{o.price}</div>
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
            { id: 'beef-fullName', label: 'Full Name *', key: 'fullName', placeholder: 'John Smith', type: 'text' },
            { id: 'beef-email',    label: 'Email *',     key: 'email',    placeholder: 'john@email.com', type: 'email' },
            { id: 'beef-phone',    label: 'Phone *',     key: 'phone',    placeholder: '(316) 555-1234', type: 'tel' },
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
            <SelectTrigger id="beef-pickup" className={fieldErrors.pickupLocation ? 'border-red-500 ring-1 ring-red-500' : ''}><SelectValue placeholder="Select a location..." /></SelectTrigger>
            <SelectContent>
              <SelectItem value="El Dorado — 1000 S. Main St., El Dorado, KS 67042">El Dorado — 1000 S. Main St.</SelectItem>
              <SelectItem value="Andover — 620 N. Andover Rd., Andover, KS 67002">Andover — 620 N. Andover Rd.</SelectItem>
              <SelectItem value="Augusta — 293 7th St., Augusta, KS 67010">Augusta — 293 7th St.</SelectItem>
            </SelectContent>
          </Select>
          {fieldErrors.pickupLocation && <p className="text-xs text-red-600 mt-1">Required</p>}
        </div>
      </FormSection>

      {/* 4. Rib */}
      <FormSection title="4. Rib Section" hint={isWhole ? 'Whole beef: up to 2 options.' : 'Select 1 option.'}>
        {renderSectionWrapper('rib', <>
          {renderChoiceItem('rib', 'ribeye',   'Ribeye Steaks (Boneless)', 'rib-ribeye')}
          {isSel('rib','ribeye') && <div className="ml-6 grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Thickness</Label><Select value={sections.rib.thickness} onValueChange={v=>updateSection('rib','thickness',v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{thicknessOptions.map(t=><SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
            <div><Label className="text-xs">Per Pack</Label><Select value={sections.rib.perPack} onValueChange={v=>updateSection('rib','perPack',v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{perPackOptions.map(p=><SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></div>
          </div>}
          {renderChoiceItem('rib', 'primerib', 'Prime Rib Roast',           'rib-prime')}
          {isSel('rib','primerib') && <div className="ml-6"><Label className="text-xs">Roast Size</Label><Select value={sections.rib.roastSize} onValueChange={v=>updateSection('rib','roastSize',v)}><SelectTrigger className="w-32"><SelectValue/></SelectTrigger><SelectContent>{roastSizeOptions.map(s=><SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>}
          {renderChoiceItem('rib', 'grind',    'Grind (add to ground beef)', 'rib-grind')}
        </>)}
      </FormSection>

      {/* 5. Loin */}
      <FormSection title="5. Loin Section" hint={isWhole ? 'Whole beef: up to 2 options.' : 'Select 1 option.'}>
        {renderSectionWrapper('loin', <>
          {renderChoiceItem('loin','tbone',   'T-Bone Steaks',                  'loin-tbone')}
          {renderChoiceItem('loin','kcfilet', 'KC Strip & Filet (bone removed)', 'loin-kc')}
          {(isSel('loin','tbone')||isSel('loin','kcfilet')) && <div className="ml-6 grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Thickness</Label><Select value={sections.loin.thickness} onValueChange={v=>updateSection('loin','thickness',v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{thicknessOptions.map(t=><SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
            <div><Label className="text-xs">Per Pack</Label><Select value={sections.loin.perPack} onValueChange={v=>updateSection('loin','perPack',v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{perPackOptions.map(p=><SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></div>
          </div>}
          {renderChoiceItem('loin','roast', 'Roast', 'loin-roast')}
          {isSel('loin','roast') && <div className="ml-6"><Label className="text-xs">Roast Size</Label><Select value={sections.loin.roastSize} onValueChange={v=>updateSection('loin','roastSize',v)}><SelectTrigger className="w-32"><SelectValue/></SelectTrigger><SelectContent>{roastSizeOptions.map(s=><SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>}
          {renderChoiceItem('loin','grind', 'Grind (add to ground beef)', 'loin-grind')}
        </>)}
      </FormSection>

      {/* 6. Sirloin */}
      <FormSection title="6. Sirloin Section" hint={isWhole ? 'Whole beef: up to 2 options.' : 'Select 1 option.'}>
        {renderSectionWrapper('sirloin', <>
          {renderChoiceItem('sirloin','steaks', 'Sirloin Steaks', 'sirloin-steaks')}
          {isSel('sirloin','steaks') && <div className="ml-6 grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Thickness</Label><Select value={sections.sirloin.thickness} onValueChange={v=>updateSection('sirloin','thickness',v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{thicknessOptions.map(t=><SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
            <div><Label className="text-xs">Per Pack</Label><Select value={sections.sirloin.perPack} onValueChange={v=>updateSection('sirloin','perPack',v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{perPackOptions.map(p=><SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></div>
          </div>}
          {renderChoiceItem('sirloin','roast', 'Roast', 'sirloin-roast')}
          {isSel('sirloin','roast') && <div className="ml-6"><Label className="text-xs">Roast Size</Label><Select value={sections.sirloin.roastSize} onValueChange={v=>updateSection('sirloin','roastSize',v)}><SelectTrigger className="w-32"><SelectValue/></SelectTrigger><SelectContent>{roastSizeOptions.map(s=><SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>}
          {renderChoiceItem('sirloin','grind', 'Grind (add to ground beef)', 'sirloin-grind')}
        </>)}
      </FormSection>

      {/* 6b. Sirloin Tip */}
      <FormSection title="6b. Sirloin Tip" hint={isWhole ? 'Whole beef: up to 2 options.' : 'Select 1 option.'}>
        {renderSectionWrapper('sirloinTip', <>
          {renderChoiceItem('sirloinTip','steak', 'Cut Into Steak', 'st-steak')}
          {isSel('sirloinTip','steak') && <div className="ml-6 grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Thickness</Label><Select value={sections.sirloinTip.thickness} onValueChange={v=>updateSection('sirloinTip','thickness',v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{thicknessOptions.map(t=><SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
            <div><Label className="text-xs">Per Pack</Label><Select value={sections.sirloinTip.perPack} onValueChange={v=>updateSection('sirloinTip','perPack',v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{perPackOptions.map(p=><SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></div>
          </div>}
          {renderChoiceItem('sirloinTip','roast', 'Roast', 'st-roast')}
          {isSel('sirloinTip','roast') && <div className="ml-6"><Label className="text-xs">Roast Size</Label><Select value={sections.sirloinTip.roastSize} onValueChange={v=>updateSection('sirloinTip','roastSize',v)}><SelectTrigger className="w-32"><SelectValue/></SelectTrigger><SelectContent>{roastSizeOptions.map(s=><SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>}
          {renderChoiceItem('sirloinTip','grind', 'Grind (add to ground beef)', 'st-grind')}
        </>)}
      </FormSection>

      {/* 7. Round */}
      <FormSection title="7. Round Section" hint={isWhole ? 'Whole beef: up to 2 options.' : 'Select 1 option.'}>
        {renderSectionWrapper('round', <>
          {renderChoiceItem('round','steak', 'Round Steak', 'round-steak')}
          {isSel('round','steak') && <div className="ml-6 grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Thickness</Label><Select value={sections.round.thickness} onValueChange={v=>updateSection('round','thickness',v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value='1/2"'>1/2"</SelectItem><SelectItem value='3/4"'>3/4"</SelectItem><SelectItem value='1"'>1"</SelectItem></SelectContent></Select></div>
            <div><Label className="text-xs">Per Pack</Label><Select value={sections.round.perPack} onValueChange={v=>updateSection('round','perPack',v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{perPackOptions.map(p=><SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></div>
          </div>}
          {renderChoiceItem('round','tenderized', 'Tenderized Round Steak (3/4" thick)', 'round-tender')}
          {isSel('round','tenderized') && <div className="ml-6"><Label className="text-xs">Per Pack</Label><Select value={sections.round.perPack} onValueChange={v=>updateSection('round','perPack',v)}><SelectTrigger className="w-32"><SelectValue/></SelectTrigger><SelectContent>{perPackOptions.map(p=><SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></div>}
          {renderChoiceItem('round','minute', 'Minute Steak (3/4" thick)', 'round-minute')}
          {isSel('round','minute') && <div className="ml-6"><Label className="text-xs">Per Pack</Label><Select value={sections.round.perPack} onValueChange={v=>updateSection('round','perPack',v)}><SelectTrigger className="w-32"><SelectValue/></SelectTrigger><SelectContent>{perPackOptions.map(p=><SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></div>}
          {renderChoiceItem('round','roast', 'Round Roast', 'round-roast')}
          {isSel('round','roast') && <div className="ml-6"><Label className="text-xs">Roast Size</Label><Select value={sections.round.roastSize} onValueChange={v=>updateSection('round','roastSize',v)}><SelectTrigger className="w-32"><SelectValue/></SelectTrigger><SelectContent>{roastSizeOptions.map(s=><SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>}
          {renderChoiceItem('round','stew',  'Stew Meat', 'round-stew')}
          {renderChoiceItem('round','grind', 'Grind (add to ground beef)', 'round-grind')}
        </>)}
      </FormSection>

      {/* 7b. Rump & Pikes Peak */}
      <FormSection title="7b. Rump & Pikes Peak Roast" hint={isWhole ? 'Whole beef: up to 2 options.' : 'Select 1 option.'}>
        {renderSectionWrapper('rumpPikesPeak', <>
          {renderChoiceItem('rumpPikesPeak','save',  'Save',                      'rpp-save')}
          {renderChoiceItem('rumpPikesPeak','grind', 'Grind (add to ground beef)', 'rpp-grind')}
        </>)}
      </FormSection>

      {/* 8. Chuck */}
      <FormSection title="8. Chuck Section" hint="Average of 3 arm roasts and 4 pot roasts per half.">
        <div className="space-y-4">
          <div>
            <Label className="font-medium mb-2 block">Chuck Roast</Label>
            {renderSectionWrapper('chuck', <>
              {renderChoiceItem('chuck','roast', 'Roast', 'chuck-roast')}
              {isSel('chuck','roast') && <div className="ml-6"><Label className="text-xs">Roast Size</Label><Select value={sections.chuck.roastSize} onValueChange={v=>updateSection('chuck','roastSize',v)}><SelectTrigger className="w-32"><SelectValue/></SelectTrigger><SelectContent>{roastSizeOptions.map(s=><SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>}
              {renderChoiceItem('chuck','stew',  'Stew Meat',                'chuck-stew')}
              {renderChoiceItem('chuck','grind', 'Grind (add to ground beef)', 'chuck-grind')}
            </>)}
          </div>
          <div>
            <Label className="font-medium mb-2 block">Arm Roast</Label>
            {renderSectionWrapper('arm', <>
              {renderChoiceItem('arm','roast', 'Roast', 'arm-roast')}
              {isSel('arm','roast') && <div className="ml-6"><Label className="text-xs">Roast Size</Label><Select value={sections.arm.roastSize} onValueChange={v=>updateSection('arm','roastSize',v)}><SelectTrigger className="w-32"><SelectValue/></SelectTrigger><SelectContent>{roastSizeOptions.map(s=><SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>}
              {renderChoiceItem('arm','stew',  'Stew Meat',                'arm-stew')}
              {renderChoiceItem('arm','grind', 'Grind (add to ground beef)', 'arm-grind')}
            </>)}
          </div>
        </div>
      </FormSection>

      {/* 9. Brisket */}
      <FormSection title="9. Brisket" hint={isWhole ? 'Whole beef: up to 2 options.' : 'Select 1 option.'}>
        {renderSectionWrapper('brisket', <>
          {!isQuarter && renderChoiceItem('brisket','whole', 'Keep Whole',  'brisket-whole')}
          {!isQuarter && renderChoiceItem('brisket','half',  'Cut in Half', 'brisket-half')}
          {isQuarter  && renderChoiceItem('brisket','halfbrisket', 'Half Brisket', 'brisket-hq')}
          {renderChoiceItem('brisket','grind', 'Grind (add to ground beef)', 'brisket-grind')}
        </>)}
      </FormSection>

      {/* 10. Ribs & Soup Bones */}
      <FormSection title="10. Ribs & Soup Bones">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label className="font-medium mb-2 block">Beef Ribs</Label>
            <RadioGroup value={sections.ribs.choice} onValueChange={v=>updateSection('ribs','choice',v)}>
              <div className="space-y-2">
                <div className="flex items-center space-x-2"><RadioGroupItem value="save"  id="ribs-save" /><Label htmlFor="ribs-save">Save</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="grind" id="ribs-grind"/><Label htmlFor="ribs-grind">Grind (add to ground beef)</Label></div>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label className="font-medium mb-2 block">Soup Bones</Label>
            <RadioGroup value={sections.soupBones.choice} onValueChange={v=>updateSection('soupBones','choice',v)}>
              <div className="space-y-2">
                <div className="flex items-center space-x-2"><RadioGroupItem value="save"  id="soup-save" /><Label htmlFor="soup-save">Save (sliced ~1.25")</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="grind" id="soup-grind"/><Label htmlFor="soup-grind">Grind (add to ground beef)</Label></div>
              </div>
            </RadioGroup>
          </div>
        </div>
      </FormSection>

      {/* 11. Ground Beef Settings */}
      <FormSection title="11. Ground Beef Settings" hint="Applies to all cuts sent to grind.">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Leanness</Label>
            <Select value={grindSettings.leanness} onValueChange={v=>setGrindSettings({...grindSettings,leanness:v})}>
              <SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent>
                <SelectItem value="80%">80% Lean (Standard — Best Yield)</SelectItem>
                <SelectItem value="85%">85% Lean</SelectItem>
                <SelectItem value="90%">90% Lean</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Package Size</Label>
            <Select value={grindSettings.packageSize} onValueChange={v=>setGrindSettings({...grindSettings,packageSize:v})}>
              <SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent>
                <SelectItem value="1 lb">1 lb packages</SelectItem>
                <SelectItem value="2 lb">2 lb packages</SelectItem>
                <SelectItem value="5 lb">5 lb packages</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </FormSection>

      {/* 12. Patties */}
      <FormSection title="12. Hamburger Patties (Optional)" hint="10 lb minimum. Comes from your ground beef portion.">
        <div className="flex items-center space-x-2 mb-4">
          <Checkbox id="want-patties" checked={patties.want} onCheckedChange={c=>setPatties({...patties,want:c})}/>
          <Label htmlFor="want-patties">Yes, I want patties (10 lb minimum)</Label>
        </div>
        {patties.want && (
          <div className="grid md:grid-cols-3 gap-4 pl-6">
            <div><Label className="text-xs">Total Pounds</Label><Select value={patties.pounds} onValueChange={v=>setPatties({...patties,pounds:v})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="10">10 lbs</SelectItem><SelectItem value="20">20 lbs</SelectItem><SelectItem value="30">30 lbs</SelectItem></SelectContent></Select></div>
            <div><Label className="text-xs">Patty Size</Label><Select value={patties.size} onValueChange={v=>setPatties({...patties,size:v})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="1/4 lb">1/4 lb</SelectItem><SelectItem value="1/3 lb">1/3 lb</SelectItem><SelectItem value="1/2 lb">1/2 lb</SelectItem></SelectContent></Select></div>
            <div><Label className="text-xs">Per Pack</Label><Select value={patties.perPack} onValueChange={v=>setPatties({...patties,perPack:v})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="4">4</SelectItem><SelectItem value="6">6</SelectItem><SelectItem value="8">8</SelectItem><SelectItem value="10">10</SelectItem></SelectContent></Select></div>
          </div>
        )}
      </FormSection>

      {/* 13. Organ Meats */}
      <FormSection title="13. Organ Meats" hint="If not selected, noted as 'No' on the order so the kitchen knows.">
        <div className="space-y-4">
          {[
            { id: 'liver',  key: 'liver',  label: 'Save Liver',  desc: 'Rich in iron & vitamins.' },
            { id: 'heart',  key: 'heart',  label: 'Save Heart',  desc: 'Lean, dense muscle meat.' },
            { id: 'tongue', key: 'tongue', label: 'Save Tongue', desc: 'Tender when slow-cooked. Great for tacos (lengua).' },
          ].map(o => (
            <div key={o.id} className="flex items-start space-x-2">
              <Checkbox id={o.id} checked={organMeats[o.key]} onCheckedChange={c=>setOrganMeats({...organMeats,[o.key]:c})} className="mt-1"/>
              <div><Label htmlFor={o.id} className="font-medium">{o.label}</Label><p className="text-xs text-stone-500">{o.desc}</p></div>
            </div>
          ))}
        </div>
      </FormSection>

      {/* Submit */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="mb-4">
          <div className="text-sm text-stone-600">Required Deposit</div>
          <div className="text-3xl font-black text-red-700">${deposit.toLocaleString()}</div>
          <div className="text-xs text-stone-500">Applied to final balance at pickup</div>
        </div>
        <Button className="w-full bg-red-700 hover:bg-red-800 text-lg py-6" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? <><Loader2 className="w-5 h-5 mr-2 animate-spin"/> Submitting...</> : 'Submit Beef Order'}
        </Button>
      </div>

    </div>
  );
}