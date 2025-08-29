import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Type } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description?: string | null;
  date: string | Date;
  location?: string | null;
  type: string;
  time?: string | null;
}

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  isOpen,
  onClose,
  event,
}) => {
  if (!event) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event.title}</DialogTitle>
          <DialogDescription>{event.description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            <span>{new Date(event.date).toLocaleDateString()}</span>
          </div>
          {event.time && (
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              <span>{event.time}</span>
            </div>
          )}
          {event.location && (
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4" />
              <span>{event.location}</span>
            </div>
          )}
          <div className="flex items-center">
            <Type className="mr-2 h-4 w-4" />
            <span>{event.type}</span>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailsModal;