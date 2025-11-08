import React, { useState } from 'react';
import { Search, Filter, Download } from 'lucide-react';

const TransactionList = () => {
  const [transactions] = useState([
    {
      id: 1,
      description: 'Grocery Store',
      amount: -85.75,
      category: 'Food',
      date: '2024-01-15',
      type: 'expense'
    },
    {
      id: 2,
      description: 'Salary Deposit',
      amount: 3000.00,
      category: 'Income',
      date: '2024-01-14',
      type: 'income'
    },
    {
      id: 3,
      description: 'Electric Bill',
      amount: -120.50,
      category: 'Utilities',
      date: '2024-01-13',
      type: 'expense'
    },
    {
      id: 4,
      description: 'Freelance Work',
      amount: 850.00,
      category: 'Income',
      date: '2024-01-12',
      type: 'income'
    }
  ]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Transaction History</h2>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2 gap-2 min-w-64 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
            <Search size={20} className="text-gray-400 shrink-0" />
            <input 
              type="text" 
              placeholder="Search transactions..." 
              className="outline-none w-full bg-transparent placeholder-gray-400"
            />
          </div>
          <button className="bg-white border border-gray-300 rounded-lg p-2 hover:bg-gray-50 transition-all duration-200 shrink-0">
            <Filter size={20} className="text-gray-600" />
          </button>
          <button className="bg-white border border-gray-300 rounded-lg p-2 hover:bg-gray-50 transition-all duration-200 shrink-0">
            <Download size={20} className="text-gray-600" />
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="flex flex-col min-w-0">
                  <h4 className="font-semibold text-gray-900 text-lg truncate">{transaction.description}</h4>
                  <span className="text-sm text-gray-500 mt-1">{transaction.category}</span>
                </div>
                <div className="text-sm text-gray-500 whitespace-nowrap ml-auto sm:ml-0">
                  {new Date(transaction.date).toLocaleDateString()}
                </div>
              </div>
              <div className={`text-xl font-semibold whitespace-nowrap ${
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(transaction.amount)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;