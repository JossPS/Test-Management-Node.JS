import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { User } from '../types/auth';

export function Profile() {
  const { user, logout, refreshMe } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [editing, setEditing] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setName(user?.name || '');
  }, [user]);

  const onSave = async () => {
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    try {
      setLoading(true);
      await api.put('/api/users/me', { name });
      await refreshMe();
      setEditing(false);
      setSuccess('Perfil actualizado');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div style={{ maxWidth: 520, margin: '40px auto' }}>
      <h2>Perfil</h2>

      <p><b>Email:</b> {user.email}</p>
      <p><b>Rol:</b> {user.role}</p>

      <div style={{ marginTop: 12 }}>
        <label><b>Nombre:</b></label>
        {!editing ? (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span>{user.name}</span>
            <button onClick={() => setEditing(true)}>Editar</button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              style={{ padding: 8, flex: 1 }}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button disabled={loading} onClick={onSave}>
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
            <button disabled={loading} onClick={() => { setEditing(false); setName(user.name); }}>
              Cancelar
            </button>
          </div>
        )}
      </div>

      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <div style={{ marginTop: 24 }}>
        <button onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
}