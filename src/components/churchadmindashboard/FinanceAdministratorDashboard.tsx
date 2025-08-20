"use client";
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Transaction, Fund, Ministry, TransactionType, TransactionMethod } from '@/generated/prisma';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Plus, List, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

export const FinanceAdministratorDashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [funds, setFunds] = useState<Fund[]>([]);
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newTransactionData, setNewTransactionData] = useState({
    amount: 0,
    type: 'EXPENSE' as TransactionType,
    method: 'CASH' as TransactionMethod,
    description: '',
    fundId: '',
  });

  const [selectedFundId, setSelectedFundId] = useState('');
  const [newGoalAmount, setNewGoalAmount] = useState('');

  const fetchDashboardData = async () => {
    try {
      const [transactionsRes, fundsRes, ministriesRes] = await Promise.all([
        fetch('/api/transactions'),
        fetch('/api/funds'),
        fetch('/api/ministries'),
      ]);

      if (!transactionsRes.ok) throw new Error('Failed to fetch transactions');
      if (!fundsRes.ok) throw new Error('Failed to fetch funds');
      if (!ministriesRes.ok) throw new Error('Failed to fetch ministries');

      const transactionsData = await transactionsRes.json();
      const fundsData = await fundsRes.json();
      const ministriesData = await ministriesRes.json();

      setTransactions(transactionsData);
      setFunds(fundsData);
      setMinistries(ministriesData);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRecordTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTransactionData,
          amount: parseFloat(newTransactionData.amount.toString()),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to record transaction');
      }

      toast.success('Transaction recorded successfully!');
      setNewTransactionData({ amount: 0, type: 'EXPENSE', method: 'CASH', description: '', fundId: '' });
      fetchDashboardData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleUpdateFundGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFundId || !newGoalAmount) {
      toast.error('Please select a fund and enter a new goal amount.');
      return;
    }
    try {
      const response = await fetch(`/api/funds?id=${selectedFundId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goalAmount: newGoalAmount }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update fund goal');
      }

      toast.success('Fund goal updated successfully!');
      setSelectedFundId('');
      setNewGoalAmount('');
      fetchDashboardData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (loading) return <div className="text-center py-8">Loading dashboard...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 flex items-center mb-6">
        <DollarSign className="mr-3" /> Finance Administrator Dashboard
      </h1>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><List className="mr-2" /> Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p>No recent transactions.</p>
          ) : (
            <ul className="space-y-2">
              {transactions.map((transaction) => (
                <li key={transaction.id} className="border-b pb-2 last:border-b-0">
                  <p className="font-semibold">{transaction.description} - {transaction.amount} ({transaction.method})</p>
                  <p className="text-sm text-gray-600">Type: {transaction.type}</p>
                  <p className="text-xs text-gray-500">{format(new Date(transaction.date), 'PP')}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Funds Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><TrendingUp className="mr-2" /> Funds Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {funds.length === 0 ? (
            <p>No funds found.</p>
          ) : (
            <ul className="space-y-2">
              {funds.map((fund) => (
                <li key={fund.id} className="border-b pb-2 last:border-b-0">
                  <p className="font-semibold">{fund.name}</p>
                  <p className="text-sm text-gray-600">Goal: {fund.goalAmount || 'N/A'} / Raised: {fund.raisedAmount || 'N/A'}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Record New Transaction Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Plus className="mr-2" /> Record New Transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRecordTransaction} className="space-y-4">
            <Input
              type="number"
              placeholder="Amount"
              value={newTransactionData.amount === 0 ? '' : newTransactionData.amount.toString()}
              onChange={(e) => setNewTransactionData({ ...newTransactionData, amount: parseFloat(e.target.value) || 0 })}
              required
            />
            <select
              value={newTransactionData.type}
              onChange={(e) => setNewTransactionData({ ...newTransactionData, type: e.target.value as TransactionType })}
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors"
              required
            >
              <option value="EXPENSE">Expense</option>
              <option value="REVENUE">Revenue</option>
              <option value="DONATION">Donation</option>
            </select>
            <select
              value={newTransactionData.method}
              onChange={(e) => setNewTransactionData({ ...newTransactionData, method: e.target.value as TransactionMethod })}
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors"
              required
            >
              <option value="CASH">Cash</option>
              <option value="MPESA">Mpesa</option>
              <option value="STRIPE">Stripe</option>
              <option value="PAYPAL">PayPal</option>
              <option value="CHECK">Check</option>
              <option value="IN_KIND">In-Kind</option>
            </select>
            <Textarea
              placeholder="Description"
              value={newTransactionData.description}
              onChange={(e) => setNewTransactionData({ ...newTransactionData, description: e.target.value })}
              required
            />
            <select
              value={newTransactionData.fundId}
              onChange={(e) => setNewTransactionData({ ...newTransactionData, fundId: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors"
            >
              <option value="">Select Fund (Optional)</option>
              {funds.map((fund) => (
                <option key={fund.id} value={fund.id}>{fund.name}</option>
              ))}
            </select>
            <Button type="submit" className="w-full">
              Record Transaction
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Update Fund Goal Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Plus className="mr-2" /> Update Fund Goal</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateFundGoal} className="space-y-4">
            <select
              value={selectedFundId}
              onChange={(e) => setSelectedFundId(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors"
              required
            >
              <option value="">Select Fund</option>
              {funds.map((fund) => (
                <option key={fund.id} value={fund.id}>{fund.name}</option>
              ))}
            </select>
            <Input
              type="text"
              placeholder="New Goal Amount"
              value={newGoalAmount}
              onChange={(e) => setNewGoalAmount(e.target.value)}
              required
            />
            <Button type="submit" className="w-full">
              Update Goal
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
