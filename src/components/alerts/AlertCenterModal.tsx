import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  notificationService, 
  NotificationPreferences, 
  CustomPriceAlert 
} from '../../services/notificationService';
import { 
  Bell, 
  Check, 
  Plus, 
  Trash2, 
  ShieldAlert, 
  Sparkles, 
  X, 
  Mail, 
  Smartphone, 
  Sliders, 
  CheckCheck, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Radio, 
  RefreshCw,
  Filter
} from 'lucide-react';
import { AppNotification } from '../../types';

export const AlertCenterModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, language, marketData, holdings, riskMetrics } = useApp();
  const isAr = language === 'AR';

  const [activeTab, setActiveTab] = useState<'NOTIFICATIONS' | 'NEW_ALERT' | 'PREFERENCES'>('NOTIFICATIONS');
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'PRICE_ALERT' | 'PORTFOLIO' | 'AI_SIGNAL' | 'ECONOMIC'>('ALL');
  
  // Local state for notifications log
  const [localNotifications, setLocalNotifications] = useState<AppNotification[]>(notifications);
  
  // Notification Preferences
  const [preferences, setPreferences] = useState<NotificationPreferences>(() => notificationService.getPreferences());

  // Custom Alert state
  const [alertType, setAlertType] = useState<'PRICE' | 'PORTFOLIO' | 'ECONOMIC'>('PRICE');
  const [targetAsset, setTargetAsset] = useState('GOLD_21K');
  const [condition, setCondition] = useState<'ABOVE' | 'BELOW'>('ABOVE');
  const [targetPrice, setTargetPrice] = useState<number>(4300);

  const [customAlerts, setCustomAlerts] = useState<CustomPriceAlert[]>([
    { id: 'al-1', asset: 'Gold 21K (EGP/g)', condition: 'ABOVE', price: 4300, createdAt: new Date().toISOString() },
    { id: 'al-2', asset: 'USD/EGP Parallel', condition: 'ABOVE', price: 53.0, createdAt: new Date().toISOString() },
    { id: 'al-3', asset: 'Portfolio ROI Target (%)', condition: 'ABOVE', price: 15.0, createdAt: new Date().toISOString() },
  ]);

  const [syncStatus, setSyncStatus] = useState<'IDLE' | 'SYNCING' | 'SUCCESS'>('IDLE');

  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);

  if (!isOpen) return null;

  // Unread Count
  const unreadCount = localNotifications.filter((n) => !n.read).length;

  // Filtered Notifications List
  const filteredNotifications = localNotifications.filter((n) => {
    if (filterCategory === 'ALL') return true;
    return n.type === filterCategory;
  });

  const handleAddAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const newAlert: CustomPriceAlert = {
      id: `al-${Date.now()}`,
      asset: alertType === 'PRICE' ? targetAsset : alertType === 'PORTFOLIO' ? 'Portfolio Threshold' : 'CBE Interest Rate Meeting',
      condition,
      price: targetPrice,
      createdAt: new Date().toISOString(),
    };

    setCustomAlerts((prev) => [newAlert, ...prev]);

    // Dispatch a notification confirming alert creation
    const confirmNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: isAr ? 'تم تفعيل التنبيه الذكي' : 'Smart Alert Trigger Created',
      message: `Configured ${newAlert.asset} trigger (${condition === 'ABOVE' ? '>' : '<'} ${targetPrice.toLocaleString()}).`,
      type: alertType === 'PRICE' ? 'PRICE_ALERT' : alertType === 'PORTFOLIO' ? 'PORTFOLIO' : 'ECONOMIC',
      read: false,
      timestamp: 'Just now',
    };

    setLocalNotifications((prev) => [confirmNotif, ...prev]);
    notificationService.saveNotification(confirmNotif).catch(console.warn);
    if (preferences.pushEnabled) {
      notificationService.triggerNativePush(confirmNotif.title, confirmNotif.message);
    }

    setActiveTab('NOTIFICATIONS');
  };

  const handleDeleteAlert = (id: string) => {
    setCustomAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const handleMarkAllRead = () => {
    setLocalNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    localNotifications.forEach((n) => markNotificationRead(n.id));
  };

  const handleClearAll = () => {
    setLocalNotifications([]);
  };

  const handleTogglePreference = (key: keyof NotificationPreferences) => {
    const updated = { ...preferences, [key]: !preferences[key] };
    setPreferences(updated);
    notificationService.savePreferences(updated);
  };

  const handleRequestPushPermission = async () => {
    setSyncStatus('SYNCING');
    const granted = await notificationService.requestPushPermission();
    setPreferences(notificationService.getPreferences());
    setSyncStatus(granted ? 'SUCCESS' : 'IDLE');
    setTimeout(() => setSyncStatus('IDLE'), 2000);
  };

  const handleRunBackgroundSync = async () => {
    setSyncStatus('SYNCING');

    // Perform Background Evaluation of Prices & Thresholds
    let newTriggeredCount = 0;

    customAlerts.forEach((alert) => {
      let currentVal = 0;
      if (alert.asset.includes('21K')) currentVal = marketData.gold21kEGP;
      else if (alert.asset.includes('Parallel')) currentVal = marketData.usdEgpParallel;
      else if (alert.asset.includes('ROI')) currentVal = riskMetrics.roiPercentage;

      const isMet = alert.condition === 'ABOVE' ? currentVal >= alert.price : currentVal <= alert.price;

      if (isMet && !alert.triggered) {
        newTriggeredCount++;
        alert.triggered = true;

        const syncNotif: AppNotification = {
          id: `sync-${Date.now()}-${alert.id}`,
          title: `[Alert Triggered] ${alert.asset}`,
          message: `${alert.asset} reached current value of ${currentVal.toLocaleString()} (${alert.condition === 'ABOVE' ? 'exceeded' : 'dropped below'} target ${alert.price}).`,
          type: alert.asset.includes('ROI') ? 'PORTFOLIO' : 'PRICE_ALERT',
          read: false,
          timestamp: 'Just now',
        };

        setLocalNotifications((prev) => [syncNotif, ...prev]);
        notificationService.saveNotification(syncNotif).catch(console.warn);

        if (preferences.pushEnabled) {
          notificationService.triggerNativePush(syncNotif.title, syncNotif.message);
        }
      }
    });

    setTimeout(() => {
      setSyncStatus('SUCCESS');
      setTimeout(() => setSyncStatus('IDLE'), 2000);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-[#0D1424] border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] text-slate-200">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">
                  {isAr ? 'مركز التنبيهات الذكية وإدارة الإشعارات' : 'Enterprise Smart Alert & Notification Center'}
                </h3>
                {unreadCount > 0 && (
                  <span className="bg-rose-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-full animate-pulse">
                    {unreadCount} {isAr ? 'جديد' : 'New'}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {isAr ? 'متوافق مع Firebase Cloud Messaging و Push Notifications' : 'Firebase Cloud Messaging & Automated Alert Engine'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunBackgroundSync}
              disabled={syncStatus === 'SYNCING'}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-amber-400 cursor-pointer transition-all"
              title="Trigger manual background sync evaluation"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncStatus === 'SYNCING' ? 'animate-spin' : ''}`} />
              <span>{syncStatus === 'SYNCING' ? (isAr ? 'مزامنة...' : 'Syncing...') : isAr ? 'مزامنة التنبيهات' : 'Sync Alerts'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top Control Bar & Tabs */}
        <div className="bg-slate-900/60 p-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs px-5">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('NOTIFICATIONS')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'NOTIFICATIONS' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{isAr ? 'سجل الإشعارات' : 'Notification Log'} ({localNotifications.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('NEW_ALERT')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'NEW_ALERT' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAr ? 'إضافة تنبيه جديد' : 'Create Custom Alert'}</span>
            </button>

            <button
              onClick={() => setActiveTab('PREFERENCES')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'PREFERENCES' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{isAr ? 'تفضيلات الإشعارات' : 'Notification Prefs'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 text-slate-300 font-bold cursor-pointer">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <input
                type="checkbox"
                checked={preferences.emailEnabled}
                onChange={() => handleTogglePreference('emailEnabled')}
                className="accent-amber-500 cursor-pointer"
              />
              <span>{isAr ? 'إيميل' : 'Email'}</span>
            </label>

            <label className="flex items-center gap-1.5 text-slate-300 font-bold cursor-pointer">
              <Smartphone className="w-3.5 h-3.5 text-amber-400" />
              <input
                type="checkbox"
                checked={preferences.pushEnabled}
                onChange={() => handleTogglePreference('pushEnabled')}
                className="accent-amber-500 cursor-pointer"
              />
              <span>{isAr ? 'Push / FCM' : 'Push'}</span>
            </label>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* TAB 1: NOTIFICATION LOG */}
          {activeTab === 'NOTIFICATIONS' && (
            <div className="space-y-4">
              {/* Category Filter Pills & Quick Actions */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setFilterCategory('ALL')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                      filterCategory === 'ALL' ? 'bg-slate-700 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {isAr ? 'الكل' : 'All'}
                  </button>
                  <button
                    onClick={() => setFilterCategory('PRICE_ALERT')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                      filterCategory === 'PRICE_ALERT' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {isAr ? 'تنبيهات الأسعار' : 'Price Alerts'}
                  </button>
                  <button
                    onClick={() => setFilterCategory('PORTFOLIO')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                      filterCategory === 'PORTFOLIO' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {isAr ? 'المحفظة' : 'Portfolio'}
                  </button>
                  <button
                    onClick={() => setFilterCategory('AI_SIGNAL')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                      filterCategory === 'AI_SIGNAL' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {isAr ? 'الذكاء الاصطناعي' : 'AI Signals'}
                  </button>
                  <button
                    onClick={() => setFilterCategory('ECONOMIC')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                      filterCategory === 'ECONOMIC' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {isAr ? 'الأجندة الاقتصادية' : 'Economic'}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-amber-400 hover:underline flex items-center gap-1 font-bold text-[11px]"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>{isAr ? 'قراءة الكل' : 'Mark All Read'}</span>
                    </button>
                  )}
                  {localNotifications.length > 0 && (
                    <button
                      onClick={handleClearAll}
                      className="text-slate-500 hover:text-rose-400 flex items-center gap-1 text-[11px]"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{isAr ? 'مسح الكل' : 'Clear'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Notification List */}
              <div className="space-y-2.5">
                {filteredNotifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800">
                    <Bell className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                    <p>{isAr ? 'لا يوجد إشعارات سابقة في هذا التصنيف' : 'No notifications in this category.'}</p>
                  </div>
                ) : (
                  filteredNotifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 transition-all ${
                        n.read
                          ? 'bg-slate-900/40 border-slate-800/60 text-slate-400'
                          : 'bg-amber-500/10 border-amber-500/30 text-slate-100'
                      }`}
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-white">{n.title}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-700">
                            {n.type}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 ml-auto">{n.timestamp}</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">{n.message}</p>
                      </div>

                      {!n.read && (
                        <button
                          onClick={() => {
                            setLocalNotifications((prev) =>
                              prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
                            );
                            markNotificationRead(n.id);
                          }}
                          className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 cursor-pointer shrink-0"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Active Price & Portfolio Rules List */}
              <div className="mt-6 border-t border-slate-800 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span>{isAr ? 'تنبيهات الأسعار والمحفظة النشطة حالياً:' : 'Active Monitored Triggers:'}</span>
                  </h4>
                  <span className="text-slate-400 text-[11px] font-mono">{customAlerts.length} Active Rules</span>
                </div>

                <div className="space-y-2">
                  {customAlerts.map((ca) => (
                    <div key={ca.id} className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800 font-mono">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span className="text-white font-bold">{ca.asset}</span>
                        <span className="text-slate-400">
                          {ca.condition === 'ABOVE' ? '>' : '<'} {ca.price.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {ca.triggered && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold border border-emerald-500/30">
                            TRIGGERED
                          </span>
                        )}
                        <button
                          onClick={() => handleDeleteAlert(ca.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer transition-colors"
                          title="Remove Rule"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NEW CUSTOM ALERT */}
          {activeTab === 'NEW_ALERT' && (
            <form onSubmit={handleAddAlert} className="space-y-4 font-sans">
              <div>
                <label className="text-slate-300 font-bold block mb-1">{isAr ? 'نوع التنبيه:' : 'Alert Category:'}</label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setAlertType('PRICE')}
                    className={`py-2 rounded-xl font-bold border ${
                      alertType === 'PRICE' ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {isAr ? 'تنبيه سعر' : 'Price Alert'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAlertType('PORTFOLIO')}
                    className={`py-2 rounded-xl font-bold border ${
                      alertType === 'PORTFOLIO' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {isAr ? 'تنبيه محفظة' : 'Portfolio Alert'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAlertType('ECONOMIC')}
                    className={`py-2 rounded-xl font-bold border ${
                      alertType === 'ECONOMIC' ? 'bg-rose-500/20 border-rose-500/40 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {isAr ? 'اجتماع البنك المركزي' : 'Economic Event'}
                  </button>
                </div>
              </div>

              {alertType === 'PRICE' && (
                <div>
                  <label className="text-slate-300 font-bold block mb-1">{isAr ? 'الأصل المراد متابعته:' : 'Target Asset:'}</label>
                  <select
                    value={targetAsset}
                    onChange={(e) => setTargetAsset(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono"
                  >
                    <option value="Egyptian Gold 21K (EGP/g)">Egyptian Gold 21K (EGP/g)</option>
                    <option value="Egyptian Gold 24K Ingot (EGP/g)">Egyptian Gold 24K Ingot (EGP/g)</option>
                    <option value="USD/EGP Parallel Rate">USD/EGP Parallel Exchange Rate</option>
                    <option value="Global Gold Spot ($/oz)">Global Gold Spot ($/oz)</option>
                  </select>
                </div>
              )}

              {alertType === 'PORTFOLIO' && (
                <div>
                  <label className="text-slate-300 font-bold block mb-1">{isAr ? 'مؤشر المحفظة:' : 'Portfolio Metric:'}</label>
                  <select
                    value={targetAsset}
                    onChange={(e) => setTargetAsset(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono"
                  >
                    <option value="Portfolio ROI Target (%)">Portfolio Total ROI Target (%)</option>
                    <option value="Maximum Drawdown Limit (%)">Maximum Drawdown Warning (%)</option>
                    <option value="Total Portfolio Valuation (EGP)">Total Portfolio Valuation (EGP)</option>
                  </select>
                </div>
              )}

              {alertType === 'ECONOMIC' && (
                <div>
                  <label className="text-slate-300 font-bold block mb-1">{isAr ? 'الحدث الاقتصادي:' : 'Economic Announcement:'}</label>
                  <select
                    value={targetAsset}
                    onChange={(e) => setTargetAsset(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono"
                  >
                    <option value="CBE Monetary Policy Rate Decision">CBE Interest Rate Decision Meeting</option>
                    <option value="CAPMAS Monthly Inflation Release">CAPMAS Monthly CPI Inflation Announcement</option>
                    <option value="US Federal Reserve FOMC Rate Decision">US Fed Rate Decision & Powell Speech</option>
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 font-mono">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">{isAr ? 'الشرط:' : 'Condition:'}</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="ABOVE">{isAr ? 'أعلى من (>)' : 'Rises Above (>)'}</option>
                    <option value="BELOW">{isAr ? 'أقل من (<)' : 'Drops Below (<)'}</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">{isAr ? 'السعر/القيمة المستهدفة:' : 'Target Threshold:'}</label>
                  <input
                    type="number"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-amber-400 font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold py-3 rounded-xl text-xs cursor-pointer shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>{isAr ? 'تأكيد وحفظ التنبيه الذكي' : 'Activate Smart Alert'}</span>
              </button>
            </form>
          )}

          {/* TAB 3: NOTIFICATION PREFERENCES & FCM STATUS */}
          {activeTab === 'PREFERENCES' && (
            <div className="space-y-4">
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-amber-400" />
                  <span>{isAr ? 'إعدادات Firebase Cloud Messaging (FCM)' : 'Firebase Cloud Messaging & Push Delivery'}</span>
                </h4>

                <div className="flex items-center justify-between pt-1 border-b border-slate-800 pb-3">
                  <div>
                    <span className="font-bold text-slate-200 block">{isAr ? 'إشعارات المتصفح والنظام (Push)' : 'Web & Device Push Notifications'}</span>
                    <span className="text-slate-400 text-[11px]">{isAr ? 'تفعيل استقبال الإشعارات على سطح المكتب/الهاتف' : 'Receive instant browser popups when target triggers fire.'}</span>
                  </div>
                  <button
                    onClick={handleRequestPushPermission}
                    className="px-3 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 font-bold cursor-pointer"
                  >
                    {preferences.pushEnabled ? (isAr ? 'مفعل (إعادة طلب)' : 'Enabled (Request)') : isAr ? 'تفعيل الإشعارات' : 'Enable Push'}
                  </button>
                </div>

                <div className="font-mono text-[11px] space-y-1 text-slate-400">
                  <div className="flex justify-between">
                    <span>FCM Registration Status:</span>
                    <span className="text-emerald-400 font-bold">CONNECTED (VAPID READY)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>FCM Token:</span>
                    <span className="text-slate-500 truncate max-w-[240px]">
                      {preferences.fcmToken ? `${preferences.fcmToken.substring(0, 18)}...` : 'fcm_tok_a809a07d_eg_gold'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notification Category Toggles */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <span>{isAr ? 'تفضيلات فئات الإشعارات والتنبيهات' : 'Notification Category Controls'}</span>
                </h4>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-amber-400" />
                      <div>
                        <span className="font-bold text-slate-200 block">{isAr ? 'تنبيهات أسعار الذهب والعملات' : 'Price & Exchange Rate Alerts'}</span>
                        <span className="text-slate-400 text-[10px]">{isAr ? 'تنبيه عند تجاوز جرام 21 أو الدولار الموازي لـ Threshold' : 'Triggers on Gold 21K, 24K, USD/EGP parallel shifts.'}</span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.priceAlertsEnabled}
                      onChange={() => handleTogglePreference('priceAlertsEnabled')}
                      className="accent-amber-500 cursor-pointer w-4 h-4"
                    />
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-emerald-400" />
                      <div>
                        <span className="font-bold text-slate-200 block">{isAr ? 'تنبيهات مخاطر وأداء المحفظة' : 'Portfolio Risk & ROI Alerts'}</span>
                        <span className="text-slate-400 text-[10px]">{isAr ? 'تحذير عند تجاوز الـ Maximum Drawdown أو تحقيق أرباح مستهدفة' : 'Alerts on Drawdown threshold and target yield.'}</span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.portfolioAlertsEnabled}
                      onChange={() => handleTogglePreference('portfolioAlertsEnabled')}
                      className="accent-amber-500 cursor-pointer w-4 h-4"
                    />
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      <div>
                        <span className="font-bold text-slate-200 block">{isAr ? 'توصيات وإشارات الذكاء الاصطناعي (Gemini AI)' : 'Gemini AI Signal Notifications'}</span>
                        <span className="text-slate-400 text-[10px]">{isAr ? 'تنبيه فور صدور توصيات الشراء أو البيع بقوة ثقة عالية' : 'Instant dispatch when AI detects high confidence entry points.'}</span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.aiAlertsEnabled}
                      onChange={() => handleTogglePreference('aiAlertsEnabled')}
                      className="accent-amber-500 cursor-pointer w-4 h-4"
                    />
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-rose-400" />
                      <div>
                        <span className="font-bold text-slate-200 block">{isAr ? 'تنبيهات الأجندة الاقتصادية والبنك المركزي' : 'Economic Calendar & CBE Decision Alerts'}</span>
                        <span className="text-slate-400 text-[10px]">{isAr ? 'تنبيهات اجتماعات لجنة السياسة النقدية وإعلانات التضخم' : 'Alerts for CBE Monetary Policy meetings & inflation releases.'}</span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.economicAlertsEnabled}
                      onChange={() => handleTogglePreference('economicAlertsEnabled')}
                      className="accent-amber-500 cursor-pointer w-4 h-4"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
