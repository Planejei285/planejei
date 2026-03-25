import { useState, useEffect } from 'react';
import { usePlanner, MonthlyData } from '@/contexts/PlannerContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Calendar } from 'lucide-react';

/**
 * MonthlyTab - Planejamento Mensal
 * Design: Soft Minimalism com Acentos Vibrantes
 * 
 * Seções:
 * - Calendário mensal visual
 * - Metas do mês
 * - Habit tracker
 * - Eventos e prazos
 * - Progresso visual
 */
export default function MonthlyTab() {
  const { monthlyData, setMonthlyData, currentDate } = usePlanner();
  const [goals, setGoals] = useState<string[]>([]);
  const [newGoal, setNewGoal] = useState('');
  const [habits, setHabits] = useState<Record<string, boolean[]>>({});
  const [newHabit, setNewHabit] = useState('');
  const [events, setEvents] = useState<Array<{ date: string; title: string; type: 'deadline' | 'event' | 'important' }>>([]);
  const [newEvent, setNewEvent] = useState<{ date: string; title: string; type: 'deadline' | 'event' | 'important' }>({ date: '', title: '', type: 'event' });

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;

  // Inicializar dados
  useEffect(() => {
    if (monthlyData?.month === monthKey) {
      setGoals(monthlyData.goals);
      setHabits(monthlyData.habits);
      setEvents(monthlyData.events);
    } else {
      // Criar novo mês
      const newMonthlyData: MonthlyData = {
        month: monthKey,
        year,
        tasks: [],
        goals: [],
        habits: {},
        events: [],
      };
      setMonthlyData(newMonthlyData);
    }
  }, [monthKey]);

  // Salvar dados
  useEffect(() => {
    setMonthlyData({
      month: monthKey,
      year,
      tasks: [],
      goals,
      habits,
      events,
    });
  }, [goals, habits, events]);

  const getDaysInMonth = () => {
    return new Date(year, month + 1, 0).getDate();
  };

  const addGoal = () => {
    if (!newGoal.trim()) return;
    setGoals([...goals, newGoal]);
    setNewGoal('');
  };

  const removeGoal = (index: number) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  const addHabit = () => {
    if (!newHabit.trim()) return;
    setHabits({ ...habits, [newHabit]: Array(getDaysInMonth()).fill(false) });
    setNewHabit('');
  };

  const removeHabit = (habitName: string) => {
    const newHabits = { ...habits };
    delete newHabits[habitName];
    setHabits(newHabits);
  };

  const toggleHabitDay = (habitName: string, day: number) => {
    setHabits({
      ...habits,
      [habitName]: habits[habitName].map((v, i) => (i === day ? !v : v)),
    });
  };

  const addEvent = () => {
    if (!newEvent.date || !newEvent.title) return;
    setEvents([...events, newEvent]);
            setNewEvent({ date: '', title: '', type: 'event' as 'deadline' | 'event' | 'important' });
  };

  const removeEvent = (index: number) => {
    setEvents(events.filter((_, i) => i !== index));
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'deadline':
        return '⏰';
      case 'important':
        return '⭐';
      case 'event':
        return '📌';
      default:
        return '•';
    }
  };

  const daysInMonth = getDaysInMonth();
  const monthName = new Date(year, month).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const habitCompletionPercentage = (habitName: string) => {
    const completed = habits[habitName]?.filter(Boolean).length || 0;
    return Math.round((completed / daysInMonth) * 100);
  };

  return (
    <div className="space-y-8">
      {/* Mês */}
      <div className="card-pink p-6">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-6 h-6 text-pink-600" />
          <h2 className="text-xl font-semibold text-gray-900">Mês</h2>
        </div>
        <p className="text-gray-600 text-lg capitalize">{monthName}</p>
      </div>

      {/* Metas do Mês */}
      <div className="card-lilac p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">🎯 Metas do Mês</h2>
        
        <div className="flex gap-2 mb-4">
          <Input
            type="text"
            placeholder="Adicionar meta..."
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addGoal()}
          />
          <Button onClick={addGoal} className="gap-2">
            <Plus className="w-4 h-4" />
            Adicionar
          </Button>
        </div>

        <div className="space-y-2">
          {goals.length === 0 ? (
            <p className="text-center text-gray-400 py-4">Nenhuma meta adicionada</p>
          ) : (
            goals.map((goal, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200"
              >
                <span className="text-gray-700">✓ {goal}</span>
                <button
                  onClick={() => removeGoal(index)}
                  className="text-gray-400 hover:text-red-500 transition-smooth"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Habit Tracker */}
      <div className="card-green p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">📊 Rastreador de Hábitos</h2>
        
        <div className="flex gap-2 mb-6">
          <Input
            type="text"
            placeholder="Adicionar hábito (ex: Beber água, Exercitar)..."
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addHabit()}
          />
          <Button onClick={addHabit} className="gap-2 bg-green-500 hover:bg-green-600">
            <Plus className="w-4 h-4" />
            Adicionar
          </Button>
        </div>

        <div className="space-y-6">
          {Object.keys(habits).length === 0 ? (
            <p className="text-center text-gray-400 py-8">Nenhum hábito adicionado</p>
          ) : (
            Object.entries(habits).map(([habitName, days]) => (
              <div key={habitName} className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">{habitName}</p>
                    <p className="text-sm text-gray-600">{habitCompletionPercentage(habitName)}% completo</p>
                  </div>
                  <button
                    onClick={() => removeHabit(habitName)}
                    className="text-gray-400 hover:text-red-500 transition-smooth"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Barra de progresso */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-smooth"
                    style={{ width: `${habitCompletionPercentage(habitName)}%` }}
                  />
                </div>

                {/* Grid de dias */}
                <div className="grid grid-cols-7 gap-1">
                  {days.map((completed, day) => (
                    <button
                      key={day}
                      onClick={() => toggleHabitDay(habitName, day)}
                      className={`
                        aspect-square rounded-lg text-xs font-semibold transition-smooth
                        ${completed ? 'bg-green-500 text-white' : 'bg-white border border-green-300 text-gray-600 hover:bg-green-100'}
                      `}
                      title={`Dia ${day + 1}`}
                    >
                      {day + 1}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Eventos e Prazos */}
      <div className="card-blue p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">📅 Eventos e Prazos</h2>
        
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <input
              type="date"
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <Input
              type="text"
              placeholder="Descrição do evento..."
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            />
            <select
              value={newEvent.type}
              onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as 'deadline' | 'event' | 'important' })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="event">Evento</option>
              <option value="deadline">Prazo</option>
              <option value="important">Importante</option>
            </select>
          </div>
          <Button onClick={addEvent} className="w-full gap-2 bg-blue-500 hover:bg-blue-600">
            <Plus className="w-4 h-4" />
            Adicionar Evento
          </Button>
        </div>

        <div className="space-y-2">
          {events.length === 0 ? (
            <p className="text-center text-gray-400 py-4">Nenhum evento adicionado</p>
          ) : (
            events.map((event, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{getEventTypeLabel(event.type)}</span>
                  <div>
                    <p className="font-medium text-gray-900">{event.title}</p>
                    <p className="text-xs text-gray-600">{new Date(event.date).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeEvent(index)}
                  className="text-gray-400 hover:text-red-500 transition-smooth"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
