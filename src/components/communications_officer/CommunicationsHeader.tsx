
import { Menu, X } from 'lucide-react';

interface CommunicationsHeaderProps {
  isOpen: boolean;
  onToggle: () => void;
}

const CommunicationsHeader = ({ isOpen, onToggle }: CommunicationsHeaderProps) => {
  return (
    <header className="bg-sky-800 text-white p-4 flex justify-between items-center lg:hidden">
      <h1 className="text-xl font-bold">Communications Menu</h1>
      <button onClick={onToggle} className="text-white">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </header>
  );
};

export default CommunicationsHeader;
