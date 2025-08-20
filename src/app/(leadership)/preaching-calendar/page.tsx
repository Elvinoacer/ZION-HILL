'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, dateFnsLocalizer, Views, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Loader2, AlertCircle, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import CreateEventModal from '@/components/CreateEventModal';

// Define a local interface for the Event, matching the expected structure
interface Event {
  id: string;
  title: string;
  description?: string | null;
  date: string | Date;
  location?: string | null;
  type: string;
  imageUrl?: string | null;
  time?: string | null;
  ministryId?: string | null;
  capacity?: number | null;
  latitude?: number | null;
  longitude?: number | null;
}

interface CalendarEvent extends Event {
  start?: Date;
  end?: Date;
}

// Setup the localizer
const locales = {
  'en-US': enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const PreachingCalendarPage = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<Event | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<View>(Views.MONTH);

  const fetchSermons = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/events?type=SERMON');
      if (!response.ok) {
        throw new Error('Failed to fetch sermons');
      }
      const data: Event[] = await response.json();
      const formattedEvents = data.map(event => ({
        ...event,
        start: new Date(event.date),
        end: new Date(event.date),
      }));
      setEvents(formattedEvents);
    } catch (err: any) {
      setError(err.message);
      toast.error('Could not load sermons.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSermons();
  }, [fetchSermons]);

  const handleSelectSlot = useCallback(({ start }: { start: Date }) => {
    setSelectedDate(start);
    setEventToEdit(undefined);
    setIsModalOpen(true);
  }, []);

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    const editableEvent = { ...event };
    delete editableEvent.start;
    delete editableEvent.end;
    setEventToEdit(editableEvent);
    setSelectedDate(null);
    setIsModalOpen(true);
  }, []);
  
  const handleEventCreated = () => {
    fetchSermons();
    setIsModalOpen(false);
    setEventToEdit(undefined);
    setSelectedDate(null);
  }

  const getEventToPassToModal = () => {
    if (eventToEdit) return eventToEdit;
    if (selectedDate) {
      return { date: selectedDate, type: 'SERMON' } as Partial<Event>;
    }
    return undefined;
  }

  const handleNavigate = useCallback((newDate: Date) => setDate(newDate), []);
  const handleView = useCallback((newView: View) => setView(newView), []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <p className="ml-4 text-lg text-gray-600">Loading Calendar...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        <AlertCircle className="h-8 w-8 mr-2" />
        <p>Error: {error}. Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <motion.div
      className="container mx-auto py-8 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-4xl font-bold text-gray-800">Preaching Calendar</h1>
            <p className="text-lg text-gray-600">Plan and view the sermon schedule.</p>
        </div>
        <Button onClick={() => {
            setSelectedDate(new Date());
            setEventToEdit(undefined);
            setIsModalOpen(true);
        }}>
            <Plus className="mr-2 h-4 w-4" />
            Schedule Sermon
        </Button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md h-[75vh]">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          date={date}
          view={view}
          onNavigate={handleNavigate}
          onView={handleView}
          eventPropGetter={(event) => ({
            className: `bg-blue-500 text-white border-none p-1 rounded-md hover:bg-blue-600 transition-colors`,
            style: {
                borderRadius: '5px',
                opacity: 0.8,
                color: 'white',
                border: '0px',
                display: 'block'
            }
          })}
          components={{
            event: ({ event }) => (
              <div className="text-xs">
                <strong>{event.title}</strong>
                {event.description && <p className="truncate">{event.description}</p>}
              </div>
            )
          }}
        />
      </div>
      
      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEventCreated={handleEventCreated}
        eventToEdit={getEventToPassToModal() as any}
      />
    </motion.div>
  );
};

export default PreachingCalendarPage;
