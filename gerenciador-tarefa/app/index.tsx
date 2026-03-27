import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
  ListRenderItem,
  Keyboard
} from 'react-native';

interface Task {
  id: string;
  text: string;
  priority: number;
  dueDate: string;
}

export default function TaskManager() {
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('');
  const [dueDate, setDueDate] = useState('');

  const openModalForCreate = () => {
    setEditingId(null);
    setText('');
    setPriority('');
    setDueDate('');
    setModalVisible(true);
  };

  const openModalForEdit = (task: Task) => {
    setEditingId(task.id);
    setText(task.text);
    setPriority(task.priority.toString());
    setDueDate(task.dueDate);
    setModalVisible(true);
  };

  const handleDateChange = (input: string) => {
    const cleaned = input.replace(/\D/g, '');
    let formatted = cleaned;

    if (cleaned.length > 2) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    }
    if (cleaned.length > 4) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    }

    setDueDate(formatted);
  };

  const handleSaveTask = () => {
    if (text.trim() === '' || priority === '' || dueDate.trim() === '') {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    const priorityNumber = parseInt(priority, 10);

    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(dueDate)) {
      Alert.alert('Erro', 'O prazo deve estar no formato completo DD/MM/AAAA.');
      return;
    }

    if (editingId) {
      const updatedTasks = taskList.map(task =>
        task.id === editingId
          ? { ...task, text, priority: priorityNumber, dueDate }
          : task
      );
      setTaskList(updatedTasks);
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        text,
        priority: priorityNumber,
        dueDate,
      };
      setTaskList([...taskList, newTask]);
    }

    setModalVisible(false);
    Keyboard.dismiss();
  };

  const handleRemoveTask = (id: string) => {
    Alert.alert('Excluir', 'Deseja realmente excluir esta tarefa?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => {
          setTaskList(taskList.filter(item => item.id !== id));
        }
      }
    ]);
  };

  const parseDate = (dateString: string) => {
    const parts = dateString.split('/');
    if (parts.length === 3) {
      return new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00`).getTime();
    }
    return 0;
  };

  const sortedTasks = [...taskList].sort((a, b) => {
    const timeA = parseDate(a.dueDate);
    const timeB = parseDate(b.dueDate);
    
    if (timeA !== timeB) {
      return timeA - timeB;
    }
    return a.priority - b.priority;
  });

  const renderItem: ListRenderItem<Task> = ({ item }) => (
    <View style={styles.taskContainer}>
      <View style={styles.taskInfo}>
        <Text style={styles.taskText}>{item.text}</Text>
        <Text style={styles.taskDetails}>
          Prioridade: {item.priority} | Prazo: {item.dueDate}
        </Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={() => openModalForEdit(item)} style={styles.editButton}>
          <Text style={styles.iconText}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleRemoveTask(item.id)}>
          <Text style={styles.iconText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <TouchableOpacity style={styles.mainAddButton} onPress={openModalForCreate}>
        <Text style={styles.mainAddButtonText}>+ Nova Tarefa</Text>
      </TouchableOpacity>

      <FlatList
        data={sortedTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingId ? 'Editar Tarefa' : 'Nova Tarefa'}
            </Text>

            <Text style={styles.label}>Descrição da Tarefa</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Estudar React Native"
              value={text}
              onChangeText={setText}
            />
            
            <Text style={styles.label}>Prioridade (1 = Maior, 5 = Menor)</Text>
            <View style={styles.priorityContainer}>
              {[1, 2, 3, 4, 5].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={[
                    styles.priorityButton,
                    priority === num.toString() && styles.priorityButtonActive
                  ]}
                  onPress={() => setPriority(num.toString())}
                >
                  <Text
                    style={[
                      styles.priorityButtonText,
                      priority === num.toString() && styles.priorityButtonTextActive
                    ]}
                  >
                    {num}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <Text style={styles.label}>Prazo de Conclusão</Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/AAAA"
              keyboardType="numeric"
              maxLength={10}
              value={dueDate}
              onChangeText={handleDateChange}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSaveTask}>
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  mainAddButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  mainAddButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EAEAEA',
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CCC',
  },
  taskInfo: {
    flex: 1,
  },
  taskText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  taskDetails: {
    fontSize: 13,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    marginRight: 15,
  },
  iconText: {
    fontSize: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    height: 45,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  priorityButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#CCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  priorityButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  priorityButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  priorityButtonTextActive: {
    color: '#FFF',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#FF5252',
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});