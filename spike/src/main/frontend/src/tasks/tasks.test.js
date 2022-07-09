import {screen, fireEvent, within, waitForElementToBeRemoved} from '@testing-library/react';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import {render} from '../__tests__/react-redux';
import {login} from '../auth';
import {store} from '../store';
import {App} from '../App';

describe('tasks module tests', () => {
  let server;
  beforeAll(() => {
    server = setupServer();
    server.listen();
  });
  beforeEach(async () => {
    server.resetHandlers();
    server.use(rest.all('/api/*', (req, res, ctx) => res(ctx.status(404))));
    server.use(rest.get('/api/v1/projects', (req, res, ctx) =>
      res(ctx.status(200), ctx.json([{id: 0, name: 'Work stuff'}, {id: 1, name: 'Home stuff'}]))));
    // all task module interaction requires a logged-in user
    server.use(rest.post('/api/v1/auth/login', (req, res, ctx) =>
      res(ctx.status(200), ctx.text('a-jwt'))));
    server.use(rest.get('/api/v1/users/self', (req, res, ctx) =>
      res(ctx.status(200), ctx.json({id: 0, name: 'user', roles: ['user', 'admin']}))));
    await store.dispatch(login({name: 'user', password: 'password'}));
    window.history.pushState({}, '', '/');
  });
  afterAll(() => {
    server.close();
  });
  describe('users can create tasks', () => {
    let taskRequestBody;
    beforeEach(() => {
      server.use(rest.post('/api/v1/tasks', (req, res, ctx) => {
        taskRequestBody = req.body;
        return req.body.title === 'new-task' ?
          res(ctx.status(201), ctx.json({...req.body})) : res(ctx.status(401));
      }));
    });
    const renderApp = async () => {
      render(<App />);
      await screen.findByLabelText(/Work stuff/);
    };
    test('from top bar', async () => {
      // Given
      await renderApp();
      fireEvent.click(screen.getByLabelText('Quick Add'));
      const dialog = screen.getByRole('dialog');
      fireEvent.change(within(dialog).getByLabelText(/Title/), {target: {value: 'new-task'}});
      // When
      fireEvent.click(screen.getByText(/save/));
      // Then
      await waitForElementToBeRemoved(dialog);
      expect(screen.queryByRole('dialog')).toBeNull();
    });
    test('from tasks page', async () => {
      // Given
      await renderApp();
      fireEvent.click(screen.getByText('Add task'));
      const dialog = screen.getByRole('dialog');
      fireEvent.change(within(dialog).getByLabelText(/Title/), {target: {value: 'new-task'}});
      fireEvent.change(within(dialog).getByLabelText(/Description/), {target: {value: 'A description'}});
      // When
      fireEvent.click(screen.getByText(/save/));
      // Then
      await waitForElementToBeRemoved(dialog);
      expect(screen.queryByRole('dialog')).toBeNull();
      expect(taskRequestBody.description).toEqual('A description');
    });
    test('with priority', async () => {
      // Given
      await renderApp();
      fireEvent.click(screen.getByText('Add task'));
      const dialog = screen.getByRole('dialog');
      fireEvent.change(within(dialog).getByLabelText(/Title/), {target: {value: 'new-task'}});
      fireEvent.click(within(dialog).getByTestId('FlagOutlinedIcon'));
      fireEvent.click(await screen.findByText(/Priority 2/));
      // When
      fireEvent.click(screen.getByText(/save/));
      // Then
      await waitForElementToBeRemoved(dialog);
      expect(screen.queryByRole('dialog')).toBeNull();
      expect(taskRequestBody.priority).toEqual(2);
    });
    test('with project', async () => {
      // Given
      await renderApp();
      fireEvent.click(screen.getByText('Add task'));
      const dialog = screen.getByRole('dialog');
      fireEvent.change(within(dialog).getByLabelText(/Title/), {target: {value: 'new-task'}});
      fireEvent.click(within(dialog).getByTestId('LocalOfferIcon'));
      fireEvent.click(within(await screen.findByRole('menu')).getByText(/Home stuff/));
      // When
      fireEvent.click(screen.getByText(/save/));
      // Then
      await waitForElementToBeRemoved(dialog);
      expect(screen.queryByRole('dialog')).toBeNull();
      expect(taskRequestBody.project).toMatchObject({id: 1, name: 'Home stuff'});
    });
  });
  describe('users can list tasks', () => {
    beforeEach(() => {
      server.use(rest.get('/api/v1/tasks', (req, res, ctx) =>
        res(ctx.status(200), ctx.json([
          {id: 0, title: 'Pending task 1', description: 'A description', priority: 1, project: {id: 0, name: 'Work stuff'}},
          {id: 1, title: 'Pending task 2', project: {id: 1, name: 'Home stuff'}},
          {id: 2, title: 'Completed task 3', complete: '2015-10-21', project: {id: 1, name: 'Home stuff'}},
        ]))
      ));
    });
    test('pending', async () => {
      // Given
      render(<App />);
      // When
      await screen.findByText(/Pending task 1/);
      // Then
      expect(screen.queryAllByTestId('RadioButtonUncheckedIcon')).toHaveLength(2);
      expect(screen.queryAllByTestId('CheckCircleIcon')).toHaveLength(0);
      expect(screen.getByText(/Pending task 1/)).toBeInTheDocument();
      expect(screen.getByText(/Pending task 2/)).toBeInTheDocument();
      expect(screen.queryByText(/Completed task 3/)).not.toBeInTheDocument();
    });
    test('completed', async () => {
      // Given
      window.history.pushState({}, '', '/tasks/completed');
      render(<App />);
      // When
      await screen.findByText(/Completed task 3/);
      // Then
      expect(screen.queryAllByTestId('RadioButtonUncheckedIcon')).toHaveLength(0);
      expect(screen.queryAllByTestId('CheckCircleIcon')).toHaveLength(1);
      expect(screen.getByText(/Completed task 3/)).toBeInTheDocument();
      expect(screen.queryByText(/Pending task 1/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Pending task 2/)).not.toBeInTheDocument();
    });
    test('for project', async () => {
      // Given
      render(<App />);
      fireEvent.click(await screen.findByText(/Work stuff/, {selector: 'a.MuiListItemButton-root span'}));
      await screen.findByText(/Work stuff/, {selector: 'h2'});
      // When
      await screen.findByText(/Pending task 1/);
      // Then
      expect(screen.queryAllByTestId('RadioButtonUncheckedIcon')).toHaveLength(1);
      expect(screen.queryAllByTestId('CheckCircleIcon')).toHaveLength(0);
      expect(screen.getByText(/Pending task 1/)).toBeInTheDocument();
      expect(screen.queryByText(/Completed task 3/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Pending task 2/)).not.toBeInTheDocument();
    });
  });
})
