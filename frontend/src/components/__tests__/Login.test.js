import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import Login from '../Login';

// Mock de la API
jest.mock('../../services/api', () => ({
  __esModule: true,
  default: {
    post: jest.fn()
  }
}));

import api from '../../services/api';

// Mock de useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// Componente wrapper con providers
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
);

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('debería renderizar el formulario de login', () => {
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  it('debería mostrar error si los campos están vacíos', async () => {
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );

    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email y contraseña son obligatorios/i)).toBeInTheDocument();
    });
  });

  it('debería mostrar error si el email no es válido', async () => {
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    fireEvent.change(emailInput, { target: { value: 'email-invalido' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/el formato del correo electrónico no es válido/i)).toBeInTheDocument();
    });
  });

  it('debería llamar a la API con las credenciales correctas', async () => {
    const mockResponse = {
      data: {
        auth: true,
        token: 'mock_token',
        rol: 'administrador',
        message: 'Inicio de sesión exitoso',
        user: { id: 1, email: 'test@example.com' }
      }
    };

    api.post.mockResolvedValue(mockResponse);

    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123'
      });
    });

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('mock_token');
      expect(mockNavigate).toHaveBeenCalledWith('/dashBoard');
    });
  });

  it('debería mostrar error si las credenciales son incorrectas', async () => {
    api.post.mockRejectedValue({
      response: {
        status: 401,
        data: { error: 'Credenciales incorrectas' }
      }
    });

    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password-incorrecto' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/credenciales incorrectas/i)).toBeInTheDocument();
    });
  });

  it('debería redirigir según el rol del usuario', async () => {
    const testCases = [
      { rol: 'administrador', expectedRoute: '/dashBoard' },
      { rol: 'coordinador', expectedRoute: '/dashBoard2' },
      { rol: 'participante', expectedRoute: '/memberDashBoard' }
    ];

    for (const testCase of testCases) {
      jest.clearAllMocks();
      
      const mockResponse = {
        data: {
          auth: true,
          token: 'mock_token',
          rol: testCase.rol,
          message: 'Inicio de sesión exitoso',
          user: { id: 1, email: 'test@example.com' }
        }
      };

      api.post.mockResolvedValue(mockResponse);

      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(testCase.expectedRoute);
      });
    }
  });

  it('debería manejar errores de red', async () => {
    api.post.mockRejectedValue(new Error('Error de red'));

    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/error interno del servidor/i)).toBeInTheDocument();
    });
  });
});
