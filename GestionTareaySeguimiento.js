import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Input, Select, DatePicker, Modal, message } from '@/components/ui/';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

const TaskManagementView = () => {
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'

  useEffect(() => {
    // Aquí iría la lógica para cargar las tareas desde una API
    // Por ahora, usaremos datos de ejemplo
    setTasks([
      { id: 1, description: 'Preparar informe', responsible: 'Juan', dueDate: '2024-10-01', status: 'pendiente', priority: 'alta' },
      { id: 2, description: 'Revisar presupuesto', responsible: 'María', dueDate: '2024-09-25', status: 'en progreso', priority: 'media' },
    ]);
  }, []);

  const showModal = (mode, task = {}) => {
    setModalMode(mode);
    setCurrentTask(task);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (modalMode === 'create') {
      // Lógica para crear una nueva tarea
      const newTask = { ...currentTask, id: tasks.length + 1 };
      setTasks([...tasks, newTask]);
    } else {
      // Lógica para editar una tarea existente
      setTasks(tasks.map(task => task.id === currentTask.id ? currentTask : task));
    }
    setIsModalVisible(false);
    message.success(Tarea ${modalMode === 'create' ? 'creada' : 'actualizada'} con éxito);
  };

  const handleDelete = (taskId) => {
    Modal.confirm({
      title: '¿Estás seguro de que quieres eliminar esta tarea?',
      onOk() {
        setTasks(tasks.filter(task => task.id !== taskId));
        message.success('Tarea eliminada con éxito');
      },
    });
  };

  const columns = [
    { title: 'Descripción', dataIndex: 'description', key: 'description' },
    { title: 'Responsable', dataIndex: 'responsible', key: 'responsible' },
    { title: 'Fecha de Vencimiento', dataIndex: 'dueDate', key: 'dueDate' },
    { title: 'Estado', dataIndex: 'status', key: 'status' },
    { title: 'Prioridad', dataIndex: 'priority', key: 'priority' },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button onClick={() => showModal('edit', record)} icon={<Edit />} />
          <Button onClick={() => handleDelete(record.id)} icon={<Trash2 />} />
        </>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Tareas y Seguimiento</h1>
      
      <Button onClick={() => showModal('create')} icon={<PlusCircle />} className="mb-4">
        Crear Nueva Tarea
      </Button>

      <Table columns={columns} dataSource={tasks} />

      <Modal
        title={modalMode === 'create' ? 'Crear Nueva Tarea' : 'Editar Tarea'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form layout="vertical">
          <Form.Item label="Descripción">
            <Input 
              value={currentTask.description} 
              onChange={e => setCurrentTask({...currentTask, description: e.target.value})}
            />
          </Form.Item>
          <Form.Item label="Responsable">
            <Select
              value={currentTask.responsible}
              onChange={value => setCurrentTask({...currentTask, responsible: value})}
            >
              <Select.Option value="Juan">Juan</Select.Option>
              <Select.Option value="María">María</Select.Option>
              {/* Agregar más opciones según sea necesario */}
            </Select>
          </Form.Item>
          <Form.Item label="Fecha de Vencimiento">
            <DatePicker 
              value={currentTask.dueDate} 
              onChange={date => setCurrentTask({...currentTask, dueDate: date})}
            />
          </Form.Item>
          <Form.Item label="Estado">
            <Select
              value={currentTask.status}
              onChange={value => setCurrentTask({...currentTask, status: value})}
            >
              <Select.Option value="pendiente">Pendiente</Select.Option>
              <Select.Option value="en progreso">En Progreso</Select.Option>
              <Select.Option value="completada">Completada</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Prioridad">
            <Select
              value={currentTask.priority}
              onChange={value => setCurrentTask({...currentTask, priority: value})}
            >
              <Select.Option value="baja">Baja</Select.Option>
              <Select.Option value="media">Media</Select.Option>
              <Select.Option value="alta">Alta</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TaskManagementView;