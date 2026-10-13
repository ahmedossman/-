import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { authService } from '../../services/authService';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  ShieldCheck, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  LogOut,
  Sparkles,
  Send
} from 'lucide-react';
import { UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { language, role, setRole } = useApp();
  const isAr = language === 'AR';

  const [mode, setMode] = useState<'LOGIN' | 'REGISTER' | 'RESET' | 'PROFILE'>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'SUCCESS' | 'ERROR' } | null>(null);

  if (!isOpen) return null;

  const currentUser = authService.getCurrentUser();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const profile = await authService.loginWithEmail(email, password);
      setRole(profile.role);
      setMessage({
        text: isAr ? 'تم تسجيل الدخول بنجاح!' : 'Successfully signed in to Enterprise Platform!',
        type: 'SUCCESS',
      });
      setTimeout(() => {
        onClose();
        setMessage(null);
      }, 1200);
    } catch (err: any) {
      setMessage({
        text: err.message || (isAr ? 'فشل تسجيل الدخول. يرجى التحقق من البيانات.' : 'Failed to sign in. Please verify credentials.'),
        type: 'ERROR',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const profile = await authService.registerWithEmail(email, password, displayName);
      setRole(profile.role);
      setMessage({
        text: isAr ? 'تم إنشاء الحساب وإرسال رابط التفعيل إلى بريدك الإلكتروني!' : 'Account created! Verification link sent to your email.',
        type: 'SUCCESS',
      });
      setTimeout(() => {
        onClose();
        setMessage(null);
      }, 1500);
    } catch (err: any) {
      setMessage({
        text: err.message || (isAr ? 'فشل إنشاء الحساب. يرجى استخدام كلمة مرور أقوى.' : 'Failed to register account.'),
        type: 'ERROR',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const profile = await authService.loginWithGoogle();
      setRole(profile.role);
      setMessage({
        text: isAr ? 'تم تسجيل الدخول بواسطة حساب Google بنجاح!' : 'Successfully authenticated with Google!',
        type: 'SUCCESS',
      });
      setTimeout(() => {
        onClose();
        setMessage(null);
      }, 1200);
    } catch (err: any) {
      setMessage({
        text: err.message || (isAr ? 'فشل تسجيل الدخول بواسطة Google.' : 'Failed to sign in with Google.'),
        type: 'ERROR',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await authService.resetPassword(email);
      setMessage({
        text: isAr ? 'تم إرسال رابط إعادة ضبط كلمة المرور إلى بريدك الإلكتروني!' : 'Password reset link sent to your email address.',
        type: 'SUCCESS',
      });
    } catch (err: any) {
      setMessage({
        text: err.message || (isAr ? 'لم نتمكن من إرسال رابط إعادة الضبط.' : 'Failed to send reset link.'),
        type: 'ERROR',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendVerification = async () => {
    setLoading(true);
    try {
      await authService.triggerEmailVerification();
      setMessage({
        text: isAr ? 'تم إرسال بريد التفعيل بنجاح!' : 'Verification email dispatched!',
        type: 'SUCCESS',
      });
    } catch (err: any) {
      setMessage({
        text: err.message || 'Failed to send verification email.',
        type: 'ERROR',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    setRole('GUEST');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md select-none">
      <div className="bg-[#0D1424] border border-amber-500/30 rounded-2xl w-full max-w-md p-6 shadow-2xl relative space-y-5 text-slate-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">
              {mode === 'LOGIN' && (isAr ? 'تسجيل الدخول - Gold Hub Enterprise' : 'Enterprise Authentication')}
              {mode === 'REGISTER' && (isAr ? 'إنشاء حساب استثماري جديد' : 'Register Investment Account')}
              {mode === 'RESET' && (isAr ? 'استعادة كلمة المرور' : 'Password Recovery')}
              {mode === 'PROFILE' && (isAr ? 'ملف المستثمر وتفاصيل الجلسة' : 'User Security & Profile')}
            </h3>
            <p className="text-xs text-slate-400">
              {isAr ? 'منظومة حماية ودخول متوافقة مع Firebase Security' : 'Protected by Firebase Auth & Role Security'}
            </p>
          </div>
        </div>

        {/* Status Message */}
        {message && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-center gap-2 font-semibold ${
              message.type === 'SUCCESS'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
            }`}
          >
            {message.type === 'SUCCESS' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* MODE: LOGIN */}
        {mode === 'LOGIN' && (
          <form onSubmit={handleEmailLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">{isAr ? 'البريد الإلكتروني' : 'Email Address'}</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="investor@goldportfolio.eg"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white focus:border-amber-400 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-400 font-semibold">{isAr ? 'كلمة المرور' : 'Password'}</label>
                <button
                  type="button"
                  onClick={() => setMode('RESET')}
                  className="text-amber-400 hover:underline text-[11px]"
                >
                  {isAr ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white focus:border-amber-400 outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm cursor-pointer shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>{loading ? (isAr ? 'جاري الدخول...' : 'Authenticating...') : isAr ? 'دخول المنصة' : 'Sign In'}</span>
            </button>

            <div className="relative py-2 flex items-center justify-center">
              <span className="bg-[#0D1424] px-2 text-[10px] uppercase tracking-wider text-slate-500 font-bold z-10">
                {isAr ? 'أو عبر' : 'Or authenticate with'}
              </span>
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold cursor-pointer flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'الدخول بواسطة Google' : 'Sign In with Google'}</span>
            </button>

            <div className="text-center pt-2 text-slate-400">
              {isAr ? 'ليس لديك حساب؟ ' : "Don't have an account? "}
              <button
                type="button"
                onClick={() => setMode('REGISTER')}
                className="text-amber-400 font-bold hover:underline"
              >
                {isAr ? 'إنشاء حساب استثماري' : 'Register Now'}
              </button>
            </div>
          </form>
        )}

        {/* MODE: REGISTER */}
        {mode === 'REGISTER' && (
          <form onSubmit={handleEmailRegister} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">{isAr ? 'الاسم الكامل' : 'Full Name / Display Name'}</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Ahmed Ossman"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white focus:border-amber-400 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">{isAr ? 'البريد الإلكتروني' : 'Email Address'}</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="investor@goldportfolio.eg"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white focus:border-amber-400 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">{isAr ? 'كلمة المرور' : 'Password'}</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white focus:border-amber-400 outline-none"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-sm cursor-pointer shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4" />
              <span>{loading ? (isAr ? 'جاري الإنشاء...' : 'Creating Account...') : isAr ? 'تسجيل حساب جديد' : 'Create Account'}</span>
            </button>

            <div className="text-center pt-2 text-slate-400">
              {isAr ? 'لديك حساب بالفعل؟ ' : 'Already have an account? '}
              <button
                type="button"
                onClick={() => setMode('LOGIN')}
                className="text-amber-400 font-bold hover:underline"
              >
                {isAr ? 'تسجيل الدخول' : 'Sign In'}
              </button>
            </div>
          </form>
        )}

        {/* MODE: RESET PASSWORD */}
        {mode === 'RESET' && (
          <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">{isAr ? 'أدخل البريد الإلكتروني للربط' : 'Registered Email Address'}</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="investor@goldportfolio.eg"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white focus:border-amber-400 outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-sm cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? (isAr ? 'جاري الإرسال...' : 'Sending Link...') : isAr ? 'إرسال رابط الاستعادة' : 'Send Recovery Link'}</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('LOGIN')}
              className="w-full text-center text-slate-400 hover:text-white pt-2 block"
            >
              {isAr ? '← العودة لصفحة الدخول' : '← Back to Sign In'}
            </button>
          </form>
        )}

        {/* MODE: PROFILE */}
        {mode === 'PROFILE' && (
          <div className="space-y-4 text-xs">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 font-mono">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">{isAr ? 'المستخدم:' : 'Name:'}</span>
                <span className="text-amber-400 font-bold">{currentUser.displayName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">{isAr ? 'البريد:' : 'Email:'}</span>
                <span className="text-white font-bold">{currentUser.email}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">{isAr ? 'الرتبة:' : 'Role:'}</span>
                <span className="text-indigo-400 font-bold">{role}</span>
              </div>
            </div>

            <button
              onClick={handleSendVerification}
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold cursor-pointer flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'إعادة إرسال بريد تفعيل الحساب' : 'Resend Email Verification'}</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full py-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold text-sm cursor-pointer flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>{isAr ? 'تسجيل الخروج من المنصة' : 'Sign Out'}</span>
            </button>
          </div>
        )}

        {/* Bottom Switch Tab */}
        {currentUser && mode !== 'PROFILE' && (
          <div className="pt-2 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={() => setMode('PROFILE')}
              className="text-xs text-slate-400 hover:text-amber-400"
            >
              {isAr ? 'عرض حسابك الحالي وإعدادات الجلسة' : 'View Current Active Session Profile'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
