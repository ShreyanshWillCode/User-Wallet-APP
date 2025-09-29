import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Plus, 
  Send, 
  Download, 
  History, 
  User,
  Wallet
} from 'lucide-react';

const Sidebar = () => {
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Add Money', href: '/add-money', icon: Plus },
    { name: 'Send Money', href: '/send-money', icon: Send },
    { name: 'Withdraw', href: '/withdraw', icon: Download },
    { name: 'Transactions', href: '/transactions', icon: History },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto border-r border-gray-200">
        <div className="flex items-center flex-shrink-0 px-4">
          <Wallet className="h-8 w-8 text-primary-600" />
          <span className="ml-2 text-lg font-semibold text-gray-900">
            Wallet
          </span>
        </div>
        
        <div className="mt-5 flex-grow flex flex-col">
          <nav className="flex-1 px-2 pb-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-primary-100 text-primary-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <Icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      window.location.pathname === item.href
                        ? 'text-primary-500'
                        : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
