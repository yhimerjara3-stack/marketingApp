import React from 'react';
import { Category, CategoryId } from '../types/store';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="overflow-x-auto no-scrollbar py-2 -mx-4 px-4 scroll-smooth">
      <div className="flex items-center gap-2 min-w-max">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all active:scale-95 border ${
                isSelected
                  ? 'bg-green-600 text-white border-green-600 shadow-sm shadow-green-600/25'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200/90'
              }`}
            >
              <span className="text-sm">{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
