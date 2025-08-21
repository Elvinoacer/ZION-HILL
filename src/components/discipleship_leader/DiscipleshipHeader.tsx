
import { Menu, X } from 'lucide-react';

interface DiscipleshipHeaderProps {
  isOpen: boolean;
  onToggle: () => void;
}

const DiscipleshipHeader = ({ isOpen, onToggle }: DiscipleshipHeaderProps) => {
  return (
    <header className="bg-emerald-800 text-white p-4 flex justify-between items-center lg:hidden">
      <h1 className="text-xl font-bold">Discipleship Menu</h1>
      <button onClick={onToggle} className="text-white">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </header>
  );
};

export default DiscipleshipHeader;
