import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AssetCategory, GoldPurity, TransactionType } from '../../types';
import { X, Plus, Coins, ShieldCheck, DollarSign, Building } from 'lucide-react';

export const TransactionModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { addTransaction, marketData, language } = useApp();
  const isAr = language === 'AR';

  const [type, setType] = useState<TransactionType>('BUY');
  const [assetType, setAssetType] = useState<AssetCategory>('GOLD');
  const [purity, setPurity] = useState<GoldPurity>('21K');
  const [weightGrams, setWeightGrams] = useState<number>(10);
  const [pricePerGram, setPricePerGram] = useState<number>(marketData.gold21kEGP);
  const [workmanshipFee, setWorkmanshipFee] = useState<number>(50); // EGP per gram making charge
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const handlePurityChange = (p: GoldPurity) => {
    setPurity(p);
    if (p === '24K' || p === 'BAR_24K') setPricePerGram(marketData.gold24kEGP);
    else if (p === '21K' || p === 'SOVEREIGN_COIN') setPricePerGram(marketData.gold21kEGP);
    else if (p === '18K') setPricePerGram(marketData.gold18kEGP);
  };

  const totalCost = Math.round(weightGrams * (pricePerGram + (assetType === 'GOLD' ? workmanshipFee : 0)));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTransaction({
      type,
      assetType,
      purity: assetType === 'GOLD' ? purity : undefined,
      weightGrams: assetType === 'GOLD' ? weightGrams : undefined,
      pricePerGramOrUnitEGP: pricePerGram,
      workmanshipFeePerGramEGP: workmanshipFee,
      totalAmountEGP: totalCost,
      date,
      notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto select-none">
      <div className="bg-[#0D1424] border border-amber-500/30 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
          <Coins className="w-6 h-6 text-amber-400" />
          <h2 className="text-lg font-bold text-white">
            {isAr ? 'تسجيل صفقة جديدة (شراء / بيع أصول)' : 'Record Investment Transaction'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Buy or Sell */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setType('BUY')}
              className={`py-2 rounded-lg font-bold border transition-all cursor-pointer ${
                type === 'BUY'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              {isAr ? 'شراء أصول (+)' : 'BUY (+)'}
            </button>
            <button
              type="button"
              onClick={() => setType('SELL')}
              className={`py-2 rounded-lg font-bold border transition-all cursor-pointer ${
                type === 'SELL'
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/50'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              {isAr ? 'بيع أصول (-)' : 'SELL (-)'}
            </button>
          </div>

          {/* Asset Category */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1">{isAr ? 'نوع الأصل الاستثماري' : 'Asset Category'}</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAssetType('GOLD')}
                className={`py-2 px-2 rounded-lg font-bold border text-center transition-all cursor-pointer ${
                  assetType === 'GOLD'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                {isAr ? 'ذهب / سبائك' : 'Gold Bullion'}
              </button>
              <button
                type="button"
                onClick={() => setAssetType('BANK_CERTIFICATE')}
                className={`py-2 px-2 rounded-lg font-bold border text-center transition-all cursor-pointer ${
                  assetType === 'BANK_CERTIFICATE'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                {isAr ? 'شهادة بنكية' : 'Bank CD'}
              </button>
              <button
                type="button"
                onClick={() => setAssetType('USD_CASH')}
                className={`py-2 px-2 rounded-lg font-bold border text-center transition-all cursor-pointer ${
                  assetType === 'USD_CASH'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                {isAr ? 'دولار نقدًا' : 'USD Cash'}
              </button>
            </div>
          </div>

          {/* Gold Purity (if Gold) */}
          {assetType === 'GOLD' && (
            <div>
              <label className="block text-slate-400 font-semibold mb-1">{isAr ? 'العيار والنوع' : 'Gold Purity & Format'}</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['24K', '21K', '18K', 'SOVEREIGN_COIN'] as GoldPurity[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handlePurityChange(p)}
                    className={`py-2 rounded-lg font-bold border text-center transition-all cursor-pointer ${
                      purity === p
                        ? 'bg-amber-500 text-slate-950 font-extrabold border-amber-400'
                        : 'bg-slate-900 text-slate-300 border-slate-800'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Weight or Quantity & Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">
                {assetType === 'GOLD' ? (isAr ? 'الوزن (جرام)' : 'Weight (Grams)') : (isAr ? 'الكمية' : 'Quantity')}
              </label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={weightGrams}
                onChange={(e) => setWeightGrams(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 font-mono text-white text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">
                {isAr ? 'سعر الجرام / الوحدة (EGP)' : 'Price per Gram/Unit (EGP)'}
              </label>
              <input
                type="number"
                value={pricePerGram}
                onChange={(e) => setPricePerGram(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 font-mono text-white text-sm"
                required
              />
            </div>
          </div>

          {/* Workmanship / Making charge ("Kharamiya") if Gold */}
          {assetType === 'GOLD' && (
            <div>
              <label className="block text-slate-400 font-semibold mb-1">
                {isAr ? 'مصنعية وكاش باك الجرام (EGP)' : 'Workmanship & Making Charge (EGP/g)'}
              </label>
              <input
                type="number"
                value={workmanshipFee}
                onChange={(e) => setWorkmanshipFee(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 font-mono text-white text-sm"
              />
            </div>
          )}

          {/* Date & Notes */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">{isAr ? 'تاريخ العملية' : 'Transaction Date'}</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white text-xs"
                required
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">{isAr ? 'ملاحظات / اسم التاجر' : 'Notes / Dealer Name'}</label>
              <input
                type="text"
                placeholder="e.g. BTC Ingot, El-Sagha dealer"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white text-xs"
              />
            </div>
          </div>

          {/* Total Cost Summary */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-center justify-between">
            <span className="font-bold text-slate-300">{isAr ? 'الإجمالي المتوقع:' : 'Total Transaction Value:'}</span>
            <span className="font-mono font-extrabold text-amber-400 text-base">{totalCost.toLocaleString()} EGP</span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            {isAr ? 'تأكيد وحفظ الصفقة' : 'Confirm & Save Transaction'}
          </button>
        </form>
      </div>
    </div>
  );
};
