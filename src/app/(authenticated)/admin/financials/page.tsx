"use client";

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Financial {
  id: string;
  eventId: string;
  budget: number;
  expenses: number;
  revenue: number;
  vendorPayments: any; // Adjust type as per your Json field structure
}

interface Event {
  id: string;
  title: string;
}

const AdminFinancialsPage = () => {
  const [financials, setFinancials] = useState<Financial[]>([]);
  const [events, setEvents] = useState<Event[]>([]); // To link financials to events
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newFinancial, setNewFinancial] = useState({
    eventId: '',
    budget: 0,
    expenses: 0,
    revenue: 0,
    vendorPayments: [],
  });

  const [editingFinancial, setEditingFinancial] = useState<Financial | null>(null);

  const fetchFinancials = async () => {
    try {
      const res = await fetch('/api/financials');
      if (!res.ok) throw new Error('Failed to fetch financials');
      const data = await res.json();
      setFinancials(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      if (!res.ok) throw new Error('Failed to fetch events');
      const data = await res.json();
      setEvents(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchFinancials();
    fetchEvents();
    setLoading(false);
  }, []);

  const handleNewFinancialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewFinancial((prev) => ({
      ...prev,
      [name]: name === 'budget' || name === 'expenses' || name === 'revenue' ? parseFloat(value) : value,
    }));
  };

  const handleEditingFinancialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingFinancial((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: name === 'budget' || name === 'expenses' || name === 'revenue' ? parseFloat(value) : value,
      };
    });
  };

  const handleAddFinancial = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('/api/financials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFinancial),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to add financial record');
      }

      setNewFinancial({
        eventId: '',
        budget: 0,
        expenses: 0,
        revenue: 0,
        vendorPayments: [],
      });
      fetchFinancials(); // Refresh financial list
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdateFinancial = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!editingFinancial) return;

    try {
      const res = await fetch(`/api/financials?id=${editingFinancial.id}` , {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingFinancial),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update financial record');
      }

      setEditingFinancial(null);
      fetchFinancials(); // Refresh financial list
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteFinancial = async (id: string) => {
    setError(null);
    try {
      const res = await fetch(`/api/financials?id=${id}` , {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete financial record');
      }

      fetchFinancials(); // Refresh financial list
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Financial Overview</h1>
        <p className="text-lg text-gray-600">Loading financials...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Financial Overview</h1>
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Financial Overview</h1>
      <p className="text-lg text-gray-600 mb-4">
        Track donations, expenses, and manage church funds.
      </p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{editingFinancial ? 'Edit Financial Record' : 'Add New Financial Record'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={editingFinancial ? handleUpdateFinancial : handleAddFinancial} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="eventId" className="block text-gray-700 text-sm font-bold mb-2">Event:</label>
              <Select onValueChange={(value) => {
                if (editingFinancial) {
                  setEditingFinancial(prev => prev ? { ...prev, eventId: value } : null);
                } else {
                  setNewFinancial(prev => ({ ...prev, eventId: value }));
                }
              }} value={editingFinancial ? editingFinancial.eventId : newFinancial.eventId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an Event" />
                </SelectTrigger>
                <SelectContent>
                  {events.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="budget" className="block text-gray-700 text-sm font-bold mb-2">Budget:</label>
              <Input type="number" id="budget" name="budget" value={editingFinancial ? editingFinancial.budget : newFinancial.budget} onChange={handleNewFinancialChange} step="0.01" required />
            </div>
            <div>
              <label htmlFor="expenses" className="block text-gray-700 text-sm font-bold mb-2">Expenses:</label>
              <Input type="number" id="expenses" name="expenses" value={editingFinancial ? editingFinancial.expenses : newFinancial.expenses} onChange={handleNewFinancialChange} step="0.01" required />
            </div>
            <div>
              <label htmlFor="revenue" className="block text-gray-700 text-sm font-bold mb-2">Revenue:</label>
              <Input type="number" id="revenue" name="revenue" value={editingFinancial ? editingFinancial.revenue : newFinancial.revenue} onChange={handleNewFinancialChange} step="0.01" required />
            </div>
            <div className="md:col-span-2 flex space-x-2">
              <Button type="submit">
                {editingFinancial ? 'Update Record' : 'Add Record'}
              </Button>
              {editingFinancial && (
                <Button type="button" variant="outline" onClick={() => setEditingFinancial(null)}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Financial Records</CardTitle>
        </CardHeader>
        <CardContent>
          {financials.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Expenses</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {financials.map((financial) => (
                    <TableRow key={financial.id}>
                      <TableCell>{events.find(e => e.id === financial.eventId)?.title || 'N/A'}</TableCell>
                      <TableCell>${financial.budget.toFixed(2)}</TableCell>
                      <TableCell>${financial.expenses.toFixed(2)}</TableCell>
                      <TableCell>${financial.revenue.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => setEditingFinancial(financial)} className="mr-2">
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteFinancial(financial.id)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p>No financial records found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminFinancialsPage;
