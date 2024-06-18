import * as React from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Linking,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useState, useContext, useCallback } from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';

const TaskContext = React.createContext();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function App() {
  const [dateTime, setDateTime] = useState('');
  const [duration, setDuration] = useState('');
  const [taskType, setTaskType] = useState('');
  const [comment, setComment] = useState('');
  const [tasks, setTasks] = useState([]);

  function HomeStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Tasks" component={TasksScreen} />
        <Stack.Screen name="AddTask" component={AddTaskScreen} />
      </Stack.Navigator>
    );
  }

  function EsoftStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Brandbook" component={EsoftScreen} />
      </Stack.Navigator>
    );
  }

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
        <Drawer.Navigator>
          <Drawer.Screen name="Todo" component={HomeStack} />
          <Drawer.Screen name="Esoft" component={EsoftStack} />
        </Drawer.Navigator>
      </NavigationContainer>
    </TaskContext.Provider>
  );
}

const EsoftScreen = () => {
  return (
    <View style={styles.containerBrandBook}>
      <Image source={require('./assets/logo.png')} />
      <TouchableOpacity
        style={styles.buttonBrandBook}
        onPress={() =>
          Linking.openURL(
            'https://drive.google.com/file/d/1fLECtK1szQ4dtmSy-DnhE9qHthlRKkjg/view?usp=drive_link'
          )
        }>
        <Text style={styles.buttonTextBrandBook}> Брендбук кнопок </Text>
      </TouchableOpacity>
    </View>
  );
};

const TasksScreen = ({ navigation }) => {
  const {
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
  } = useContext(TaskContext);

  const deleteTask = useCallback((index) => {
    setTasks((prevTasks) => prevTasks.filter((task, i) => i !== index));
    console.log('Удаление задачи');
  }, [setTasks]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.bigtext}>Лист задач</Text>
        <Text style={styles.smalltext}>{moment().format('DD/MM/YYYY')}</Text>
      </View>
      <ScrollView>
        <FlatList
          data={tasks}
          style={styles.list}
          renderItem={({ item, index }) => (
            <View style={styles.todoItem}>
              <View>
                <Text style={styles.text}>
                  {item.dateTime.toString()} - {item.taskType}
                </Text>
                <Text style={styles.smalltext}>
                  {item.duration ? item.duration + ' мин' : ' '}
                  {item.comment ? ' - ' + item.comment : ' '}
                </Text>
              </View>
              <View style={styles.toItem}>
                <TouchableOpacity onPress={() => deleteTask(index)}>
                  <Text style={styles.removeButton}>X</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </ScrollView>
      <Button
        title="Создать задачу"
        onPress={() => navigation.navigate('AddTask')}
      />
    </View>
  );
};

const AddTaskScreen = ({ navigation }) => {
  const {
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
  } = useContext(TaskContext);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.log('A date has been picked: ', date);
    setDateTime(date.toLocaleString('en-GB'));
    hideDatePicker();
  };

  const createTask = () => {
    if (!dateTime) {
      alert('Пожалуйста, выберите дату и время.');
      return;
    }
    if (!taskType) {
      alert('Пожалуйста, выберите тип задачи.');
      return;
    }
    const newTask = { dateTime, duration, taskType, comment };
    setTasks([...tasks, newTask]);
    console.log('Создание задачи:', dateTime, duration, taskType, comment);
    setDateTime('');
    setDuration('');
    setTaskType('');
    setComment('');
    navigation.navigate('Tasks');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.bigtext}>Лист задач</Text>
        <Text style={styles.smalltext}>{moment().format('DD/MM/YYYY')}</Text>
      </View>
      <View style={styles.containerInput}>
        <View style={styles.header}>
          <View style={styles.star}>
            <Text style={styles.text}>Дата-время</Text>
            <Text style={styles.redtext}>*</Text>
          </View>
          <Button
            title={
              dateTime
                ? dateTime.toLocaleString('en-GB')
                : 'Выбрать дату и время'
            }
            onPress={showDatePicker}
          />
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="datetime"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
        </View>
        <View style={styles.header}>
          <Text style={styles.text}>Длительность</Text>
          <TextInput
            placeholder="Длительность в минутах"
            value={duration}
            onChangeText={(text) => setDuration(text)}
            style={styles.border}
          />
        </View>
        <View style={styles.header}>
          <View style={styles.star}>
            <Text style={styles.text}>Тип задачи</Text>
            <Text style={styles.redtext}>*</Text>
          </View>
          <Picker
            selectedValue={taskType}
            onValueChange={(value) => setTaskType(value)}
            mode="dropdown" // Android only
            style={styles.picker}>
            <Picker.Item label="Выберите тип" value="" />
            <Picker.Item label="Встреча с клиентом" value="meeting" />
            <Picker.Item label="Запланированный звонок" value="phone_call" />
            <Picker.Item label="Показ" value="presentation" />
          </Picker>
        </View>
        <View style={styles.header}>
          <Text style={styles.text}>Комментарий</Text>
          <TextInput
            placeholder="Комментарий"
            value={comment}
            onChangeText={(text) => setComment(text)}
            style={styles.border}
          />
        </View>
        <View style={styles.buttonadds}>
          <TouchableOpacity
            style={styles.buttonGoBack}
            onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>ВЕРНУТЬСЯ НАЗАД</Text>
          </TouchableOpacity>
          <Button title="Создать задачу" onPress={createTask} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: 10,
    marginHorizontal: 10,
  },
  buttonGoBack: {
    backgroundColor: '#ccc',
    justifyContent: 'center',
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
  },
  containerBrandBook: {
    flex: 1,
    alignItems: 'center',
    marginVertical: 50,
    marginHorizontal: 20,
  },
  buttonBrandBook: {
    backgroundColor: '#1e90ff',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 40,
  },
  buttonTextBrandBook: {
    fontWeight: '500',
    fontSize: 14,
    color: 'white',
  },
  buttonText: {
    fontWeight: '500',
    fontSize: 14,
  },
  buttonadds: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  containerInput: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 16,
  },
  bigtext: {
    fontSize: 20,
    fontWeight: '600',
  },
  smalltext: {
    fontSize: 14,
    color: 'grey',
  },
  redtext: {
    fontSize: 16,
    color: 'red',
  },
  border: {
    borderColor: '#ccc',
    borderBottomWidth: 1,
    marginLeft: 10,
    flex: 1,
  },
  star: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  picker: {
    width: 200,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  removeButton: {
    color: 'red',
  },
  list: {
    flex: 1,
    marginVertical: 20,
  },
});

export default App;
