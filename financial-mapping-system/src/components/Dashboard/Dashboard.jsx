import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, CreditCard } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Income',
      value: '$8,450.00',
      change: '+12%',
      trend: 'up',
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    {
      title: 'Total Expenses',
      value: '$3,245.50',
      change: '+5%',
      trend: 'down',
      icon: TrendingDown,
      color: 'bg-red-500'
    },
    {
      title: 'Net Savings',
      value: '$5,204.50',
      change: '+15%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Budgets',
      value: '4',
      change: '+1',
      trend: 'up',
      icon: CreditCard,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Financial Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
              <div className="flex justify-between items-center mb-4">
                <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center shadow-sm`}>
                  <Icon size={24} className="text-white" />
                </div>
                <span className={`text-sm font-semibold ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</h3>
              <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;