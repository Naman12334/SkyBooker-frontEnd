import React, { useEffect, useState } from 'react';
import { getAllUsers, deactivateUser, registerUser } from '../../../shared/api/adminApi';
import { User } from '../../auth/constants';
import { useAppSelector } from '../../../store/hooks';
import {
  UserX,
  ShieldCheck,
  Search,
  Filter,
  MoreVertical,
  Activity,
  Mail,
  User as UserIcon,
  Plus,
  X,
  UserPlus
} from 'lucide-react';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    passwordHash: '',
    phone: '',
    role: 'PASSENGER',
    passportNumber: '',
    nationality: ''
  });

  const { user: currentUser } = useAppSelector((state) => state.auth);
  const isAdmin = currentUser?.role === 'ADMIN';

  console.log('UserManagement: Current User Role:', currentUser?.role);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <div className="p-4 bg-red-50 rounded-full text-red-600">
          <ShieldCheck size={48} />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Access Restricted</h2>
        <p className="text-slate-500">Only administrators can manage users.</p>
      </div>
    );
  }

  const handleDeactivate = async (userId: number) => {
    if (!isAdmin) return;
    try {
      await deactivateUser(userId);
      fetchUsers();
    } catch (error) {
      console.error('Failed to deactivate user', error);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      setShowModal(false);
      resetForm();
      fetchUsers();
    } catch (error) {
      console.error('Failed to register user', error);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      passwordHash: '',
      phone: '',
      role: 'PASSENGER',
      passportNumber: '',
      nationality: ''
    });
  };

  const filteredUsers = users.filter(u =>
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">User Management</h2>
          <p className="text-slate-500 text-sm mt-1">Manage platform users and their access levels.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all w-64 shadow-sm"
            />
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md flex items-center gap-2"
            >
              <Plus size={18} />
              Add User
            </button>
          )}
          <button className="bg-white border border-slate-200 p-2.5 rounded-xl text-slate-600 transition-colors shadow-sm">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">User</th>
                <th className="px-6 py-4 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Role</th>
                <th className="px-6 py-4 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Provider</th>
                <th className="px-6 py-4 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Joined At</th>
                <th className="px-6 py-4 text-[10px] font-semibold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map((u) => (
                <tr key={u.userId} className="transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-semibold text-sm">
                        {u.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 leading-none mb-1">{u.fullName}</p>
                        <p className="text-xs text-slate-500 font-medium">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-semibold px-2 py-1 rounded-md uppercase tracking-wider
                      ${u.role === 'ADMIN' ? 'bg-purple-50 text-purple-600' :
                        u.role === 'AIRLINE_STAFF' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-600'}
                    `}>
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 lowercase">
                    <span className="text-xs font-semibold text-slate-600">{u.provider}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-500 font-medium">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 transition-opacity">
                      {isAdmin && u.isActive && (
                        <button
                          onClick={() => handleDeactivate(u.userId)}
                          className="p-2 text-slate-400 rounded-lg transition-all"
                          title="Suspend Account"
                        >
                          <UserX size={16} />
                        </button>
                      )}
                      <button className="p-2 text-slate-400 rounded-lg transition-all">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-blue-50 rounded-2xl text-blue-600">
                  <UserPlus size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Add New User</h3>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Create platform access credentials</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-full transition-colors text-slate-400"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Full Name</label>
                  <input
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                    placeholder="e.g. John Doe"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Email Address</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Password</label>
                  <input
                    required
                    type="password"
                    value={formData.passwordHash}
                    onChange={(e) => setFormData({ ...formData, passwordHash: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Phone Number</label>
                  <input
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                    placeholder="+1 234 567 890"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Assigned Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-blue-100 transition-all appearance-none cursor-pointer"
                  >
                    <option value="PASSENGER">Passenger</option>
                    <option value="AIRLINE_STAFF">Airline Staff</option>
                    <option value="ADMIN">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Passport Number</label>
                  <input
                    value={formData.passportNumber}
                    onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                    placeholder="A1234567"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Nationality</label>
                  <input
                    value={formData.nationality}
                    onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                    placeholder="Indian"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-10">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 text-sm font-bold text-slate-400 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-2 py-4 px-8 text-sm font-bold bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-2"
                >
                  <Activity size={18} className="animate-pulse" />
                  Create User Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
