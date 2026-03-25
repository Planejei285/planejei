import { useState, useEffect } from 'react';
import { usePlanner, DailyData, Task } from '@/contexts/PlannerContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Clock, Zap } from 'lucide-react';

/**
 * DailyTab - Planejamento Diário
 * Design: Soft Minimalism com Acentos Vibrantes
 * 
 * Seções:
 * - Hiperfoco (tarefas principais)
 * - Lista de tarefas com prioridades
 * - Tempo estimado x real
 * - Agenda por horários
 * - Pomodoro
 * - Controle de energia/humor
 * - Pequenas vitórias
 * - Não esquecer
 */
export default function DailyTab() {
  const { dailyData, setDailyData, currentDate } = usePlanner();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [energy, setEnergy] = useState(3);
  const [smallVictories, setSmallVictories] = useState<string[]>([]);
  const [newVictory, setNewVictory] = useState('');
  const [pomodoros, setPomodoros] = useState(0);

  // Inicializar dados do dia
  useEffect(() => {
    const dateStr = currentDate.toISOString().split('T')[0];
    if (dailyData?.date === dateStr) {
      setTasks(dailyData.tasks);
      setEnergy(dailyData.energy);
      setSmallVictories(dailyData.smallVictories);
      setPomodoros(dailyData.pomodoros);
    } else {
      // Criar novo dia
      const newDailyData: DailyData = {
        date: dateStr,
        tasks: [],
        energy: 3,
        mood: '😊',
        pomodoros: 0,
        smallVictories: [],
      };
      setDailyData(newDailyData);
    }
  }, [currentDate]);

  // Salvar dados quando mudarem
  useEffect(() => {
    const dateStr = currentDate.toISOString().split('T')[0];
    setDailyData({
      date: dateStr,
      tasks,
      energy,
      mood: '😊',
      pomodoros,
      smallVictories,
    });
  }, [tasks, energy, pomodoros, smallVictories]);

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      priority: newTaskPriority,
      completed: false,
    };
    
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setNewTaskPriority('medium');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const toggleHyperFocus = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, hyperFocus: !t.hyperFocus } : t));
  };

  const addVictory = () => {
    if (!newVictory.trim()) return;
    setSmallVictories([...smallVictories, newVictory]);
    setNewVictory('');
  };

  const removeVictory = (index: number) => {
    setSmallVictories(smallVictories.filter((_, i) => i !== index));
  };

  const hyperFocusTasks = tasks.filter(t => t.hyperFocus);
  const regularTasks = tasks.filter(t => !t.hyperFocus);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'badge-high';
      case 'medium':
        return 'badge-medium';
      case 'low':
        return 'badge-low';
      default:
        return 'badge-low';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Média';
      case 'low':
        return 'Baixa';
      default:
        return 'Média';
    }
  };

  return (
    <div className="space-y-8">
      {/* Data e Controle de Energia */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Data */}
        <div className="card-lilac p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📅 Hoje</h2>
          <p className="text-gray-600 text-lg">
            {currentDate.toLocaleDateString('pt-BR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* Controle de Energia */}
        <div className="card-pink p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">⚡ Energia</h2>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                onClick={() => setEnergy(level)}
                className={`
                  w-12 h-12 rounded-lg font-bold transition-smooth
                  ${
                    energy === level
                      ? 'bg-secondary text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hiperfoco - Tarefas Principais */}
      {hyperFocusTasks.length > 0 && (
        <div className="card-yellow p-6 border-4">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-6 h-6 text-yellow-600" />
            <h2 className="text-2xl font-bold text-yellow-900">Hiperfoco</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">Suas tarefas principais de hoje</p>
          <div className="space-y-3">
            {hyperFocusTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200"
              >
                <Checkbox
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-medium ${
                      task.completed ? 'line-through text-gray-400' : 'text-gray-900'
                    }`}
                  >
                    {task.title}
                  </p>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-gray-400 hover:text-red-500 transition-smooth"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lista de Tarefas */}
      <div className="card-blue p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">✓ Tarefas do Dia</h2>
        
        {/* Adicionar nova tarefa */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex gap-2 mb-3">
            <Input
              type="text"
              placeholder="Adicionar nova tarefa..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              className="flex-1"
            />
            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value as 'high' | 'medium' | 'low')}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
            </select>
            <Button onClick={addTask} className="gap-2">
              <Plus className="w-4 h-4" />
              Adicionar
            </Button>
          </div>
        </div>

        {/* Lista de tarefas */}
        <div className="space-y-2">
          {regularTasks.length === 0 ? (
            <p className="text-center text-gray-400 py-8">Nenhuma tarefa adicionada</p>
          ) : (
            regularTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-smooth group"
              >
                <Checkbox
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p
                      className={`font-medium ${
                        task.completed ? 'line-through text-gray-400' : 'text-gray-900'
                      }`}
                    >
                      {task.title}
                    </p>
                    <span className={getPriorityColor(task.priority)}>
                      {getPriorityLabel(task.priority)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-smooth">
                  <button
                    onClick={() => toggleHyperFocus(task.id)}
                    className={`p-1 rounded transition-smooth ${
                      task.hyperFocus
                        ? 'bg-yellow-200 text-yellow-700'
                        : 'text-gray-400 hover:text-yellow-600'
                    }`}
                    title="Marcar como hiperfoco"
                  >
                    <Zap className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-gray-400 hover:text-red-500 transition-smooth"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pomodoro e Pequenas Vitórias */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pomodoro */}
        <div className="card-green p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Pomodoro</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-5xl font-bold text-green-600">{pomodoros}</div>
            <div className="flex gap-2">
              <Button
                onClick={() => setPomodoros(Math.max(0, pomodoros - 1))}
                variant="outline"
              >
                −
              </Button>
              <Button onClick={() => setPomodoros(pomodoros + 1)} className="bg-green-500 hover:bg-green-600">
                +
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">Pomodoros completados hoje</p>
        </div>

        {/* Pequenas Vitórias */}
        <div className="card-lilac p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🎉 Pequenas Vitórias</h2>
          <div className="flex gap-2 mb-4">
            <Input
              type="text"
              placeholder="Ex: Bebi 2L de água..."
              value={newVictory}
              onChange={(e) => setNewVictory(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addVictory()}
            />
            <Button onClick={addVictory} variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {smallVictories.map((victory, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-purple-50 rounded-lg border border-purple-200"
              >
                <span className="text-sm text-gray-700">✨ {victory}</span>
                <button
                  onClick={() => removeVictory(index)}
                  className="text-gray-400 hover:text-red-500 transition-smooth"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
