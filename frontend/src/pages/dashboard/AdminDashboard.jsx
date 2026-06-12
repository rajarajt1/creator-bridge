import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Shield, Users, Megaphone, CheckCircle, Ban, ArrowUpRight, Award } from 'lucide-react';
import api from '../../utils/axios.js';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import { Skeleton } from '../../components/ui/Loader.jsx';
import { formatDate } from '../../utils/helpers.js';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [togglingId, setTogglingId] = useState(null);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
      ]);
      setStats(statsRes.data?.stats ?? null);
      setUsers(usersRes.data?.users ?? []);
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Failed to load admin data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleActive = async (userId) => {
    setTogglingId(userId);
    try {
      const { data } = await api.patch(`/admin/users/${userId}/toggle-active`);
      if (data.success) {
        toast.success(data.message);
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, isActive: data.user.isActive } : u))
        );
        // Refresh stats
        const statsRes = await api.get('/admin/stats');
        setStats(statsRes.data?.stats ?? null);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Deactivation toggle failed');
    } finally {
      setTogglingId(null);
    }
  };

  const statItems = [
    { label: 'Total Creators', value: stats?.totalCreators ?? 0, icon: Users, color: 'bg-indigo-600' },
    { label: 'Total Businesses', value: stats?.totalBusinesses ?? 0, icon: Award, color: 'bg-purple-600' },
    { label: 'Total Campaigns', value: stats?.totalCampaigns ?? 0, icon: Megaphone, color: 'bg-pink-600' },
    { label: 'Active Collabs', value: stats?.activeCollaborations ?? 0, icon: CheckCircle, color: 'bg-emerald-600' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6 p-4 sm:p-6">
        
        {/* Welcome banner */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/35 rounded-2xl text-indigo-400">
              <Shield className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Admin control center</h1>
              <p className="text-slate-300 text-sm mt-0.5">Oversee platform statistics, verify users, and manage account statuses.</p>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2.5 px-4 text-sm font-semibold transition-all border-b-2 ${
              activeTab === 'overview' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-2.5 px-4 text-sm font-semibold transition-all border-b-2 ${
              activeTab === 'users' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            User Accounts
          </button>
        </div>

        {/* Overview Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <Skeleton count={2} />
                  </div>
                ))
              ) : (
                statItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex justify-between items-start">
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{item.label}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{item.value}</p>
                      </div>
                      <div className={`p-2.5 rounded-xl text-white ${item.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Platform log preview */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                Recent Signups
              </h2>
              {isLoading ? (
                <Skeleton count={4} />
              ) : (
                <div className="divide-y divide-gray-100">
                  {users.slice(0, 5).map((u) => (
                    <div key={u._id} className="py-3 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        <Avatar src={u.avatar} name={u.name} size="sm" />
                        <div>
                          <p className="font-semibold text-gray-900">{u.name}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={u.role === 'creator' ? 'info' : 'warning'} className="uppercase tracking-wider font-semibold" size="sm">
                          {u.role}
                        </Badge>
                        <span className="text-xs text-gray-400">{formatDate(u.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Users Tab Content */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 text-base">User Management</h2>
              <span className="text-xs text-gray-500 font-medium">{users.length} registered accounts</span>
            </div>

            {isLoading ? (
              <div className="p-5 space-y-3">
                <Skeleton count={8} />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
                  <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3">User</th>
                      <th className="px-6 py-3">Role</th>
                      <th className="px-6 py-3">Joined Date</th>
                      <th className="px-6 py-3">Account Status</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <Avatar src={u.avatar} name={u.name} size="sm" />
                            <div>
                              <p className="font-semibold text-gray-900">{u.name}</p>
                              <p className="text-xs text-gray-500">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={u.role === 'admin' ? 'success' : u.role === 'creator' ? 'info' : 'warning'} className="uppercase tracking-wider font-semibold" size="sm">
                            {u.role}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-xs">
                          {formatDate(u.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 text-xs font-semibold ${
                            u.isActive ? 'text-green-700' : 'text-red-700'
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${u.isActive ? 'bg-green-700' : 'bg-red-700'}`} />
                            {u.isActive ? 'Active' : 'Deactivated'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {u.role !== 'admin' && (
                            <Button
                              variant={u.isActive ? 'danger' : 'primary'}
                              size="sm"
                              className="text-xs inline-flex items-center gap-1 py-1"
                              isLoading={togglingId === u._id}
                              onClick={() => handleToggleActive(u._id)}
                            >
                              <Ban className="h-3 w-3" />
                              {u.isActive ? 'Deactivate' : 'Activate'}
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
