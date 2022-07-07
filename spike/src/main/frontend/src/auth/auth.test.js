import {screen, fireEvent, waitFor, within} from '@testing-library/react';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import {render} from '../__tests__/react-redux';
import {login} from './redux';
import {store} from '../store';
import {App} from '../App';

describe('auth module tests', () => {
  let server;
  beforeAll(() => {
    server = setupServer();
    server.listen();
  });
  beforeEach(() => {
    window.sessionStorage.clear();
    server.resetHandlers();
    server.use(rest.all('/api/*', (req, res, ctx) => res(ctx.status(404))));
    server.use(rest.post('/api/v1/auth/login', (req, res, ctx) =>
      req.body.name === 'admin' && req.body.password === 'password' ?
        res(ctx.status(200), ctx.text('a-jwt')) : res(ctx.status(401))));
  });
  afterAll(() => {
    server.close();
  });
  describe('login', () => {
    let username;
    let password;
    let signIn;
    const renderLogin = () => {
      window.history.pushState({}, '', '/login');
      render(<App />);
      username = screen.getByLabelText(/Username/);
      password = screen.getByLabelText(/Password/);
      signIn = screen.getByText(/Sign In/);
    };
    test('with valid credentials, user logs in', async () => {
      // Given
      renderLogin();
      // When
      fireEvent.change(username, {target: {value: 'admin'}});
      fireEvent.change(password, {target: {value: 'password'}});
      fireEvent.click(signIn);
      // Then
      await waitFor(() => expect(window.location.pathname).toEqual('/tasks/pending'));
      expect(await screen.findByText(/Todo/, {selector: 'h2'})).toBeInTheDocument();
    });
    test('with invalid credentials, user gets credentials error', async () => {
      // Given
      renderLogin();
      // When
      fireEvent.change(username, {target: {value: 'admin'}});
      fireEvent.change(password, {target: {value: 'wrong'}});
      fireEvent.click(signIn);
      // Then
      expect(await screen.findByText(/Invalid credentials/)).toBeInTheDocument();
    });
    test('with server error, user gets generic error', async () => {
      // Given
      server.use(rest.post('/api/v1/auth/login',
        (req, res, ctx) => res(ctx.status(501))));
      renderLogin();
      // When
      fireEvent.change(username, {target: {value: 'admin'}});
      fireEvent.change(password, {target: {value: 'wrong'}});
      fireEvent.click(signIn);
      // Then
      expect(within(await screen.findByRole('alert')).getByText(/Error/)).toBeInTheDocument();
    });
  });
  test('user can log out of the application', async () => {
    // Given
    await store.dispatch(login({name: 'user', password: 'password'}));
    window.history.pushState({}, '', '/tasks');
    render(<App />);
    fireEvent.click(screen.getByLabelText(/Profile/));
    const logoutMenuItem = screen.getByText(/Logout/);
    // When
    fireEvent.click(logoutMenuItem);
    // Then
    await waitFor(() => expect(window.location.pathname).toEqual('/login'));
  });
})
