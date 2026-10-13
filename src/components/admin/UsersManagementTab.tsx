import React, { useState } from 'react';
import { adminService, AdminUser } from '../../services/adminService';
import { UserRole } from '../../types';
import { authService } from '../../services/authService';
import { 
  Users, 
  UserPlus, 
  Search, 
  Shield, 
  Lock, 
  Unlock, 
  Trash2, 
  Edit, 
  Check, 
  X, 
  KeyRound,
  Mail,
  Calendar,
  UserCheck
} from 'lucide-react';

export const UsersManagementTab: React.FC<{ isAr: boolean }> = ({ isAr }) => {
  const [users, setUsers] = useState<AdminUser[]>(() => adminService.getUsers());
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | UserRole>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'SUSPENDED'>('ALL');

  // Modal / Form state for new user
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('INVESTOR');
  const [newRiskProfile, setNewRiskProfile] = useState<'CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE'>('BALANCED');

  // Editing User
  const [editingUid, setEditingUid] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<UserRole>('INVESTOR');

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newDisplayName) return;

    const added = adminService.addUser({
      displayName: newDisplayName,
      email: newEmail,
      role: newRole,
      language: 'EN',
      theme: 'DARK',
      riskProfile: newRiskProfile,
      baseCurrency: 'EGP',
      status: 'ACTIVE',
    });

    setUsers(adminService.getUsers());
    authService.logAudit('USER_CREATED', `Created new user ${newEmail} (${newRole})`).catch(console.warn);

    setNewDisplayName('');
    setNewEmail('');
    setShowAddModal(false);
  };

  const handleToggleStatus = (uid: string, email: string) => {
    adminService.toggleUserStatus(uid);
    setUsers(adminService.getUsers());
    authService.logAudit('USER_STATUS_TOGGLED', `Toggled status for ${email}`).catch(console.warn);
  };

  const handleDeleteUser = (uid: string, email: string) => {
    if (window.confirm(`Are you sure you want to remove user ${email}?`)) {
      adminService.deleteUser(uid);
      setUsers(adminService.getUsers());
      authService.logAudit('USER_DELETED', `Deleted user ${email}`).catch(console.warn);
    }
  };

  const handleSaveRole = (uid: string, email: string) => {
    adminService.updateUser(uid, { role: editRole });
    setUsers(adminService.getUsers());
    setEditingUid(null);
    authService.logAudit('USER_ROLE_UPDATED', `Updated ${email} role to ${editRole}`).catch(console.warn);
  };

  const handleResetPassword = (email: string) => {
    authService.resetPassword(email).then(() => {
      alert(`Password reset link dispatched to ${email}`);
    }).catch(console.warn);
  };

  return (
    <div className="space-y-4">
      {/* Header Controls & Filters */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-[240px]">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder={isAr ? 'بحث بالاسم أو البريد الإلكتروني...' : 'Search by name or email...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 font-bold"
          >
            <option value="ALL">{isAr ? 'جميع الأدوار' : 'All Roles'}</option>
            <option value="ADMIN">ADMIN</option>
            <option value="ANALYST">ANALYST</option>
            <option value="INVESTOR">INVESTOR</option>
            <option value="GUEST">GUEST</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 font-bold"
          >
            <option value="ALL">{isAr ? 'جميع الحالات' : 'All Statuses'}</option>
            <option value="ACTIVE">{isAr ? 'نشط' : 'Active'}</option>
            <option value="SUSPENDED">{isAr ? 'موقف' : 'Suspended'}</option>
          </select>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold px-4 py-2 rounded-xl text-xs cursor-pointer flex items-center gap-2 shadow-lg shadow-amber-500/20"
        >
          <UserPlus className="w-4 h-4" />
          <span>{isAr ? 'إضافة مستخدم جديد' : 'Add New User'}</span>
        </button>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D1424] border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-400" />
                <span>{isAr ? 'إنشاء حساب مستخدم جديد' : 'Provision New System User'}</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">{isAr ? 'الاسم الكامل:' : 'Full Display Name:'}</label>
                <input
                  type="text"
                  required
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  placeholder="e.g. Cairo Wealth Partner"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">{isAr ? 'البريد الإلكتروني:' : 'Email Address:'}</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="user@goldportfolio.eg"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">{isAr ? 'الدور المصرح:' : 'System Role:'}</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="INVESTOR">INVESTOR</option>
                    <option value="ANALYST">ANALYST</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="GUEST">GUEST</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">{isAr ? 'نمط المخاطرة:' : 'Risk Profile:'}</label>
                  <select
                    value={newRiskProfile}
                    onChange={(e) => setNewRiskProfile(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="CONSERVATIVE">CONSERVATIVE</option>
                    <option value="BALANCED">BALANCED</option>
                    <option value="AGGRESSIVE">AGGRESSIVE</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold"
                >
                  {isAr ? 'حفظ الحساب' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="p-3.5">{isAr ? 'المستخدم' : 'User Identity'}</th>
                <th className="p-3.5">{isAr ? 'الدور' : 'System Role'}</th>
                <th className="p-3.5">{isAr ? 'الحالة' : 'Account Status'}</th>
                <th className="p-3.5">{isAr ? 'آخر دخول' : 'Last Active'}</th>
                <th className="p-3.5 text-right">{isAr ? 'إجراءات الإدارة' : 'Management Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    <Users className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                    <span>{isAr ? 'لم يتم العثور على مستخدمين مطبقين للشروط' : 'No users matching search filters.'}</span>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.uid} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-amber-400">
                          {u.displayName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-bold text-white block">{u.displayName}</span>
                          <span className="text-[11px] text-slate-400 font-mono">{u.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5">
                      {editingUid === u.uid ? (
                        <div className="flex items-center gap-1">
                          <select
                            value={editRole}
                            onChange={(e) => setEditRole(e.target.value as UserRole)}
                            className="bg-slate-950 border border-amber-500 rounded p-1 text-xs text-white"
                          >
                            <option value="ADMIN">ADMIN</option>
                            <option value="ANALYST">ANALYST</option>
                            <option value="INVESTOR">INVESTOR</option>
                            <option value="GUEST">GUEST</option>
                          </select>
                          <button
                            onClick={() => handleSaveRole(u.uid, u.email)}
                            className="p-1 rounded bg-emerald-500/20 text-emerald-300"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setEditingUid(null)} className="p-1 rounded bg-slate-800 text-slate-400">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`font-mono font-bold text-[10px] px-2.5 py-1 rounded-full border ${
                            u.role === 'ADMIN'
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                              : u.role === 'ANALYST'
                              ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                              : u.role === 'INVESTOR'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {u.role}
                        </span>
                      )}
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                          u.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>

                    <td className="p-3.5 font-mono text-[11px] text-slate-400">
                      {u.lastLogin.includes('T') ? new Date(u.lastLogin).toLocaleDateString() : u.lastLogin}
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setEditingUid(u.uid);
                            setEditRole(u.role);
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-amber-400 hover:bg-slate-700 cursor-pointer"
                          title="Edit Role"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleResetPassword(u.email)}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-indigo-400 hover:bg-slate-700 cursor-pointer"
                          title="Send Password Reset"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleToggleStatus(u.uid, u.email)}
                          className={`p-1.5 rounded-lg cursor-pointer ${
                            u.status === 'ACTIVE'
                              ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                          }`}
                          title={u.status === 'ACTIVE' ? 'Suspend User' : 'Activate User'}
                        >
                          {u.status === 'ACTIVE' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => handleDeleteUser(u.uid, u.email)}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-700 cursor-pointer"
                          title="Delete User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
