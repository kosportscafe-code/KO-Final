import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, ImageIcon } from 'lucide-react';
import { MenuItem } from '../types';
import { fetchMenuData } from '../services/sheetService';
import { saveAdminMenuItem, deleteAdminMenuItem, generateItemId } from '../services/menuAdminService';
import { getMediaItems, MediaItem } from '../services/mediaService';

const CATEGORIES = [
  'Sandwiches', 'Rolls & Wraps', 'Salads', 'Bowls & Meals', 'Hummus', 
  'Pavs', 'Momos', 'Chinese & Noodles', 'Pasta', 'Nachos', 'Tacos', 
  'Fries', 'Thalis', 'Pizzas', 'Burgers', 'Make It A Meal', 
  'Shakes & Beverages', 'Drinks', 'Gol Gappe', 'Others'
];

const AdminMenu: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<MenuItem>>({});
  const [loading, setLoading] = useState(true);
  
  // Media selection state
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);

  useEffect(() => {
    loadItems();
  }, []);

  const refreshMedia = () => {
    setMediaItems(getMediaItems());
  };

  const loadItems = async () => {
    setLoading(true);
    const data = await fetchMenuData();
    setItems(data);
    setLoading(false);
  };

  const handleAddNew = () => {
    setCurrentItem({
      id: generateItemId(),
      category: 'Sandwiches',
      name: '',
      description: '',
      priceReg: 0,
      image_url: ''
    });
    setIsEditing(true);
  };

  const handleEdit = (item: MenuItem) => {
    setCurrentItem({ ...item });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      deleteAdminMenuItem(id);
      await loadItems();
    }
  };

  const handleSave = async () => {
    if (!currentItem.name || currentItem.priceReg === undefined) {
      alert('Name and Regular Price are required.');
      return;
    }

    saveAdminMenuItem(currentItem as MenuItem);
    setIsEditing(false);
    await loadItems();
  };

  const toggleMediaPicker = () => {
    if (!showMediaPicker) {
      refreshMedia();
    }
    setShowMediaPicker(!showMediaPicker);
  };

  const selectMediaImage = (url: string) => {
    setCurrentItem({ ...currentItem, image_url: url });
    setShowMediaPicker(false);
  };

  const handleCloudinaryUpload = () => {
    // Dish images go to 'food' folder by default
    import('../services/galleryService').then(service => {
        service.openUploadWidget('food', (url) => {
            setCurrentItem({ ...currentItem, image_url: url });
        });
    });
  };

  const handleLocalFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setCurrentItem({ ...currentItem, image_url: dataUrl });
        
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

  if (loading && !isEditing) {
    return <div className="p-12 text-center text-gray-500 animate-pulse">Loading menu items...</div>;
  }

  if (isEditing) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{currentItem.name ? 'Edit Menu Item' : 'Create New Menu Item'}</h2>
            <p className="text-gray-500 text-sm mt-1">Fill out the details below to update the live menu.</p>
          </div>
          <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-800 flex items-center">
            <X className="mr-1" /> Cancel
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
              <input 
                type="text"
                value={currentItem.name || ''}
                onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#ff3b3b] outline-none"
                placeholder="e.g. Bombay Masala Sandwich"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select 
                value={currentItem.category || 'Others'}
                onChange={(e) => setCurrentItem({ ...currentItem, category: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#ff3b3b] outline-none"
              >
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
               <input 
                type="text"
                value={currentItem.description || ''}
                onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#ff3b3b] outline-none"
                placeholder="Short description of the dish..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Regular Price (₹)</label>
              <input 
                type="number"
                value={currentItem.priceReg || ''}
                onChange={(e) => setCurrentItem({ ...currentItem, priceReg: parseFloat(e.target.value) || 0 })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#ff3b3b] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Medium/Full Price (₹) - Optional</label>
              <input 
                type="number"
                value={currentItem.priceMed || ''}
                onChange={(e) => setCurrentItem({ ...currentItem, priceMed: e.target.value ? parseFloat(e.target.value) : undefined })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#ff3b3b] outline-none"
              />
            </div>

            {/* Image Selection from Media Library */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Dish Image</label>
              
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  {currentItem.image_url ? (
                    <img src={currentItem.image_url} alt="Preview" className="w-24 h-24 object-cover rounded shadow" />
                  ) : (
                    <div className="w-24 h-24 bg-gray-100 rounded flex items-center justify-center text-gray-400 border border-gray-200">
                      <ImageIcon size={32} />
                    </div>
                  )}
                  <div className="flex-1">
                     <input 
                        type="text"
                        value={currentItem.image_url || ''}
                        onChange={(e) => setCurrentItem({ ...currentItem, image_url: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#ff3b3b] outline-none mb-3"
                        placeholder="Paste image URL here..."
                     />
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
                         <label className="cursor-pointer bg-green-50 hover:bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-green-200">
                           Upload from Computer
                           <input 
                             type="file"
                             className="hidden"
                             accept="image/*"
                             onChange={handleLocalFileUpload}
                           />
                         </label>
                      </div>
                  </div>
                </div>

                {/* Media Picker Modal / Dropdown */}
                {showMediaPicker && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-2 h-64 overflow-y-auto w-full">
                    <h3 className="font-semibold text-gray-800 text-sm mb-3">Your Uploaded Media</h3>
                    {mediaItems.length === 0 ? (
                      <p className="text-sm text-gray-500">No media uploaded yet. Go to Media Library to upload.</p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {mediaItems.map(media => (
                           <div 
                             key={media.id} 
                             onClick={() => selectMediaImage(media.dataUrl)}
                             className="cursor-pointer group relative aspect-square bg-gray-200 rounded overflow-hidden shadow-sm hover:shadow-md transition-all border-2 border-transparent hover:border-[#ff3b3b]"
                           >
                             <img src={media.dataUrl} alt={media.filename} className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <span className="text-white text-xs font-bold">Select</span>
                             </div>
                           </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>

          <div className="pt-6 border-t border-gray-200 flex justify-end">
            <button 
              onClick={handleSave}
              className="bg-[#ff3b3b] hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium flex items-center shadow-sm transition-colors"
            >
              <Save className="mr-2" size={18} /> Save Item
            </button>
          </div>
        </div>
      </div>
    );
  }

  // GROUP ITEMS BY CATEGORY
  const itemsByCategory = ITEMS_GROUP_BY_CATEGORY(items);

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Menu Management</h2>
          <p className="text-gray-500 text-sm mt-1">Manage cafe food and drinks. Changes are instantly live.</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="px-5 py-2 bg-[#ff3b3b] hover:bg-red-600 text-white rounded-lg font-medium flex items-center shadow-sm transition-colors"
        >
          <Plus className="mr-2" size={18} /> Add New Item
        </button>
      </div>

      <div className="space-y-8">
        {Object.entries(itemsByCategory).map(([category, catItems]) => (
          <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
               <h3 className="font-bold text-gray-800 text-lg uppercase tracking-wider">{category} <span className="text-gray-400 text-sm">({catItems.length})</span></h3>
            </div>
            {catItems.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                      <th className="px-6 py-3 font-medium">Item Details</th>
                      <th className="px-6 py-3 font-medium">Price (Reg)</th>
                      <th className="px-6 py-3 font-medium">Price (Med)</th>
                      <th className="px-6 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {catItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3">
                            {item.image_url ? (
                              <img src={item.image_url} alt="" className="w-10 h-10 rounded object-cover flex-shrink-0 border border-gray-200" />
                            ) : (
                              <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center flex-shrink-0 border border-gray-200">
                                <ImageIcon size={16} className="text-gray-400" />
                              </div>
                            )}
                            <div>
                               <span className="font-semibold text-gray-800 text-sm block">{item.name}</span>
                               <span className="text-xs text-gray-500 max-w-xs truncate block">{item.description}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-800 font-medium">
                           ₹{(item.priceReg || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-600">
                           {item.priceMed ? `₹${item.priceMed.toLocaleString()}` : '-'}
                        </td>
                        <td className="px-6 py-3 text-right">
                          <button 
                            onClick={() => handleEdit(item)}
                            className="text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors mr-2 inline-flex items-center justify-center"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:bg-red-50 p-2 rounded transition-colors inline-flex items-center justify-center"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </div>
        ))}

        {Object.keys(itemsByCategory).length === 0 && (
           <div className="p-12 text-center text-gray-500 bg-white rounded-xl shadow-sm border border-gray-200">
             <p>No menu items found. Create one to get started.</p>
           </div>
        )}
      </div>
    </div>
  );
};

// Helper to group by category preserving the order of CATEGORIES
function ITEMS_GROUP_BY_CATEGORY(items: MenuItem[]) {
  const groups: Record<string, MenuItem[]> = {};
  
  // Initialize standard categories in order
  CATEGORIES.forEach(cat => {
    groups[cat] = [];
  });
  
  // Distribute items
  items.forEach(item => {
    const cat = item.category || 'Others';
    if (!groups[cat]) {
      groups[cat] = [];
    }
    groups[cat].push(item);
  });
  
  // Remove empty groups
  Object.keys(groups).forEach(cat => {
    if (groups[cat].length === 0) {
      delete groups[cat];
    }
  });
  
  return groups;
}

export default AdminMenu;
