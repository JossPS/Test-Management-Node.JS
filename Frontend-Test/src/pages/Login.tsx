import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AuthContainer } from '../components/AuthContainer';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Email y contraseña son obligatorios');
      return;
    }

    try {
        setLoading(true);
        const loggedUser = await login(email, password);

        if (loggedUser.role === 'admin') {
        navigate('/admin');
        } else {
        navigate('/profile');
        }
    } catch (err: any) {
        setError(err?.response?.data?.message || 'Credenciales inválidas');
    } finally {
        setLoading(false);
    }
  };

   return (
    <AuthContainer title="Login" subtitle="Ingresa con tu email y contraseña">
      <form className="form" onSubmit={onSubmit}>
        <label className="label">
          Email
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="juan@example.com"
          />
        </label>

        <label className="label">
          Password
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
          />
        </label>

        {error && <p className="error">{error}</p>}

        <button className="button" disabled={loading} type="submit">
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
        <p style={{ margin: 0, textAlign: 'center' }}>
            ¿No tienes cuenta? <a href="/register">Regístrate</a>
        </p>
      </form>
    </AuthContainer>
  );
}