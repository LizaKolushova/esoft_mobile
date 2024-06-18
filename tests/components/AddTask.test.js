import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import App from '../../App'; 

describe('Functionality Test: Adding a new task', () => {
  it('adds a new task and displays it in the task list', async () => {
    const { getByText, getByPlaceholderText } = render(<App />);

    // Переход на экран добавления задачи
    fireEvent.press(getByText('Создать задачу'));

    // Установка значений для новой задачи
    fireEvent.changeText(getByPlaceholderText('Длительность в минутах'), '45');
    fireEvent.changeText(getByPlaceholderText('Комментарий'), 'New task comment');

    // Подтверждение выбора даты и времени (эмулируем вызов handleConfirm)
    fireEvent.press(getByText('Выбрать дату и время'));
    await waitFor(() => fireEvent.press(getByText('Confirm'))); // Пример, зависит от реализации выбора даты

    // Создание новой задачи
    fireEvent.press(getByText('Создать задачу'));

    // Проверка, что задача была добавлена и отображается на экране задач
    await waitFor(() => {
      expect(getByText(/New task comment/)).toBeTruthy();
    });
  });
});
