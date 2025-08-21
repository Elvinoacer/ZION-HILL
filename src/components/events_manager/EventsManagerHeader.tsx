
import { Menu, X } from 'lucide-react';

interface EventsManagerHeaderProps {
  isOpen: boolean;
  onToggle: () => void;
}

const EventsManagerHeader = ({ isOpen, onToggle }: EventsManagerHeaderProps) => {
  return (
    <header className="bg-purple-800 text-white p-4 flex justify-between items-center lg:hidden">
      <h1 className="text-xl font-bold">Events Menu</h1>
      <button onClick={onToggle} className="text-white">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </header>
  );
};

export default EventsManagerHeader;
