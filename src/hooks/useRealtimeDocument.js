import { useState, useEffect, useRef } from 'react';
import { documentStorage, realtimeEmitter, presenceManager } from '../lib/storage';

export const useRealtimeDocument = (documentId, user) => {
  const [document, setDocument] = useState(null);
  const [presences, setPresences] = useState([]);
  const [loading, setLoading] = useState(true);
  const updateTimeoutRef = useRef();

  useEffect(() => {
    if (!documentId || !user) {
      setDocument(null);
      setPresences([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    // Fetch document
    const doc = documentStorage.getById(documentId);
    setDocument(doc);
    setLoading(false);
    // Join presence
    presenceManager.join(documentId, user);
    setPresences(presenceManager.getPresences(documentId));
    // Listen for document updates
    const handleDocumentUpdate = (updatedDoc) => {
      if (updatedDoc.id === documentId) {
        setDocument(updatedDoc);
      }
    };
    // Listen for presence changes
    const handlePresenceUpdate = (newPresences) => {
      setPresences(newPresences);
    };
    realtimeEmitter.on('document:changed', handleDocumentUpdate);
    realtimeEmitter.on(`presence:${documentId}`, handlePresenceUpdate);
    return () => {
      // Leave presence
      presenceManager.leave(documentId, user.id);
      // Clean up listeners
      realtimeEmitter.off('document:changed', handleDocumentUpdate);
      realtimeEmitter.off(`presence:${documentId}`, handlePresenceUpdate);
      // Clear any pending updates
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [documentId, user]);

  const updateContent = (content) => {
    if (!documentId || !document) return;
    // Update local state immediately for responsiveness
    setDocument(prev => prev ? { ...prev, content } : null);
    // Debounce the actual storage update
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    updateTimeoutRef.current = setTimeout(() => {
      const updatedDoc = documentStorage.update(documentId, { content });
      if (updatedDoc) {
        // Emit change to other potential listeners
        realtimeEmitter.emit('document:changed', updatedDoc);
      }
    }, 300);
  };

  return {
    document,
    presences,
    loading,
    updateContent,
  };
};
