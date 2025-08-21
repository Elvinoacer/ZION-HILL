
import { Menu, X } from 'lucide-react';

interface AdminHeaderProps {
  isOpen: boolean;
  onToggle: () => void;
}

const AdminHeader = ({ isOpen, onToggle }: AdminHeaderProps) => {
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center lg:hidden">
      <h1 className="text-xl font-bold">Admin Menu</h1>
      <button onClick={onToggle} className="text-white">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </header>
  );
};

export default AdminHeader;
