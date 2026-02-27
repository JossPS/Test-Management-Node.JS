import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { PageContainer } from '../components/PageContainer';

export function Profile() {
  const { user, logout, refreshMe } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [editing, setEditing] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setName(user?.name || '');
    setEmail(user?.email || '');
  }, [user]);

  const validateEmail = (value: string) => {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  };

  const onSave = async () => {
    setError(null);
    setSuccess(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      setError('El nombre es obligatorio');
      return;
    }

    if (!cleanEmail) {
      setError('El correo es obligatorio');
      return;
    }

    if (!validateEmail(cleanEmail)) {
      setError('El correo no tiene un formato válido');
      return;
    }

    try {
      setLoading(true);

      await api.put('/api/users/me', { name: cleanName, email: cleanEmail });

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
    <PageContainer title="Perfil">
      <div className="form">
        {!editing ? (
          <>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <div>
                <p style={{ margin: 0 }}><b>Email:</b></p>
                <p style={{ margin: '6px 0 0' }}>{user.email}</p>
              </div>

              <button className="smallBtn" onClick={() => setEditing(true)}>
                Editar
              </button>
            </div>

            <div>
              <p style={{ margin: 0 }}><b>Nombre:</b></p>
              <p style={{ margin: '6px 0 0' }}>{user.name}</p>
            </div>
          </>
        ) : (
          <div className="form">
            <label className="label">
              Nombre
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </label>

            <label className="label">
              Correo
              <input
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                inputMode="email"
                autoComplete="email"
              />
            </label>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="button" disabled={loading} onClick={onSave}>
                {loading ? 'Guardando...' : 'Guardar'}
              </button>

              <button
                className="smallBtn"
                disabled={loading}
                onClick={() => {
                  setEditing(false);
                  setName(user.name);
                  setEmail(user.email);
                  setError(null);
                  setSuccess(null);
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          {user.role === 'admin' && (
            <button className="smallBtn" onClick={() => navigate('/admin')}>
              Ir a Admin
            </button>
          )}

          <button className="smallBtn" onClick={onLogout}>
            Salir
          </button>
        </div>
      </div>
    </PageContainer>
  );
}