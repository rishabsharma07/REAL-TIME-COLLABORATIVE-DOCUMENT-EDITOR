import React from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Heading1, Heading2, Heading3 } from 'lucide-react';

export const EditorToolbar = ({ onFormat }) => {
  const handleCommand = (command, value) => {
    onFormat(command, value);
  };

  return (
    <div className="border-b border-gray-200 p-4 bg-gray-50">
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1 border-r border-gray-300 pr-3">
          <button
            onClick={() => handleCommand('formatBlock', '<h1>')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleCommand('formatBlock', '<h2>')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleCommand('formatBlock', '<h3>')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
            title="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center space-x-1 border-r border-gray-300 pr-3">
          <button
            onClick={() => handleCommand('bold')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleCommand('italic')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleCommand('underline')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
            title="Underline"
          >
            <Underline className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => handleCommand('insertUnorderedList')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleCommand('insertOrderedList')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
