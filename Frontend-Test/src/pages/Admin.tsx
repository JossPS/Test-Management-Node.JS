import { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { PageContainer } from '../components/PageContainer';
import type { User } from '../types/auth';

type UsersResponse = { users: User[] };

export function Admin() {
  const { user, logout, refreshMe } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [editingMe, setEditingMe] = useState(false);
  const [myName, setMyName] = useState(user?.name || '');
  const [myEmail, setMyEmail] = useState(user?.email || '');

  const [loading, setLoading] = useState(false);
  const [savingMe, setSavingMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (user && user.role !== 'admin') {
    return <Navigate to="/profile" replace />;
  }

  useEffect(() => {
    setMyName(user?.name || '');
    setMyEmail(user?.email || '');
  }, [user]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }, [users, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get<UsersResponse>('/api/users');
        setUsers(res.data.users);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'No se pudo cargar el listado de usuarios');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [query]);

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  const onSaveMe = async () => {
    setError(null);
    setSuccess(null);

    const name = myName.trim();
    const email = myEmail.trim().toLowerCase();

    if (!name) {
      setError('El nombre es obligatorio');
      return;
    }
    if (!email) {
      setError('El correo es obligatorio');
      return;
    }
    if (!validateEmail(email)) {
      setError('El correo no tiene un formato válido');
      return;
    }

    try {
      setSavingMe(true);
      await api.put('/api/users/me', { name, email });
      await refreshMe();
      setEditingMe(false);
      setSuccess('Tu perfil fue actualizado');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al actualizar tu perfil');
    } finally {
      setSavingMe(false);
    }
  };

  if (!user) return null;

  return (
    <PageContainer
      title="Admin - Usuarios"
      actions={
        <button className="smallBtn" onClick={onLogout}>
          Salir
        </button>
      }
    >
      <div className="form">
        <div style={{ padding: 18, borderRadius: 14, border: '1px solid rgba(15, 23, 42, 0.08)' }}>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0 }}>Mi cuenta</h3>

            {!editingMe ? (
              <button className="smallBtn" onClick={() => setEditingMe(true)}>
                Editar
              </button>
            ) : (
              <button
                className="smallBtn"
                disabled={savingMe}
                onClick={() => {
                  setEditingMe(false);
                  setMyName(user.name);
                  setMyEmail(user.email);
                  setError(null);
                  setSuccess(null);
                }}
              >
                Cancelar
              </button>
            )}
          </div>

          {!editingMe ? (
            <div style={{ marginTop: 10, display: 'grid', gap: 8 }}>
              <p style={{ margin: 0 }}>
                <b>Nombre:</b> {user.name}
              </p>
              <p style={{ margin: 0 }}>
                <b>Email:</b> {user.email}
              </p>
            </div>
          ) : (
            <div className="form" style={{ marginTop: 12 }}>
              <label className="label">
                Nombre
                <input
                  className="input"
                  value={myName}
                  onChange={(e) => setMyName(e.target.value)}
                  disabled={savingMe}
                />
              </label>

              <label className="label">
                Correo
                <input
                  className="input"
                  value={myEmail}
                  onChange={(e) => setMyEmail(e.target.value)}
                  disabled={savingMe}
                  inputMode="email"
                  autoComplete="email"
                />
              </label>

              <div className="row" style={{ justifyContent: 'flex-end' }}>
                <button className="button" disabled={savingMe} onClick={onSaveMe}>
                  {savingMe ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </div>
          )}
        </div>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <label className="label">
          Buscar (nombre o email)
          <input
            className="input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ej: juan@..."
          />
        </label>

        {loading && <p>Cargando...</p>}

        {!loading && !error && (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: 10, borderBottom: '1px solid #e2e8f0' }}>
                      Nombre
                    </th>
                    <th style={{ textAlign: 'left', padding: 10, borderBottom: '1px solid #e2e8f0' }}>
                      Email
                    </th>
                    <th style={{ textAlign: 'left', padding: 10, borderBottom: '1px solid #e2e8f0' }}>
                      Rol
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((u) => (
                    <tr key={u.id}>
                      <td style={{ padding: 10, borderBottom: '1px solid #f1f5f9' }}>{u.name}</td>
                      <td style={{ padding: 10, borderBottom: '1px solid #f1f5f9' }}>{u.email}</td>
                      <td style={{ padding: 10, borderBottom: '1px solid #f1f5f9' }}>{u.role}</td>
                    </tr>
                  ))}

                  {pageItems.length === 0 && (
                    <tr>
                      <td colSpan={3} style={{ padding: 10 }}>
                        No hay resultados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                className="smallBtn"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Anterior
              </button>

              <span>
                Página {currentPage} de {totalPages}
              </span>

              <button
                className="smallBtn"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Siguiente
              </button>
            </div>
          </>
        )}
      </div>
    </PageContainer>
  );
}