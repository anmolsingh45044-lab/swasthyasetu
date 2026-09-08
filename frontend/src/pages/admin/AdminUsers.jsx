import React, { useState } from 'react';
import { Users } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import { requestService } from '../../services/requestService';
import { SearchBar } from '../../components/common/SearchFilter';
import { LoadingState, EmptyState, ErrorState } from '../../components/common/States';

export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const { data, loading, error, refetch } = useFetch(() => requestService.getUsers(search ? { search } : {}), [search]);
  const users = data?.users || [];

  const handleRoleChange = async (id, role) => {
    if (!window.confirm(`Change this user's role to "${role}"?`)) return;
    await requestService.updateUserRole(id, role);
    refetch();
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold">Users</h1>
      <p className="mt-1 text-ink/60">View, search and manage authorized roles.</p>

      <div className="mt-6 max-w-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name or email..." />
      </div>

      <div className="mt-6">
        {loading && <LoadingState />}
        {error && <ErrorState message={error} onRetry={refetch} />}
        {!loading && !error && users.length === 0 && <EmptyState title="No users found" icon={Users} />}
        {!loading && !error && users.length > 0 && (
          <div className="card overflow-x-auto !p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/5 text-left text-xs uppercase tracking-wide text-ink/40">
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Mode</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-black/5 last:border-0">
                    <td className="px-5 py-3 font-medium">{u.name}</td>
                    <td className="px-5 py-3 text-ink/60">{u.email}</td>
                    <td className="px-5 py-3 capitalize text-ink/60">{u.activeMode}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          u.role === 'admin' ? 'bg-rose-500 text-white' : 'bg-mist text-ink/60'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => handleRoleChange(u._id, u.role === 'admin' ? 'user' : 'admin')}
                        className="text-xs font-semibold text-rose-600 hover:underline"
                      >
                        {u.role === 'admin' ? 'Revoke admin' : 'Make admin'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
