import { useState, useEffect } from 'react';
import { usePlanner, FinancialData } from '@/contexts/PlannerContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react';

/**
 * FinancialTab - Gestão Financeira
 * Design: Soft Minimalism com Acentos Vibrantes
 * 
 * Seções:
 * - Receitas
 * - Despesas (com categorias)
 * - Resumo mensal
 * - Metas financeiras
 * - Controle de gastos impulsivos
 */
export default function FinancialTab() {
  const { financialData, setFinancialData, currentDate } = usePlanner();
  const [income, setIncome] = useState<Array<{ id: string; description: string; amount: number; date: string; category: string }>>([]);
  const [expenses, setExpenses] = useState<Array<{ id: string; description: string; amount: number; date: string; category: 'fixed' | 'variable' | 'leisure' | 'studies' | 'other'; isImpulsive?: boolean }>>([]);
  const [goals, setGoals] = useState<Array<{ id: string; description: string; targetAmount: number; currentAmount: number }>>([]);

  const [newIncome, setNewIncome] = useState({ description: '', amount: '', date: '', category: 'salário' });
  const [newExpense, setNewExpense] = useState<{ description: string; amount: string; date: string; category: 'fixed' | 'variable' | 'leisure' | 'studies' | 'other'; isImpulsive: boolean }>({ description: '', amount: '', date: '', category: 'variable', isImpulsive: false });
  const [newGoal, setNewGoal] = useState({ description: '', targetAmount: '', currentAmount: '' });

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;

  // Inicializar dados
  useEffect(() => {
    if (financialData?.month === monthKey) {
      setIncome(financialData.income);
      setExpenses(financialData.expenses);
      setGoals(financialData.goals);
    } else {
      const newFinancialData: FinancialData = {
        month: monthKey,
        year,
        income: [],
        expenses: [],
        goals: [],
      };
      setFinancialData(newFinancialData);
    }
  }, [monthKey]);

  // Salvar dados
  useEffect(() => {
    setFinancialData({
      month: monthKey,
      year,
      income,
      expenses,
      goals,
    });
  }, [income, expenses, goals]);

  const addIncome = () => {
    if (!newIncome.description || !newIncome.amount || !newIncome.date) return;
    
    const incomeItem = {
      id: Date.now().toString(),
      description: newIncome.description,
      amount: parseFloat(newIncome.amount),
      date: newIncome.date,
      category: newIncome.category,
    };
    
    setIncome([...income, incomeItem]);
    setNewIncome({ description: '', amount: '', date: '', category: 'salário' });
  };

  const addExpense = () => {
    if (!newExpense.description || !newExpense.amount || !newExpense.date) return;
    
    const expenseItem: { id: string; description: string; amount: number; date: string; category: 'fixed' | 'variable' | 'leisure' | 'studies' | 'other'; isImpulsive?: boolean } = {
      id: Date.now().toString(),
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      date: newExpense.date,
      category: newExpense.category as 'fixed' | 'variable' | 'leisure' | 'studies' | 'other',
      isImpulsive: newExpense.isImpulsive,
    };
    
    setExpenses([...expenses, expenseItem]);
    setNewExpense({ description: '', amount: '', date: '', category: 'variable', isImpulsive: false });
  };

  const addGoal = () => {
    if (!newGoal.description || !newGoal.targetAmount) return;
    
    const goalItem = {
      id: Date.now().toString(),
      description: newGoal.description,
      targetAmount: parseFloat(newGoal.targetAmount),
      currentAmount: parseFloat(newGoal.currentAmount) || 0,
    };
    
    setGoals([...goals, goalItem]);
    setNewGoal({ description: '', targetAmount: '', currentAmount: '' });
  };

  const removeIncome = (id: string) => {
    setIncome(income.filter(i => i.id !== id));
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const removeGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const balance = totalIncome - totalExpenses;
  const impulsiveExpenses = expenses.filter(e => e.isImpulsive).reduce((sum, e) => sum + e.amount, 0);

  const expensesByCategory = {
    fixed: expenses.filter(e => e.category === 'fixed').reduce((sum, e) => sum + e.amount, 0),
    variable: expenses.filter(e => e.category === 'variable').reduce((sum, e) => sum + e.amount, 0),
    leisure: expenses.filter(e => e.category === 'leisure').reduce((sum, e) => sum + e.amount, 0),
    studies: expenses.filter(e => e.category === 'studies').reduce((sum, e) => sum + e.amount, 0),
    other: expenses.filter(e => e.category === 'other').reduce((sum, e) => sum + e.amount, 0),
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      fixed: 'Fixas',
      variable: 'Variáveis',
      leisure: 'Lazer',
      studies: 'Estudos',
      other: 'Outros',
    };
    return labels[category] || category;
  };

  return (
    <div className="space-y-8">
      {/* Resumo Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Receitas */}
        <div className="card-green p-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Receitas</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">R$ {totalIncome.toFixed(2)}</p>
        </div>

        {/* Despesas */}
        <div className="card-pink p-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-6 h-6 text-pink-600" />
            <h3 className="text-lg font-semibold text-gray-900">Despesas</h3>
          </div>
          <p className="text-3xl font-bold text-pink-600">R$ {totalExpenses.toFixed(2)}</p>
        </div>

        {/* Saldo */}
        <div className={`p-6 rounded-lg border-2 ${balance >= 0 ? 'card-green border-green-300' : 'bg-red-50 border-red-300'}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Saldo</h3>
          <p className={`text-3xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            R$ {balance.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Receitas */}
      <div className="card-green p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">📈 Receitas</h2>
        
        <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
            <Input
              type="text"
              placeholder="Descrição..."
              value={newIncome.description}
              onChange={(e) => setNewIncome({ ...newIncome, description: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Valor"
              value={newIncome.amount}
              onChange={(e) => setNewIncome({ ...newIncome, amount: e.target.value })}
            />
            <input
              type="date"
              value={newIncome.date}
              onChange={(e) => setNewIncome({ ...newIncome, date: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <select
              value={newIncome.category}
              onChange={(e) => setNewIncome({ ...newIncome, category: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="salário">Salário</option>
              <option value="freelance">Freelance</option>
              <option value="investimento">Investimento</option>
              <option value="outro">Outro</option>
            </select>
          </div>
          <Button onClick={addIncome} className="w-full gap-2 bg-green-500 hover:bg-green-600">
            <Plus className="w-4 h-4" />
            Adicionar Receita
          </Button>
        </div>

        <div className="space-y-2">
          {income.length === 0 ? (
            <p className="text-center text-gray-400 py-4">Nenhuma receita adicionada</p>
          ) : (
            income.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
              >
                <div>
                  <p className="font-medium text-gray-900">{item.description}</p>
                  <p className="text-xs text-gray-600">{new Date(item.date).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-green-600">R$ {item.amount.toFixed(2)}</span>
                  <button
                    onClick={() => removeIncome(item.id)}
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

      {/* Despesas */}
      <div className="card-pink p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">📉 Despesas</h2>
        
        <div className="mb-6 p-4 bg-pink-50 rounded-lg border border-pink-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
            <Input
              type="text"
              placeholder="Descrição..."
              value={newExpense.description}
              onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Valor"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
            />
            <input
              type="date"
              value={newExpense.date}
              onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <select
              value={newExpense.category}
              onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value as 'fixed' | 'variable' | 'leisure' | 'studies' | 'other' })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="fixed">Fixas</option>
              <option value="variable">Variáveis</option>
              <option value="leisure">Lazer</option>
              <option value="studies">Estudos</option>
              <option value="other">Outros</option>
            </select>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <input
              type="checkbox"
              id="impulsive"
              checked={newExpense.isImpulsive}
              onChange={(e) => setNewExpense({ ...newExpense, isImpulsive: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="impulsive" className="text-sm text-gray-700">Gasto impulsivo?</label>
          </div>
          <Button onClick={addExpense} className="w-full gap-2 bg-pink-500 hover:bg-pink-600">
            <Plus className="w-4 h-4" />
            Adicionar Despesa
          </Button>
        </div>

        <div className="space-y-2">
          {expenses.length === 0 ? (
            <p className="text-center text-gray-400 py-4">Nenhuma despesa adicionada</p>
          ) : (
            expenses.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  item.isImpulsive ? 'bg-red-50 border-red-200' : 'bg-pink-50 border-pink-200'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{item.description}</p>
                    {item.isImpulsive && <span className="text-xs bg-red-200 text-red-700 px-2 py-1 rounded">Impulsivo</span>}
                  </div>
                  <p className="text-xs text-gray-600">{getCategoryLabel(item.category)} • {new Date(item.date).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-pink-600">R$ {item.amount.toFixed(2)}</span>
                  <button
                    onClick={() => removeExpense(item.id)}
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

      {/* Categorias de Despesas */}
      {Object.values(expensesByCategory).some(v => v > 0) && (
        <div className="card-blue p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📊 Despesas por Categoria</h2>
          
          <div className="space-y-3">
            {Object.entries(expensesByCategory).map(([category, amount]) => (
              amount > 0 && (
                <div key={category} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{getCategoryLabel(category)}</span>
                    <span className="font-semibold text-blue-600">R$ {amount.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full"
                      style={{ width: `${(amount / totalExpenses) * 100}%` }}
                    />
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {/* Gastos Impulsivos */}
      {impulsiveExpenses > 0 && (
        <div className="bg-red-50 border-2 border-red-300 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-red-900 mb-2">⚠️ Gastos Impulsivos</h2>
          <p className="text-red-700 mb-2">Total em gastos impulsivos este mês:</p>
          <p className="text-3xl font-bold text-red-600">R$ {impulsiveExpenses.toFixed(2)}</p>
          <p className="text-sm text-red-600 mt-2">Dica: Tente estabelecer um limite para gastos impulsivos!</p>
        </div>
      )}

      {/* Metas Financeiras */}
      <div className="card-yellow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">🎯 Metas Financeiras</h2>
        
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <Input
              type="text"
              placeholder="Descrição da meta..."
              value={newGoal.description}
              onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Valor alvo"
              value={newGoal.targetAmount}
              onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Valor atual"
              value={newGoal.currentAmount}
              onChange={(e) => setNewGoal({ ...newGoal, currentAmount: e.target.value })}
            />
          </div>
          <Button onClick={addGoal} className="w-full gap-2 bg-yellow-500 hover:bg-yellow-600">
            <Plus className="w-4 h-4" />
            Adicionar Meta
          </Button>
        </div>

        <div className="space-y-4">
          {goals.length === 0 ? (
            <p className="text-center text-gray-400 py-4">Nenhuma meta adicionada</p>
          ) : (
            goals.map((goal) => {
              const percentage = (goal.currentAmount / goal.targetAmount) * 100;
              return (
                <div key={goal.id} className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-900">{goal.description}</p>
                      <p className="text-sm text-gray-600">R$ {goal.currentAmount.toFixed(2)} de R$ {goal.targetAmount.toFixed(2)}</p>
                    </div>
                        <button
                      onClick={() => removeGoal(goal.id)}
                      className="text-gray-400 hover:text-red-500 transition-smooth"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-3 rounded-full transition-smooth"
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-2">{Math.round(Math.min(percentage, 100))}% completo</p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
