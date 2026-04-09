import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ChevronDown, ChevronUp, Info, DollarSign, ChevronRight, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import FormSection from './FormSection';

const thicknessOptions = ['3/4"', '1"', '1 1/4"', '1 1/2"'];
const perPackOptions = ['1', '2', '3', '4'];
const roastSizeOptions = ['2-3 lb', '3-4 lb', '4-5 lb'];

export default function BeefForm() {
  const [quantity, setQuantity] = useState('half');
  const [customerInfo, setCustomerInfo] = useState({ fullName: '', email: '', phone: '' });
  const [sections, setSections] = useState({
    rib: { choice: 'ribeye', thickness: '1"', perPack: '2', roastSize: '3-4 lb' },
    loin: { choice: 'tbone', thickness: '1"', perPack: '2' },
    sirloin: { choice: 'steaks', thickness: '1"', perPack: '2' },
    sirloinTip: { choice: 'steak', thickness: '3/4"', perPack: '2', roastSize: '3-4 lb' },
    round: { choice: 'steak', thickness: '3/4"', perPack: '2', roastSize: '3-4 lb' },
    chuck: { choice: 'roast', roastSize: '3-4 lb' },
    arm: { choice: 'roast', roastSize: '3-4 lb' },
    pikesPeak: { choice: 'save' },
    rump: { choice: 'save' },
    brisket: { choice: 'whole' },
    ribs: { choice: 'save' },
    soupBones: { choice: 'save' },
    flank: { choice: 'save' },
    skirt: { choice: 'save' },
    flatIron: { choice: 'save' },
  });
  const [grindSettings, setGrindSettings] = useState({ leanness: '80%', packageSize: '1 lb' });
  const [patties, setPatties] = useState({ want: false, pounds: '10', size: '1/3 lb', perPack: '4' });
  const [organMeats, setOrganMeats] = useState({ liver: false, heart: false, tongue: false });

  const [pickupLocation, setPickupLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ fullName: false, email: false, phone: false, pickupLocation: false });

  const isQuarter = quantity === 'quarter';
  const deposit = quantity === 'whole' ? 1200 : quantity === 'half' ? 600 : 300;

  const updateSection = (section, field, value) => {
    setSections(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
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
      const firstErrorField = errors.fullName ? 'beef-fullName' : errors.email ? 'beef-email' : errors.phone ? 'beef-phone' : 'beef-pickup';
      const el = document.getElementById(firstErrorField);
      if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.focus(); }
      return;
    }
    
    setIsSubmitting(true);
    try {
      const orderDetails = {
        'Quantity': quantity === 'whole' ? 'Whole Beef' : quantity === 'half' ? 'Half Beef' : 'Quarter Beef',
        'Pickup Location': pickupLocation,
        'Deposit': `$${deposit}`,
        'Rib Section': sections.rib.choice === 'ribeye' ? `Ribeye Steaks — ${sections.rib.thickness} thick, ${sections.rib.perPack}/pack` : sections.rib.choice === 'primerib' ? `Prime Rib Roast — ${sections.rib.roastSize}` : 'Grind',
        'Loin Section': sections.loin.choice === 'tbone' ? `T-Bone Steaks — ${sections.loin.thickness} thick, ${sections.loin.perPack}/pack` : sections.loin.choice === 'kcfilet' ? `KC Strip & Filet — ${sections.loin.thickness} thick, ${sections.loin.perPack}/pack` : 'Grind',
        'Sirloin Section': sections.sirloin.choice === 'steaks' ? `Sirloin Steaks — ${sections.sirloin.thickness} thick, ${sections.sirloin.perPack}/pack` : 'Grind',
        'Sirloin Tip': sections.sirloinTip ? (sections.sirloinTip.choice === 'steak' ? `Sirloin Tip Steak — ${sections.sirloinTip.thickness} thick, ${sections.sirloinTip.perPack}/pack` : sections.sirloinTip.choice === 'roast' ? `Sirloin Tip Roast — ${sections.sirloinTip.roastSize}` : 'Grind') : 'Default',
        'Round Section': sections.round.choice === 'steak' ? `Round Steak — ${sections.round.thickness} thick, ${sections.round.perPack}/pack` : sections.round.choice === 'tenderized' ? 'Tenderized Round Steak (3/4" thick)' : sections.round.choice === 'minute' ? 'Minute Steak (3/4" thick)' : sections.round.choice === 'roast' ? `Round Roast — ${sections.round.roastSize}` : 'Grind',
        'Chuck Roast': sections.chuck.choice === 'roast' ? `Roast — ${sections.chuck.roastSize}` : 'Grind',
        'Arm Roast': sections.arm.choice === 'roast' ? `Roast — ${sections.arm.roastSize}` : 'Grind',
        'Pikes Peak': sections.pikesPeak ? (sections.pikesPeak.choice === 'save' ? 'Save' : 'Grind') : 'Save',
        'Rump': sections.rump ? (sections.rump.choice === 'save' ? 'Save' : 'Grind') : 'Save',
        'Brisket': sections.brisket.choice === 'whole' ? 'Keep Whole' : sections.brisket.choice === 'half' ? 'Cut in Half' : sections.brisket.choice === 'halfbrisket' ? 'Half Brisket' : 'Grind',
        'Beef Ribs': sections.ribs.choice === 'save' ? 'Save' : 'Grind',
        'Soup Bones': sections.soupBones.choice === 'save' ? 'Save (sliced ~1.25")' : 'Grind',
        'Flank': sections.flank ? (sections.flank.choice === 'save' ? 'Save' : 'Grind') : 'Save',
        'Skirt': sections.skirt ? (sections.skirt.choice === 'save' ? 'Save' : 'Grind') : 'Save',
        'Flat Iron': sections.flatIron ? (sections.flatIron.choice === 'save' ? 'Save' : 'Grind') : 'Save',
        'Ground Beef Leanness': grindSettings.leanness,
        'Ground Beef Package Size': grindSettings.packageSize,
        'Hamburger Patties': patties.want ? `Yes — ${patties.pounds} lbs, ${patties.size} patties, ${patties.perPack}/pack` : 'None',
        'Liver': organMeats.liver ? 'Save' : 'No',
        'Heart': organMeats.heart ? 'Save' : 'No',
        'Tongue': organMeats.tongue ? 'Save' : 'No',
      };

      await base44.functions.invoke('sendCuttingOrder', {
        animalType: 'beef',
        customerInfo,
        orderDetails
      });

      base44.analytics.track({
        eventName: 'order_submitted',
        properties: {
          meat_type: 'beef',
          quantity: quantity,
        }
      });

      const depositLinks = {
        whole: 'https://pay.smrtpayments.com/wvp/beef-whole',
        half: 'https://pay.smrtpayments.com/wvp/beef-half',
        quarter: 'https://pay.smrtpayments.com/wvp/beef-quarter',
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
      {/* Quantity Selection */}
      <FormSection title="2. Select Quantity" defaultOpen>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'whole', label: 'Whole', hangingWeight: 700, price: '$5.50/lb', takeHome: 420, freezer: '14-18 cu ft', deposit: 1200, estTotal: 3850 },
            { id: 'half', label: 'Half', hangingWeight: 350, price: '$5.50/lb', takeHome: 180, freezer: '8-10 cu ft', deposit: 600, estTotal: 1650 },
            { id: 'quarter', label: 'Quarter', hangingWeight: 175, price: '$5.75/lb', takeHome: 105, freezer: '4-6 cu ft', deposit: 300, estTotal: 863 },
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
              <div className="text-sm font-semibold text-red-700 mt-1">{opt.price}</div>
              <div className="border-t border-stone-200 mt-2 pt-2 space-y-0.5">
                <div className="text-xs text-blue-700 font-medium">~{opt.takeHome} lbs take-home</div>
                <div className="text-xs text-cyan-700">❄ {opt.freezer}</div>
                <div className="text-xs text-stone-500">Est. ~${opt.estTotal.toLocaleString()}</div>
              </div>
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
              id="beef-fullName"
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
              id="beef-email"
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
              id="beef-phone"
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
            <SelectTrigger id="beef-pickup" className={fieldErrors.pickupLocation ? 'border-red-500 ring-1 ring-red-500' : ''}>
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

      {/* Rib Section */}
      <FormSection title="4. Rib Section" helpDefinitions={[
        { term: 'Ribeye Steaks (Boneless)', description: 'Rich, well-marbled steaks cut from the rib area. One of the most flavorful cuts — great for pan-searing or grilling.' },
        { term: 'Prime Rib Roast', description: 'A large, bone-in roast from the rib section. Ideal for slow-roasting for holidays or special gatherings.' },
        { term: 'Grind', description: 'The rib meat is added into your ground beef total. Good option if you prefer more ground beef over steaks.' },
      ]} hint="Ribeye is a top steak cut. Prime rib is great for holiday roasts.">
        <RadioGroup value={sections.rib.choice} onValueChange={(v) => updateSection('rib', 'choice', v)}>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ribeye" id="rib-ribeye" />
              <Label htmlFor="rib-ribeye">Ribeye Steaks (Boneless)</Label>
            </div>
            {sections.rib.choice === 'ribeye' && (
              <div className="ml-6 grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Thickness</Label>
                  <Select value={sections.rib.thickness} onValueChange={(v) => updateSection('rib', 'thickness', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {thicknessOptions.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Per Pack</Label>
                  <Select value={sections.rib.perPack} onValueChange={(v) => updateSection('rib', 'perPack', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {perPackOptions.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="primerib" id="rib-prime" />
              <Label htmlFor="rib-prime">Prime Rib Roast</Label>
            </div>
            {sections.rib.choice === 'primerib' && (
              <div className="ml-6">
                <Label className="text-xs">Roast Size</Label>
                <Select value={sections.rib.roastSize} onValueChange={(v) => updateSection('rib', 'roastSize', v)}>
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {roastSizeOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="grind" id="rib-grind" />
              <Label htmlFor="rib-grind">Grind <span className="text-stone-500 font-normal">(add to ground beef)</span></Label>
            </div>
          </div>
        </RadioGroup>
      </FormSection>

      {/* Loin Section */}
      <FormSection title="5. Loin Section" helpDefinitions={[
        { term: 'T-Bone Steaks', description: 'Classic steak with a T-shaped bone. One side is a strip steak and the other is a smaller tenderloin (filet). Great for grilling.' },
        { term: 'KC Strip & Filet (bone removed)', description: 'The loin is split into two boneless cuts — a Kansas City Strip (bold, beefy flavor) and a Filet Mignon (very tender, mild flavor). Two premium cuts from one section.' },
        { term: 'Grind', description: 'Loin meat goes into your ground beef total. Unusual but an option if you prefer more ground beef.' },
      ]} hint="T-Bone, KC Strip & Filet are all top steak choices.">
        <RadioGroup value={sections.loin.choice} onValueChange={(v) => updateSection('loin', 'choice', v)}>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="tbone" id="loin-tbone" />
              <Label htmlFor="loin-tbone">T-Bone Steaks</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="kcfilet" id="loin-kc" />
              <Label htmlFor="loin-kc">KC Strip & Filet (bone removed)</Label>
            </div>
            {(sections.loin.choice === 'tbone' || sections.loin.choice === 'kcfilet') && (
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
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="grind" id="loin-grind" />
              <Label htmlFor="loin-grind">Grind <span className="text-stone-500 font-normal">(add to ground beef)</span></Label>
            </div>
          </div>
        </RadioGroup>
      </FormSection>

      {/* Sirloin */}
      <FormSection title="6. Sirloin Section" helpDefinitions={[
        { term: 'Sirloin Steaks', description: 'Lean, boneless steaks with good flavor. Very versatile — great for grilling, pan-searing, or slicing thin for fajitas and kabobs.' },
        { term: 'Grind', description: 'Sirloin meat is added to your ground beef. Produces a leaner, higher-quality ground beef blend.' },
      ]} hint="Lean and flavorful. Great for grilling or kabobs.">
        <RadioGroup value={sections.sirloin.choice} onValueChange={(v) => updateSection('sirloin', 'choice', v)}>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="steaks" id="sirloin-steaks" />
              <Label htmlFor="sirloin-steaks">Sirloin Steaks</Label>
            </div>
            {sections.sirloin.choice === 'steaks' && (
              <div className="ml-6 grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Thickness</Label>
                  <Select value={sections.sirloin.thickness} onValueChange={(v) => updateSection('sirloin', 'thickness', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {thicknessOptions.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Per Pack</Label>
                  <Select value={sections.sirloin.perPack} onValueChange={(v) => updateSection('sirloin', 'perPack', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {perPackOptions.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="grind" id="sirloin-grind" />
              <Label htmlFor="sirloin-grind">Grind <span className="text-stone-500 font-normal">(add to ground beef)</span></Label>
            </div>
          </div>
        </RadioGroup>
      </FormSection>

      {/* Round */}
      <FormSection title="7. Round Section" helpDefinitions={[
        { term: 'About Round', description: 'Round comes from the rear leg — a lean, hardworking muscle. Very lean with a firm texture and mild flavor. Because it\'s lean, it can dry out if overcooked. Best cooked low and slow, sliced thin, or mechanically tenderized.' },
        { term: 'Round Steak', description: 'Lean, boneless steak from the rear leg. Best braised, slow-cooked, or sliced thin across the grain for stir-fry. Also great for jerky or deli-style roast beef.' },
        { term: 'Tenderized Round Steak', description: 'Round steak run through a mechanical blade tenderizer (cuber). Breaks down tough fibers for a softer texture — ideal for chicken-fried steak and quick pan-frying.' },
        { term: 'Minute Steak', description: 'Thin-sliced, tenderized round steak that cooks in under a minute. Great for quick weeknight meals, steak sandwiches, or stir-fry.' },
        { term: 'Round Roast', description: 'A large lean roast best slow-roasted and sliced thin for roast beef or deli meat. Also good in a slow cooker.' },
        { term: 'Grind', description: 'Round meat added to your ground beef. Produces a very lean blend — great for low-fat diets.' },
      ]} hint="Lean rear-leg muscle. Best tenderized, slow-cooked, or sliced thin.">
        <RadioGroup value={sections.round.choice} onValueChange={(v) => updateSection('round', 'choice', v)}>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="steak" id="round-steak" />
              <Label htmlFor="round-steak">Round Steak</Label>
            </div>
            {sections.round.choice === 'steak' && (
              <div className="ml-6 grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Thickness</Label>
                  <Select value={sections.round.thickness} onValueChange={(v) => updateSection('round', 'thickness', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value='1/2"'>1/2"</SelectItem>
                      <SelectItem value='3/4"'>3/4"</SelectItem>
                      <SelectItem value='1"'>1"</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Per Pack</Label>
                  <Select value={sections.round.perPack} onValueChange={(v) => updateSection('round', 'perPack', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {perPackOptions.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="tenderized" id="round-tender" />
              <Label htmlFor="round-tender">Tenderized Round Steak (3/4" thick)</Label>
            </div>
            {sections.round.choice === 'tenderized' && (
              <div className="ml-6">
                <Label className="text-xs">Per Pack</Label>
                <Select value={sections.round.perPack} onValueChange={(v) => updateSection('round', 'perPack', v)}>
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {perPackOptions.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="minute" id="round-minute" />
              <Label htmlFor="round-minute">Minute Steak (3/4" thick)</Label>
            </div>
            {sections.round.choice === 'minute' && (
              <div className="ml-6">
                <Label className="text-xs">Per Pack</Label>
                <Select value={sections.round.perPack} onValueChange={(v) => updateSection('round', 'perPack', v)}>
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {perPackOptions.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="roast" id="round-roast" />
              <Label htmlFor="round-roast">Round Roast</Label>
            </div>
            {sections.round.choice === 'roast' && (
              <div className="ml-6">
                <Label className="text-xs">Roast Size</Label>
                <Select value={sections.round.roastSize} onValueChange={(v) => updateSection('round', 'roastSize', v)}>
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {roastSizeOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="grind" id="round-grind" />
              <Label htmlFor="round-grind">Grind <span className="text-stone-500 font-normal">(add to ground beef)</span></Label>
            </div>
          </div>
        </RadioGroup>
      </FormSection>

      {/* Chuck */}
      <FormSection title="8. Chuck Section" helpDefinitions={[
        { term: 'Chuck Roast', description: 'Well-marbled shoulder roast. The classic pot roast cut — incredibly tender when braised or slow-cooked. Great for birria, barbacoa, or smoked chuck roast.' },
        { term: 'Arm Roast', description: 'A slightly leaner round-bone roast from the shoulder clod. Ideal for pot roast, shredded beef, braising, and stews.' },
      ]} hint="Both are great for pot roast, braising, and slow-cooking.">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="font-medium">Chuck Roast</Label>
            <RadioGroup value={sections.chuck.choice} onValueChange={(v) => updateSection('chuck', 'choice', v)}>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="roast" id="chuck-roast" />
                  <Label htmlFor="chuck-roast">Roast</Label>
                </div>
                {sections.chuck.choice === 'roast' && (
                  <div className="ml-6">
                    <Label className="text-xs">Roast Size</Label>
                    <Select value={sections.chuck.roastSize} onValueChange={(v) => updateSection('chuck', 'roastSize', v)}>
                      <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {roastSizeOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="grind" id="chuck-grind" />
                  <Label htmlFor="chuck-grind">Grind <span className="text-stone-500 font-normal">(add to ground beef)</span></Label>
                </div>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label className="font-medium">Arm Roast</Label>
            <RadioGroup value={sections.arm.choice} onValueChange={(v) => updateSection('arm', 'choice', v)}>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="roast" id="arm-roast" />
                  <Label htmlFor="arm-roast">Roast</Label>
                </div>
                {sections.arm.choice === 'roast' && (
                  <div className="ml-6">
                    <Label className="text-xs">Roast Size</Label>
                    <Select value={sections.arm.roastSize} onValueChange={(v) => updateSection('arm', 'roastSize', v)}>
                      <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {roastSizeOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="grind" id="arm-grind" />
                  <Label htmlFor="arm-grind">Grind <span className="text-stone-500 font-normal">(add to ground beef)</span></Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>
      </FormSection>

      {/* Brisket */}
      <FormSection title="9. Brisket" helpDefinitions={[
        { term: 'Keep Whole', description: 'The full brisket is kept intact — typically 12–16 lbs. Perfect for BBQ competitions, whole brisket smokes, or large gatherings.' },
        { term: 'Cut in Half', description: 'The brisket is cut lengthwise into two pieces, fat left on. Good if you want to smoke a brisket but don\'t need the full size.' },
        { term: 'Half Brisket (Quarter only)', description: 'Quarter beef customers receive a half brisket by default, cut from the full brisket.' },
        { term: 'Grind', description: 'Brisket is added to your ground beef. Produces rich, flavorful ground beef due to the higher fat content of brisket.' },
      ]} hint="If cut in half, it's cut lengthwise with fat left on.">
        <RadioGroup value={sections.brisket.choice} onValueChange={(v) => updateSection('brisket', 'choice', v)}>
          <div className="space-y-3">
            {!isQuarter && (
              <>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="whole" id="brisket-whole" />
                  <Label htmlFor="brisket-whole">Keep Whole</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="half" id="brisket-half" />
                  <Label htmlFor="brisket-half">Cut in Half</Label>
                </div>
              </>
            )}
            {isQuarter && (
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="halfbrisket" id="brisket-halfq" />
                <Label htmlFor="brisket-halfq">Half Brisket</Label>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="grind" id="brisket-grind" />
              <Label htmlFor="brisket-grind">Grind <span className="text-stone-500 font-normal">(add to ground beef)</span></Label>
            </div>
          </div>
        </RadioGroup>
      </FormSection>

      {/* Ribs & Soup Bones */}
      <FormSection title="10. Ribs & Soup Bones" helpDefinitions={[
        { term: 'Beef Ribs — Save', description: 'The beef back ribs are packaged for you. Great for smoking or slow-cooking.' },
        { term: 'Beef Ribs — Grind', description: 'The rib meat is trimmed off and added to your ground beef.' },
        { term: 'Short Ribs', description: 'Cut from the chuck/plate area, short ribs are thick, meaty, and loaded with flavor. They have more meat than back ribs and are best braised low and slow, smoked, or slow-cooked until fall-off-the-bone tender. Popular for Korean BBQ (kalbi), red wine braises, and BBQ.' },
        { term: 'Soup Bones — Save', description: 'Marrow-rich bones sliced to about 1.25" thick. Perfect for making rich bone broth, stock, or soups.' },
        { term: 'Soup Bones — Grind', description: 'The meat around the bones is trimmed off and added to your ground beef.' },
      ]} hint="Ribs are great for BBQ. Short ribs are meaty & perfect for braising or smoking. Soup bones make rich bone broth.">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label className="font-medium mb-2 block">Beef Ribs</Label>
            <RadioGroup value={sections.ribs.choice} onValueChange={(v) => updateSection('ribs', 'choice', v)}>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="save" id="ribs-save" />
                  <Label htmlFor="ribs-save">Save</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="grind" id="ribs-grind" />
                  <Label htmlFor="ribs-grind">Grind <span className="text-stone-500 font-normal">(add to ground beef)</span></Label>
                </div>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label className="font-medium mb-2 block">Soup Bones</Label>
            <RadioGroup value={sections.soupBones.choice} onValueChange={(v) => updateSection('soupBones', 'choice', v)}>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="save" id="soup-save" />
                  <Label htmlFor="soup-save">Save (sliced ~1.25")</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="grind" id="soup-grind" />
                  <Label htmlFor="soup-grind">Grind <span className="text-stone-500 font-normal">(add to ground beef)</span></Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>
      </FormSection>

      {/* Ground Beef Settings */}
      <FormSection title="11. Ground Beef Settings" helpDefinitions={[
        { term: '80% Lean', description: 'Standard ground beef with 20% fat. The most flavorful option and best yield. Great for burgers, meat sauce, and most recipes.' },
        { term: '85% Lean', description: 'Slightly leaner with 15% fat. A good middle ground — less shrinkage than 80% but still flavorful.' },
        { term: '90% Lean', description: 'Very lean ground beef. Less flavor and more shrinkage when cooked, but preferred for low-fat diets.' },
        { term: '1 lb packages', description: 'Each package contains 1 pound of ground beef. Good for smaller households or single meals.' },
        { term: '2 lb packages', description: 'Each package contains 2 pounds of ground beef. Great for larger families or batch cooking.' },
      ]} hint="These settings apply to ALL items sent to grind.">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Leanness</Label>
            <Select value={grindSettings.leanness} onValueChange={(v) => setGrindSettings({...grindSettings, leanness: v})}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="80%">80% Lean (Standard - Best Yield)</SelectItem>
                <SelectItem value="85%">85% Lean</SelectItem>
                <SelectItem value="90%">90% Lean</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Package Size</Label>
            <Select value={grindSettings.packageSize} onValueChange={(v) => setGrindSettings({...grindSettings, packageSize: v})}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1 lb">1 lb packages</SelectItem>
                <SelectItem value="2 lb">2 lb packages</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </FormSection>

      {/* Patties */}
      <FormSection title="12. Hamburger Patties (Optional)" helpDefinitions={[
        { term: '1/4 lb Patty', description: 'A smaller 4 oz patty. Great for kids or sliders.' },
        { term: '1/3 lb Patty', description: 'A popular standard size (~5 oz). The classic burger.' },
        { term: '1/2 lb Patty', description: 'A big, hearty 8 oz patty. Great for large-appetite burgers.' },
      ]} hint="Pre-made patties save time. Comes from your ground beef portion.">
        <div className="flex items-center space-x-2 mb-4">
          <Checkbox 
            id="want-patties"
            checked={patties.want}
            onCheckedChange={(checked) => setPatties({...patties, want: checked})}
          />
          <Label htmlFor="want-patties">Yes, I want patties (10 lb minimum)</Label>
        </div>
        {patties.want && (
          <div className="grid md:grid-cols-3 gap-4 pl-6">
            <div>
              <Label className="text-xs">Total Pounds</Label>
              <Select value={patties.pounds} onValueChange={(v) => setPatties({...patties, pounds: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 lbs</SelectItem>
                  <SelectItem value="20">20 lbs</SelectItem>
                  <SelectItem value="30">30 lbs</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Patty Size</Label>
              <Select value={patties.size} onValueChange={(v) => setPatties({...patties, size: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1/4 lb">1/4 lb</SelectItem>
                  <SelectItem value="1/3 lb">1/3 lb</SelectItem>
                  <SelectItem value="1/2 lb">1/2 lb</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Per Pack</Label>
              <Select value={patties.perPack} onValueChange={(v) => setPatties({...patties, perPack: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="8">8</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </FormSection>

      {/* Organ Meats */}
      <FormSection title="13. Organ Meats" helpDefinitions={[
        { term: 'Liver', description: 'Rich in nutrients. Beef liver can be pan-fried, made into pâté, or used in various traditional recipes.' },
        { term: 'Heart', description: 'A lean, dense muscle meat. Great sliced thin and grilled, or slow-cooked in stews. Very nutritious.' },
        { term: 'Tongue', description: 'Slow-cooked until tender, then sliced. Popular in tacos (lengua), sandwiches, and international cuisines.' },
      ]} hint="If not selected, these do NOT go into ground beef.">
        <div className="space-y-4">
          <div className="flex items-start space-x-2">
            <Checkbox id="liver" checked={organMeats.liver} onCheckedChange={(c) => setOrganMeats({...organMeats, liver: c})} className="mt-1" />
            <div>
              <Label htmlFor="liver" className="font-medium">Save Liver</Label>
              <p className="text-xs text-stone-500">Rich in iron & vitamins. Great pan-fried with onions, in pâté, or for liver and onions.</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <Checkbox id="heart" checked={organMeats.heart} onCheckedChange={(c) => setOrganMeats({...organMeats, heart: c})} className="mt-1" />
            <div>
              <Label htmlFor="heart" className="font-medium">Save Heart</Label>
              <p className="text-xs text-stone-500">Lean, tender muscle meat. Slice thin for tacos, grill like steak, or braise for stews.</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <Checkbox id="tongue" checked={organMeats.tongue} onCheckedChange={(c) => setOrganMeats({...organMeats, tongue: c})} className="mt-1" />
            <div>
              <Label htmlFor="tongue" className="font-medium">Save Tongue</Label>
              <p className="text-xs text-stone-500">Tender when slow-cooked. Popular for tacos (lengua), sandwiches, or braised dishes.</p>
            </div>
          </div>
        </div>
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
          {isSubmitting ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Submitting...</> : 'Submit Beef Order'}
        </Button>
      </div>
    </div>
  );
}