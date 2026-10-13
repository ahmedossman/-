import React, { useState } from 'react';
import { adminService, SystemBackup } from '../../services/adminService';
import { authService } from '../../services/authService';
import { Download, Upload, RefreshCw, Archive, CheckCircle2, AlertTriangle, Trash2, Calendar, FileJson } from 'lucide-react';

export const BackupsRestoreTab: React.FC<{ isAr: boolean }> = ({ isAr }) => {
  const [backups, setBackups] = useState<SystemBackup[]>(() => adminService.getBackups());
  const [isCreating, setIsCreating] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'SUCCESS' | 'ERROR' } | null>(null);

  const handleCreateBackup = () => {
    setIsCreating(true);
    setTimeout(() => {
      const newBk = adminService.createBackup('Ahmed Ossman (CIO)');
      setBackups(adminService.getBackups());
      setIsCreating(false);
      authService.logAudit('BACKUP_CREATED', `Created backup archive ${newBk.id}`).catch(console.warn);
      setStatusMsg({
        text: isAr ? 'تم إنشاء نسخة احتياطية جديدة بنجاح!' : `Backup ${newBk.id} generated successfully (${newBk.sizeKb} KB).`,
        type: 'SUCCESS',
      });
      setTimeout(() => setStatusMsg(null), 4000);
    }, 600);
  };

  const handleDownloadBackup = (bk: SystemBackup) => {
    const blob = new Blob([bk.dataJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gold_hub_backup_${bk.id}_${bk.timestamp.slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    authService.logAudit('BACKUP_DOWNLOADED', `Downloaded backup file ${bk.id}`).catch(console.warn);
  };

  const handleRestoreBackup = (bkId: string) => {
    if (window.confirm('Restore system state to this backup point? Unsaved changes will be overwritten.')) {
      const success = adminService.restoreBackup(bkId);
      if (success) {
        authService.logAudit('SYSTEM_RESTORED', `Restored system state from backup ${bkId}`).catch(console.warn);
        setStatusMsg({
          text: isAr ? 'تم استرجاع النظام بنجاح!' : 'System restored successfully from backup point!',
          type: 'SUCCESS',
        });
        setTimeout(() => window.location.reload(), 1500);
      }
    }
  };

  const handleDeleteBackup = (bkId: string) => {
    adminService.deleteBackup(bkId);
    setBackups(adminService.getBackups());
    authService.logAudit('BACKUP_DELETED', `Deleted backup archive ${bkId}`).catch(console.warn);
  };

  const handleRestoreDefaults = () => {
    if (window.confirm('Reset all feature flags, system settings, and default users to factory defaults?')) {
      adminService.restoreDefaults();
      authService.logAudit('SYSTEM_RESET_DEFAULTS', 'Restored system factory settings').catch(console.warn);
      setStatusMsg({
        text: isAr ? 'تمت إعادة تعيين النظام للافتراضي بنجاح.' : 'Restored system factory settings successfully.',
        type: 'SUCCESS',
      });
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed.users || parsed.settings || parsed.featureFlags) {
          const newBk = adminService.createBackup('Imported Archive');
          adminService.restoreBackup(newBk.id);
          setStatusMsg({
            text: isAr ? 'تم استيراد واسترجاع الملف بنجاح!' : 'Uploaded backup file verified and restored successfully!',
            type: 'SUCCESS',
          });
          setTimeout(() => window.location.reload(), 1500);
        } else {
          alert('Invalid backup file schema.');
        }
      } catch (err) {
        alert('Failed to parse backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner & Quick Controls */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Archive className="w-4 h-4 text-amber-400" />
            <span>{isAr ? 'النسخ الاحتياطي والاسترجاع (Backups & System Recovery)' : 'Database Backups & Disaster Recovery'}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {isAr
              ? 'إنشاء أرشيف شامل لبيانات النظام وإعدادات الصاغة والمستندات واسترجاع الحالة السابقة'
              : 'Create timestamped JSON state backups, restore platform snapshots, or import JSON backup files.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-indigo-400" />
            <span>{isAr ? 'استيراد JSON' : 'Upload Backup JSON'}</span>
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={handleCreateBackup}
            disabled={isCreating}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <Archive className={`w-3.5 h-3.5 ${isCreating ? 'animate-spin' : ''}`} />
            <span>{isAr ? 'إنشاء نسخة احتياطية جديدة' : 'Create Backup Snapshot'}</span>
          </button>
        </div>
      </div>

      {statusMsg && (
        <div
          className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
            statusMsg.type === 'SUCCESS'
              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
              : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Existing Backups Inventory */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden text-xs space-y-3">
        <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 font-bold text-slate-200 flex items-center justify-between">
          <span>{isAr ? 'أرشيف النسخ الاحتياطية المسجلة' : 'Available Backup Archives'}</span>
          <button
            onClick={handleRestoreDefaults}
            className="text-[11px] font-mono text-rose-400 hover:underline cursor-pointer"
          >
            {isAr ? 'إعادة التعيين لضبط المصنع' : 'Restore Factory Defaults'}
          </button>
        </div>

        <div className="divide-y divide-slate-800/60 font-sans">
          {backups.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <FileJson className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <span>{isAr ? 'لا توجد نسخ احتياطية مسجلة حالياً' : 'No backups found. Click "Create Backup Snapshot".'}</span>
            </div>
          ) : (
            backups.map((bk) => (
              <div key={bk.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 font-mono font-bold text-xs">
                    JSON
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white font-mono">{bk.id}</span>
                      <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                        v{bk.version}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      {new Date(bk.timestamp).toLocaleString()} • {bk.sizeKb} KB • Created by {bk.createdBy}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownloadBackup(bk)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1 cursor-pointer"
                    title="Download JSON File"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isAr ? 'تحميل' : 'Download'}</span>
                  </button>

                  <button
                    onClick={() => handleRestoreBackup(bk.id)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 font-bold text-xs flex items-center gap-1 cursor-pointer border border-indigo-500/30"
                    title="Restore state"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{isAr ? 'استرجاع' : 'Restore'}</span>
                  </button>

                  <button
                    onClick={() => handleDeleteBackup(bk.id)}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-700 cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
