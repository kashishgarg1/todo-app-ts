import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TodoApp from './TodoApp';

describe('TodoApp', () => {
    beforeEach(() => {
        
        (global.fetch as jest.Mock) = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('creates a new task', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValue([]),
        });

        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValue({ id: 1, name: 'New Task', completed: false }),
        });

        render(<TodoApp />);
        fireEvent.change(screen.getByPlaceholderText('Add a new task'), { target: { value: 'New Task' } });
        fireEvent.click(screen.getByText('Add'));
        await waitFor(() => expect(screen.getByText('New Task')).toBeInTheDocument());
    });

    test('updates an existing task', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValue([{ id: 1, name: 'Existing Task', completed: false }]),
        });

        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValue({ id: 1, name: 'Updated Task', completed: false }),
        });

        render(<TodoApp />);
        await waitFor(() => expect(screen.getByText('Existing Task')).toBeInTheDocument());

        fireEvent.click(screen.getByText('Edit'));
        fireEvent.change(screen.getByDisplayValue('Existing Task'), { target: { value: 'Updated Task' } });
        fireEvent.click(screen.getByText('Save'));

        await waitFor(() => expect(screen.getByText('Updated Task')).toBeInTheDocument());
    });
});
