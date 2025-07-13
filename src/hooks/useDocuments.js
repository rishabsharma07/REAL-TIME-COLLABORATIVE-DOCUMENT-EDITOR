import { useState, useEffect } from 'react';
import { documentStorage, realtimeEmitter } from '../lib/storage';

export const useDocuments = (userId) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = () => {
    if (!userId) return;
    setLoading(true);
    const allDocuments = documentStorage.getAll();
    const userDocuments = allDocuments.filter(doc => doc.owner_id === userId);
    setDocuments(userDocuments);
    setLoading(false);
  };

  useEffect(() => {
    fetchDocuments();
    // Listen for document changes
    const handleDocumentChange = () => {
      fetchDocuments();
    };
    realtimeEmitter.on('document:changed', handleDocumentChange);
    return () => {
      realtimeEmitter.off('document:changed', handleDocumentChange);
    };
  }, [userId]);

  const createDocument = async (title) => {
    if (!userId) return null;
    const newDoc = documentStorage.create(title, userId);
    setDocuments(prev => [newDoc, ...prev]);
    realtimeEmitter.emit('document:changed', newDoc);
    return newDoc;
  };

  const updateDocument = async (id, updates) => {
    const updatedDoc = documentStorage.update(id, updates);
    if (updatedDoc) {
      setDocuments(prev => 
        prev.map(doc => doc.id === id ? updatedDoc : doc)
      );
      realtimeEmitter.emit('document:changed', updatedDoc);
    }
    return updatedDoc;
  };

  const deleteDocument = async (id) => {
    const success = documentStorage.delete(id);
    if (success) {
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      realtimeEmitter.emit('document:changed', { id, deleted: true });
    }
    return success;
  };

  return {
    documents,
    loading,
    createDocument,
    updateDocument,
    deleteDocument,
    refetch: fetchDocuments,
  };
};
