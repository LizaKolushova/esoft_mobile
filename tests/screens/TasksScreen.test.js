import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TaskContext } from '../../src/App';
import TasksScreen from '../../src/screens/TasksScreen';

describe('TasksScreen', () => {
  const tasks = [
    { dateTime: '2024-06-18 10:00', duration: '30', taskType: 'meeting', comment: 'Discuss project' },
  ];

  const contextValue = {
    tasks,
    setTasks: jest.fn(),
    dateTime: '',
    setDateTime: jest.fn(),
    duration: '',
    setDuration: jest.fn(),
    taskType: '',
    setTaskType: jest.fn(),
    comment: '',
    setComment: jest.fn(),
  };

  it('renders tasks correctly', () => {
    const { getByText } = render(
      <TaskContext.Provider value={contextValue}>
        <TasksScreen />
      </TaskContext.Provider>
    );

    expect(getByText('2024-06-18 10:00 - meeting')).toBeTruthy();
    expect(getByText('30 мин - Discuss project')).toBeTruthy();
  });

  it('navigates to AddTask screen on button press', () => {
    const navigation = { navigate: jest.fn() };
    const { getByText } = render(
      <TaskContext.Provider value={contextValue}>
        <TasksScreen navigation={navigation} />
      </TaskContext.Provider>
    );

    fireEvent.press(getByText('Создать задачу'));
    expect(navigation.navigate).toHaveBeenCalledWith('AddTask');
  });

  it('deletes a task', () => {
    const { getByText } = render(
      <TaskContext.Provider value={contextValue}>
        <TasksScreen />
      </TaskContext.Provider>
    );

    fireEvent.press(getByText('X'));
    expect(contextValue.setTasks).toHaveBeenCalledWith([]);
  });
});