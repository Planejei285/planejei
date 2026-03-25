import { useState } from 'react';
import { usePlanner, Reward } from '@/contexts/PlannerContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Star, Gift } from 'lucide-react';

/**
 * RewardsTab - Recompensas e Gamificação
 * Design: Soft Minimalism com Acentos Vibrantes
 * 
 * Seções:
 * - Pontos totais
 * - Recompensas diárias
 * - Recompensas semanais
 * - Recompensas mensais
 * - Progresso visual
 */
export default function RewardsTab() {
  const { rewards, setRewards, totalPoints, setTotalPoints } = usePlanner();
  const [newReward, setNewReward] = useState<{ title: string; description: string; type: 'daily' | 'weekly' | 'monthly'; pointsRequired: string }>({ title: '', description: '', type: 'daily', pointsRequired: '' });

  const dailyRewards = rewards.filter(r => r.type === 'daily');
  const weeklyRewards = rewards.filter(r => r.type === 'weekly');
  const monthlyRewards = rewards.filter(r => r.type === 'monthly');

  const addReward = () => {
    if (!newReward.title || !newReward.pointsRequired) return;

    const reward: Reward = {
      id: Date.now().toString(),
      title: newReward.title,
      description: newReward.description,
      type: newReward.type,
      pointsRequired: parseInt(newReward.pointsRequired),
      completed: false,
    };

    setRewards([...rewards, reward]);
    setNewReward({ title: '', description: '', type: 'daily', pointsRequired: '' });
  };

  const removeReward = (id: string) => {
    setRewards(rewards.filter(r => r.id !== id));
  };

  const completeReward = (id: string) => {
    const reward = rewards.find(r => r.id === id);
    if (reward && !reward.completed && totalPoints >= reward.pointsRequired) {
      setRewards(rewards.map(r => r.id === id ? { ...r, completed: true } : r));
      setTotalPoints(totalPoints - reward.pointsRequired);
    }
  };

  const addPoints = (amount: number) => {
    setTotalPoints(totalPoints + amount);
  };

  const RewardCard = ({ reward }: { reward: Reward }) => (
    <div
      className={`p-4 rounded-lg border-2 transition-smooth ${
        reward.completed
          ? 'bg-blue-50 border-blue-300 opacity-60'
          : 'bg-pink-50 border-pink-300'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`font-semibold ${reward.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
            {reward.title}
          </p>
          {reward.description && (
            <p className="text-sm text-gray-600 mt-1">{reward.description}</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
            <span className="text-sm font-semibold text-gray-700">{reward.pointsRequired} pts</span>
            {totalPoints >= reward.pointsRequired && !reward.completed && (
              <span className="text-xs bg-green-200 text-green-700 px-2 py-1 rounded">Disponível</span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {!reward.completed && totalPoints >= reward.pointsRequired && (
            <Button
              onClick={() => completeReward(reward.id)}
              size="sm"
              className="gap-2 bg-green-500 hover:bg-green-600"
            >
              <Gift className="w-4 h-4" />
              Resgatar
            </Button>
          )}
          <button
            onClick={() => removeReward(reward.id)}
            className="text-gray-400 hover:text-red-500 transition-smooth"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Pontos Totais */}
      <div className="card-lilac p-8 border-4">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Star className="w-12 h-12 text-yellow-500" fill="currentColor" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Seus Pontos</h2>
          <p className="text-5xl font-bold text-primary mb-4">{totalPoints}</p>
          <p className="text-gray-600 mb-6">Acumule pontos completando tarefas e metas!</p>
          
          <div className="flex gap-2 justify-center">
            <Button onClick={() => addPoints(5)} variant="outline" className="gap-2">
              <Plus className="w-4 h-4" />
              +5 pts
            </Button>
            <Button onClick={() => addPoints(10)} variant="outline" className="gap-2">
              <Plus className="w-4 h-4" />
              +10 pts
            </Button>
            <Button onClick={() => addPoints(25)} className="gap-2 bg-primary hover:bg-purple-400">
              <Plus className="w-4 h-4" />
              +25 pts
            </Button>
          </div>
        </div>
      </div>

      {/* Adicionar Recompensa */}
      <div className="card-blue p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Adicionar Recompensa</h2>
        
        <div className="space-y-3">
          <Input
            type="text"
            placeholder="Nome da recompensa (ex: Assistir filme)..."
            value={newReward.title}
            onChange={(e) => setNewReward({ ...newReward, title: e.target.value })}
          />
          <Input
            type="text"
            placeholder="Descrição (opcional)"
            value={newReward.description}
            onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <select
              value={newReward.type}
              onChange={(e) => setNewReward({ ...newReward, type: e.target.value as 'daily' | 'weekly' | 'monthly' })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="daily">Recompensa Diária</option>
              <option value="weekly">Recompensa Semanal</option>
              <option value="monthly">Recompensa Mensal</option>
            </select>
            <Input
              type="number"
              placeholder="Pontos necessários"
              value={newReward.pointsRequired}
              onChange={(e) => setNewReward({ ...newReward, pointsRequired: e.target.value })}
            />
          </div>
          <Button onClick={addReward} className="w-full gap-2 bg-blue-500 hover:bg-blue-600">
            <Plus className="w-4 h-4" />
            Adicionar Recompensa
          </Button>
        </div>
      </div>

      {/* Recompensas Diárias */}
      <div className="card-pink p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">☀️</span>
          <h2 className="text-xl font-semibold text-gray-900">Recompensas Diárias</h2>
        </div>
        
        <div className="space-y-3">
          {dailyRewards.length === 0 ? (
            <p className="text-center text-gray-400 py-6">Nenhuma recompensa diária adicionada</p>
          ) : (
            dailyRewards.map((reward) => (
              <RewardCard key={reward.id} reward={reward} />
            ))
          )}
        </div>
      </div>

      {/* Recompensas Semanais */}
      <div className="card-green p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">📊</span>
          <h2 className="text-xl font-semibold text-gray-900">Recompensas Semanais</h2>
        </div>
        
        <div className="space-y-3">
          {weeklyRewards.length === 0 ? (
            <p className="text-center text-gray-400 py-6">Nenhuma recompensa semanal adicionada</p>
          ) : (
            weeklyRewards.map((reward) => (
              <RewardCard key={reward.id} reward={reward} />
            ))
          )}
        </div>
      </div>

      {/* Recompensas Mensais */}
      <div className="card-yellow p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🏆</span>
          <h2 className="text-xl font-semibold text-gray-900">Recompensas Mensais</h2>
        </div>
        
        <div className="space-y-3">
          {monthlyRewards.length === 0 ? (
            <p className="text-center text-gray-400 py-6">Nenhuma recompensa mensal adicionada</p>
          ) : (
            monthlyRewards.map((reward) => (
              <RewardCard key={reward.id} reward={reward} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
