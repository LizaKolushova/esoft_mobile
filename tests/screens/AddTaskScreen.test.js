import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TaskContext, AddTaskScreen } from '../../App';

describe('AddTaskScreen', () => {
  const contextValue = {
    tasks: [],
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

  it('creates a new task', () => {
    const navigation = { navigate: jest.fn() };
    const { getByText, getByPlaceholderText } = render(
      <TaskContext.Provider value={contextValue}>
        <AddTaskScreen navigation={navigation} />
      </TaskContext.Provider>
    );

    fireEvent.press(getByText('Выбрать дату и время'));
    fireEvent(getByPlaceholderText('Длительность в минутах'), 'onChangeText', '45');
    fireEvent(getByPlaceholderText('Комментарий'), 'onChangeText', 'New task comment');
    fireEvent.press(getByText('Создать задачу'));

    expect(contextValue.setTasks).toHaveBeenCalledWith([
      {
        dateTime: '',
        duration: '45',
        taskType: '',
        comment: 'New task comment',
      },
    ]);
    expect(navigation.navigate).toHaveBeenCalledWith('Tasks');
  });
});
