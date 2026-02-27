import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { AuthContainer } from '../components/AuthContainer';

export function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name || !email || !password) {
      setError('Todos los campos son obligatorios');
      return;
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    try {
      setLoading(true);
      await api.post('/api/auth/register', { name, email, password });
      setSuccess('Usuario registrado exitosamente. Ahora puedes iniciar sesión.');
      setTimeout(() => navigate('/login'), 800);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer title="Registro" subtitle="Crea tu cuenta">
      <form className="form" onSubmit={onSubmit}>
        <label className="label">
          Nombre
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
        </label>

        <label className="label">
          Email
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>

        <label className="label">
          Contraseña
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <button className="authButton" disabled={loading} type="submit">
          {loading ? 'Registrando...' : 'Registrarme'}
        </button>

        <p style={{ margin: 0, textAlign: 'center' }}>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </AuthContainer>
  );
}