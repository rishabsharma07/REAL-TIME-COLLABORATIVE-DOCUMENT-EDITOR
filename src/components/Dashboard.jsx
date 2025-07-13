import React, { useState } from 'react';
import { LogOut, User as UserIcon } from 'lucide-react';
import { useDocuments } from '../hooks/useDocuments';
import { useRealtimeDocument } from '../hooks/useRealtimeDocument';
import { DocumentSidebar } from './DocumentSidebar';
import { DocumentEditor } from './DocumentEditor';

export const Dashboard = ({ user, onSignOut }) => {
  const [currentDocumentId, setCurrentDocumentId] = useState(null);
  const { documents, loading, createDocument, updateDocument, deleteDocument } = useDocuments(user?.id);
  const { document, presences, updateContent } = useRealtimeDocument(currentDocumentId, user);

  const handleCreateDocument = async (title) => {
    const newDoc = await createDocument(title);
    if (newDoc) {
      setCurrentDocumentId(newDoc.id);
    }
  };

  const handleContentChange = (content) => {
    updateContent(content);
  };

  const handleTitleChange = (title) => {
    if (currentDocumentId) {
      updateDocument(currentDocumentId, { title });
    }
  };

  const handleTogglePublic = (isPublic) => {
    if (currentDocumentId) {
      updateDocument(currentDocumentId, { is_public: isPublic });
    }
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <DocumentSidebar
        documents={documents}
        currentDocumentId={currentDocumentId}
        onDocumentSelect={setCurrentDocumentId}
        onCreateDocument={handleCreateDocument}
        onDeleteDocument={deleteDocument}
        loading={loading}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">CollabDocs</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <UserIcon className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              <button
                onClick={onSignOut}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Document Editor */}
        {document ? (
          <DocumentEditor
            document={document}
            presences={presences}
            onContentChange={handleContentChange}
            onTitleChange={handleTitleChange}
            onTogglePublic={handleTogglePublic}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-6xl mb-4">📄</div>
              <h2 className="text-2xl font-semibold mb-2">Welcome to CollabDocs</h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
