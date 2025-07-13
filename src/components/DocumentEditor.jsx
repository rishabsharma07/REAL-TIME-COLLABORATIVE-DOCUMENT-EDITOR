import React, { useRef, useEffect, useState } from 'react';
import { Save, Users, Globe, Lock } from 'lucide-react';
import { EditorToolbar } from './EditorToolbar';

export const DocumentEditor = ({
  document,
  presences,
  onContentChange,
  onTitleChange,
  onTogglePublic,
}) => {
  const editorRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (editorRef.current && document.content !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = document.content;
    }
  }, [document.content]);

  const handleContentChange = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onContentChange(content);
      setIsEditing(true);
      setIsSaving(true);
      // Simulate auto-save delay
      setTimeout(() => {
        setIsSaving(false);
        setLastSaved(new Date());
        setIsEditing(false);
      }, 1000);
    }
  };

  const handleFormat = (command, value) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, value);
    }
  };

  const uniquePresences = presences.filter((presence, index, self) => 
    index === self.findIndex(p => p.user_id === presence.user_id)
  );

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 bg-white">
        <div className="flex items-center justify-between">
          <input
            type="text"
            value={document.title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="text-2xl font-bold text-gray-900 bg-transparent border-none outline-none focus:ring-0 flex-1"
            placeholder="Untitled Document"
          />
          <div className="flex items-center space-x-4">
            {/* Save status */}
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span>Saving...</span>
                </>
              ) : lastSaved ? (
                <>
                  <Save className="w-4 h-4 text-green-500" />
                  <span>Saved {lastSaved.toLocaleTimeString()}</span>
                </>
              ) : null}
            </div>
            {/* Presence indicators */}
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-gray-500" />
              <div className="flex -space-x-2">
                {uniquePresences.slice(0, 3).map((presence) => (
                  <div
                    key={presence.user_id}
                    className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium"
                    style={{ backgroundColor: presence.user_color }}
                    title={presence.user_name}
                  >
                    {presence.user_name.charAt(0).toUpperCase()}
                  </div>
                ))}
                {uniquePresences.length > 3 && (
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-400 flex items-center justify-center text-white text-sm font-medium">
                    +{uniquePresences.length - 3}
                  </div>
                )}
              </div>
            </div>
            {/* Privacy toggle */}
            <button
              onClick={() => onTogglePublic(!document.is_public)}
              className="flex items-center space-x-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            >
              {document.is_public ? (
                <>
                  <Globe className="w-4 h-4" />
                  <span>Public</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Private</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Toolbar */}
      <EditorToolbar onFormat={handleFormat} />
      {/* Editor */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          <div
            ref={editorRef}
            contentEditable
            className="min-h-[600px] focus:outline-none text-gray-900 leading-relaxed"
            onInput={handleContentChange}
            style={{
              fontSize: '16px',
              lineHeight: '1.6',
            }}
            suppressContentEditableWarning={true}
          />
        </div>
      </div>
    </div>
  );
};
