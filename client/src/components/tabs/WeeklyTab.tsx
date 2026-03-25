import { useState, useEffect } from 'react';
import { usePlanner, WeeklyData } from '@/contexts/PlannerContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, TrendingUp } from 'lucide-react';

/**
 * WeeklyTab - Planejamento Semanal
 * Design: Soft Minimalism com Acentos Vibrantes
 * 
 * Seções:
 * - Metas da semana
 * - Tarefas por dia
 * - Áreas da vida (trabalho, estudo, pessoal)
 * - Produtividade por dia
 * - Revisão semanal
 */
export default function WeeklyTab() {
  const { weeklyData, setWeeklyData, currentDate } = usePlanner();
  const [goals, setGoals] = useState<string[]>([]);
  const [newGoal, setNewGoal] = useState('');
  const [productivity, setProductivity] = useState<Record<string, number>>({});
  const [review, setReview] = useState({ whatWorked: '', improvements: '' });

  // Calcular semana atual
  const getWeekDates = () => {
    const curr = new Date(currentDate);
    const first = curr.getDate() - curr.getDay() + 1;
    const weekStart = new Date(curr.setDate(first));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    return { weekStart, weekEnd };
  };

  const { weekStart, weekEnd } = getWeekDates();
  const weekKey = `${weekStart.toISOString().split('T')[0]}-${weekEnd.toISOString().split('T')[0]}`;

  // Inicializar dados
  useEffect(() => {
    if (weeklyData?.weekStart === weekStart.toISOString().split('T')[0]) {
      setGoals(weeklyData.goals);
      setProductivity(weeklyData.productivity);
      if (weeklyData.review) {
        setReview({
          whatWorked: weeklyData.review.whatWorked.join('\n'),
          improvements: weeklyData.review.improvements.join('\n'),
        });
      }
    }
  }, [weekKey]);

  // Salvar dados
  useEffect(() => {
    setWeeklyData({
      weekStart: weekStart.toISOString().split('T')[0],
      weekEnd: weekEnd.toISOString().split('T')[0],
      tasks: [],
      goals,
      productivity,
      review: {
        whatWorked: review.whatWorked.split('\n').filter(Boolean),
        improvements: review.improvements.split('\n').filter(Boolean),
      },
    });
  }, [goals, productivity, review]);

  const addGoal = () => {
    if (!newGoal.trim()) return;
    setGoals([...goals, newGoal]);
    setNewGoal('');
  };

  const removeGoal = (index: number) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    return date.toISOString().split('T')[0];
  });

  const updateProductivity = (day: string, value: number) => {
    setProductivity({ ...productivity, [day]: Math.min(100, Math.max(0, value)) });
  };

  return (
    <div className="space-y-8">
      {/* Período da Semana */}
      <div className="card-pink p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">📊 Semana de</h2>
        <p className="text-gray-600">
          {weekStart.toLocaleDateString('pt-BR')} a {weekEnd.toLocaleDateString('pt-BR')}
        </p>
      </div>

      {/* Metas da Semana */}
      <div className="card-lilac p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">🎯 Metas da Semana</h2>
        
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

      {/* Produtividade por Dia */}
      <div className="card-blue p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Produtividade</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
          {daysOfWeek.map((day, index) => {
            const dayName = days[index];
            const dayDate = new Date(day);
            const prod = productivity[day] || 0;

            return (
              <div key={day} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="font-semibold text-gray-900 mb-2">{dayName}</p>
                <p className="text-xs text-gray-600 mb-3">{dayDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</p>
                
                <div className="mb-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-smooth"
                      style={{ width: `${prod}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={prod}
                    onChange={(e) => updateProductivity(day, parseInt(e.target.value))}
                    className="w-12 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                  />
                  <span className="text-xs text-gray-600">%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Revisão Semanal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* O que funcionou */}
        <div className="card-green p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">✨ O que Funcionou</h2>
          <textarea
            value={review.whatWorked}
            onChange={(e) => setReview({ ...review, whatWorked: e.target.value })}
            placeholder="Liste as coisas que funcionaram bem esta semana..."
            className="w-full p-3 border border-green-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
            rows={6}
          />
        </div>

        {/* Melhorias */}
        <div className="card-yellow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🔄 Melhorias</h2>
          <textarea
            value={review.improvements}
            onChange={(e) => setReview({ ...review, improvements: e.target.value })}
            placeholder="O que pode melhorar na próxima semana?"
            className="w-full p-3 border border-yellow-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500"
            rows={6}
          />
        </div>
      </div>
    </div>
  );
}
