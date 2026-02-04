import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, icon: Icon, actions }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="w-8 h-8 text-gray-700" />}
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
};

export default PageHeader; 