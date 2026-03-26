import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { CafeEvent } from '../types';
import { getEvents, saveEvent, deleteEvent } from '../services/eventService';

const AdminEvents: React.FC = () => {
  const [events, setEvents] = useState<CafeEvent[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Partial<CafeEvent>>({});
  
  // Media selection state
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [mediaItems, setMediaItems] = useState<any[]>([]);

  useEffect(() => {
    loadEvents();
  }, []);

  const refreshMedia = () => {
    import('../services/mediaService').then(service => {
        setMediaItems(service.getMediaItems());
    });
  };

  const toggleMediaPicker = () => {
    if (!showMediaPicker) {
      refreshMedia();
    }
    setShowMediaPicker(!showMediaPicker);
  };

  const selectMediaImage = (url: string) => {
    setCurrentEvent({ ...currentEvent, image: url });
    setShowMediaPicker(false);
  };

  const handleCloudinaryUpload = () => {
    import('../services/galleryService').then(service => {
        service.openUploadWidget('events', (url) => {
            setCurrentEvent({ ...currentEvent, image: url });
        });
    });
  };

  const loadEvents = () => {
    setEvents(getEvents());
  };

  const handleAddNew = () => {
    setCurrentEvent({
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      name: '',
      date: '',
      time: '',
      description: '',
      image: ''
    });
    setIsEditing(true);
  };

  const handleEdit = (event: CafeEvent) => {
    setCurrentEvent({ ...event });
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteEvent(id);
      loadEvents();
    }
  };

  const handleSave = () => {
    if (!currentEvent.name || !currentEvent.date) {
      alert('Event Name and Date are required.');
      return;
    }
    saveEvent(currentEvent as CafeEvent);
    setIsEditing(false);
    loadEvents();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setCurrentEvent({ ...currentEvent, image: dataUrl });
        
        // Also save to media library for future use
        import('../services/mediaService').then(service => {
            service.saveMediaItem({
                id: `media_${Date.now()}`,
                filename: file.name,
                type: file.type,
                dataUrl,
                uploadedAt: new Date().toISOString(),
                sizeBytes: file.size
            });
            refreshMedia();
        });
      };
      reader.readAsDataURL(file);
    }
  };

  if (isEditing) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{currentEvent.name ? 'Edit Event' : 'Create New Event'}</h2>
            <p className="text-gray-500 text-sm mt-1">Fill out the details below to schedule an event.</p>
          </div>
          <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-800 flex items-center">
            <X className="mr-1" /> Cancel
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
              <input 
                type="text"
                value={currentEvent.name || ''}
                onChange={(e) => setCurrentEvent({ ...currentEvent, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-bronze outline-none"
                placeholder="e.g. Comedy Night"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input 
                type="text"
                value={currentEvent.date || ''}
                onChange={(e) => setCurrentEvent({ ...currentEvent, date: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-bronze outline-none"
                placeholder="e.g. Oct 24, 2026"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input 
                type="text"
                value={currentEvent.time || ''}
                onChange={(e) => setCurrentEvent({ ...currentEvent, time: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-bronze outline-none"
                placeholder="e.g. 8:00 PM"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (Optional)</label>
              <input 
                type="number"
                value={currentEvent.price || ''}
                onChange={(e) => setCurrentEvent({ ...currentEvent, price: parseInt(e.target.value) || 0 })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-bronze outline-none"
                placeholder="e.g. 499"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Image Header</label>
              <div className="flex items-center gap-4">
                {currentEvent.image && (
                  <img src={currentEvent.image} alt="Preview" className="w-24 h-24 object-cover rounded shadow" />
                )}
                <div className="flex-1 space-y-3">
                   <div className="flex flex-wrap gap-2">
                       <button 
                         onClick={toggleMediaPicker}
                         className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                           showMediaPicker ? 'bg-gray-800 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                         }`}
                       >
                         {showMediaPicker ? 'Close Library' : 'Local Library'}
                       </button>
                       <button 
                         onClick={handleCloudinaryUpload}
                         className="bg-sky-50 hover:bg-sky-100 text-sky-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-sky-200"
                       >
                         Select from Cloudinary
                       </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                       <label className="cursor-pointer bg-green-50 hover:bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-green-200">
                         Upload from Computer
                         <input 
                           type="file"
                           className="hidden"
                           accept="image/*"
                           onChange={handleImageUpload}
                         />
                       </label>
                    </div>

                    {/* Media Picker Modal */}
                    {showMediaPicker && (
                      <div className="bg-white border border-gray-200 rounded-lg p-3 mt-2 h-48 overflow-y-auto shadow-inner">
                        <h3 className="font-semibold text-gray-800 text-xs mb-2">Local Media</h3>
                        {mediaItems.length === 0 ? (
                          <p className="text-[10px] text-gray-500">No media found.</p>
                        ) : (
                          <div className="grid grid-cols-4 gap-2">
                            {mediaItems.map((media: any) => (
                               <div 
                                 key={media.id} 
                                 onClick={() => selectMediaImage(media.dataUrl)}
                                 className="cursor-pointer group relative aspect-square bg-gray-100 rounded overflow-hidden hover:ring-2 hover:ring-bronze"
                               >
                                 <img src={media.dataUrl} alt="" className="w-full h-full object-cover" />
                               </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                </div>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Description</label>
              <textarea 
                value={currentEvent.description || ''}
                onChange={(e) => setCurrentEvent({ ...currentEvent, description: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-bronze outline-none"
                rows={4}
                placeholder="Describe what the event is about..."
              />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200 flex justify-end">
            <button 
              onClick={handleSave}
              className="bg-bronze hover:bg-bronze/80 text-white px-6 py-2 rounded-lg font-medium flex items-center shadow-sm"
            >
              <Save className="mr-2" size={18} /> Save Event
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Event Management</h2>
          <p className="text-gray-500 text-sm mt-1">Manage scheduled events, comedy shows, and matches.</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="px-5 py-2 bg-bronze hover:bg-bronze/80 text-white rounded-lg font-medium flex items-center shadow-sm"
        >
          <Plus className="mr-2" size={18} /> Add New Event
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {events.length > 0 ? (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider border-b border-gray-200">
                <th className="px-6 py-4 font-medium">Event Name</th>
                <th className="px-6 py-4 font-medium">Date & Time</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {events.map((evt) => (
                <tr key={evt.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {evt.image ? (
                        <img src={evt.image} alt="" className="w-10 h-10 rounded object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded bg-gray-200 flex-shrink-0" />
                      )}
                      <span className="font-semibold text-gray-800">{evt.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <span className="block font-medium">{evt.date}</span>
                    <span className="text-xs text-gray-500">{evt.time}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                    {evt.price ? `₹${evt.price}` : 'Free'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleEdit(evt)}
                      className="text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors mr-2"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(evt.id)}
                      className="text-red-600 hover:bg-red-50 p-2 rounded transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <p>No events scheduled. Create one to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEvents;
