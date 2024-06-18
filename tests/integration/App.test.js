import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TaskContext, TasksScreen, AddTaskScreen } from '../../App';

const Stack = createStackNavigator();

function AppWrapper() {
  const [tasks, setTasks] = React.useState([]);
  const [dateTime, setDateTime] = React.useState('');
  const [duration, setDuration] = React.useState('');
  const [taskType, setTaskType] = React.useState('');
  const [comment, setComment] = React.useState('');

  return (
    <TaskContext.Provider
      value={{
        tasks,
        setTasks,
        dateTime,
        setDateTime,
        duration,
        setDuration,
        taskType,
        setTaskType,
        comment,
        setComment,
      }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Tasks" component={TasksScreen} />
          <Stack.Screen name="AddTask" component={AddTaskScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </TaskContext.Provider>
  );
}

describe('Integration Test: Navigation and Task Creation', () => {
  it('navigates to AddTask screen and adds a new task', () => {
    const { getByText, getByPlaceholderText } = render(<AppWrapper />);

    // Переход на экран добавления задачи
    fireEvent.press(getByText('Создать задачу'));
    expect(getByText('Дата-время')).toBeTruthy();

    // Установка значений и создание новой задачи
    fireEvent.press(getByText('Выбрать дату и время'));
    fireEvent.changeText(getByPlaceholderText('Длительность в минутах'), '45');
    fireEvent.changeText(getByPlaceholderText('Комментарий'), 'New task comment');
    fireEvent.press(getByText('Создать задачу'));

    // Проверка, что задача была добавлена и отображается на экране задач
    expect(getByText('Лист задач')).toBeTruthy();
    expect(getByText(/New task comment/)).toBeTruthy();
  });
});