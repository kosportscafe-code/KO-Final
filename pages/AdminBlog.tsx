import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, ArrowLeft } from 'lucide-react';
import { getBlogPosts, saveBlogPost, deleteBlogPost, generateSlug } from '../services/blogService';
import { BlogPost } from '../types';
import { Link } from 'react-router-dom';

const CATEGORIES = ['Sports', 'Standup', 'Events', 'Offers'];

const AdminBlog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>({});

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    setPosts(getBlogPosts());
  };

  const handleAddNew = () => {
    setCurrentPost({
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      image: '',
      category: 'Sports',
      author: 'Admin',
      createdAt: new Date().toISOString()
    });
    setIsEditing(true);
  };

  const handleEdit = (post: BlogPost) => {
    setCurrentPost({ ...post });
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deleteBlogPost(id);
      loadPosts();
    }
  };

  const handleSave = () => {
    if (!currentPost.title || !currentPost.content) {
      alert('Title and Content are required.');
      return;
    }

    const postToSave = {
      ...currentPost,
      slug: currentPost.slug || generateSlug(currentPost.title)
    } as BlogPost;

    saveBlogPost(postToSave);
    setIsEditing(false);
    loadPosts();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentPost({ ...currentPost, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (isEditing) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              {currentPost.title ? 'Edit Post' : 'Create New Post'}
            </h1>
            <button 
              onClick={() => setIsEditing(false)}
              className="text-gray-500 hover:text-gray-800 flex items-center"
            >
              <X className="mr-1" /> Cancel
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  type="text"
                  value={currentPost.title || ''}
                  onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value, slug: generateSlug(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#ff3b3b] focus:border-[#ff3b3b] outline-none"
                  placeholder="Post title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  value={currentPost.category || 'Sports'}
                  onChange={(e) => setCurrentPost({ ...currentPost, category: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#ff3b3b] outline-none"
                >
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                <input 
                  type="text"
                  value={currentPost.author || ''}
                  onChange={(e) => setCurrentPost({ ...currentPost, author: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#ff3b3b] outline-none"
                />
              </div>
              
              <div className="col-span-1 md:col-span-2">
                <div className="bg-gray-100 p-4 rounded-lg border border-gray-200 mt-4 mb-2">
                  <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">SEO Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
                      <input 
                        type="text"
                        value={currentPost.slug || ''}
                        onChange={(e) => setCurrentPost({ ...currentPost, slug: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-[#ff3b3b] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                      <input 
                        type="text"
                        value={currentPost.metaTitle || ''}
                        onChange={(e) => setCurrentPost({ ...currentPost, metaTitle: e.target.value })}
                        placeholder="Leave blank to use Post Title"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-[#ff3b3b] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                      <input 
                        type="text"
                        value={currentPost.metaDescription || ''}
                        onChange={(e) => setCurrentPost({ ...currentPost, metaDescription: e.target.value })}
                        placeholder="Leave blank to use Excerpt"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-[#ff3b3b] outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Attachment Section */}
              <div className="col-span-1 md:col-span-2">
                <div className="bg-[#ff3b3b]/5 border border-[#ff3b3b]/20 p-4 rounded-lg mb-4">
                  <div className="flex items-center mb-4">
                    <input 
                      type="checkbox"
                      id="attachEvent"
                      checked={currentPost.isEventAttached || false}
                      onChange={(e) => setCurrentPost({ ...currentPost, isEventAttached: e.target.checked })}
                      className="w-4 h-4 text-[#ff3b3b] bg-gray-100 border-gray-300 rounded focus:ring-[#ff3b3b]"
                    />
                    <label htmlFor="attachEvent" className="ml-2 text-sm font-bold text-gray-800 uppercase tracking-wider">
                      Attach Event Details
                    </label>
                  </div>
                  
                  {currentPost.isEventAttached && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-[#ff3b3b]/10 pt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
                        <input 
                          type="text"
                          value={currentPost.eventDate || ''}
                          onChange={(e) => setCurrentPost({ ...currentPost, eventDate: e.target.value })}
                          placeholder="e.g. Oct 24, 2026"
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-[#ff3b3b] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Event Time</label>
                        <input 
                          type="text"
                          value={currentPost.eventTime || ''}
                          onChange={(e) => setCurrentPost({ ...currentPost, eventTime: e.target.value })}
                          placeholder="e.g. 8:00 PM"
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-[#ff3b3b] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Seats Left</label>
                        <input 
                          type="text"
                          value={currentPost.eventSeatsLeft || ''}
                          onChange={(e) => setCurrentPost({ ...currentPost, eventSeatsLeft: e.target.value })}
                          placeholder="e.g. 24"
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-[#ff3b3b] outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
                <div className="flex items-center gap-4">
                  {currentPost.image && (
                    <img src={currentPost.image} alt="Preview" className="w-24 h-24 object-cover rounded shadow" />
                  )}
                  <input 
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#ff3b3b]/10 file:text-[#ff3b3b] hover:file:bg-[#ff3b3b]/20"
                  />
                </div>
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                <textarea 
                  value={currentPost.excerpt || ''}
                  onChange={(e) => setCurrentPost({ ...currentPost, excerpt: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#ff3b3b] outline-none"
                  rows={2}
                  placeholder="Short summary for the listing page..."
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <p className="text-xs text-gray-400 mb-2">You can use basic HTML tags like &lt;b&gt;, &lt;i&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;h2&gt; etc.</p>
                <textarea
                  value={currentPost.content || ''}
                  onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#ff3b3b] focus:border-[#ff3b3b] outline-none font-mono text-sm"
                  rows={14}
                  placeholder="Write your blog content here..."
                />
              </div>
            </div>

              <div className="pt-6 border-t border-gray-200 flex justify-end">
              <button 
                onClick={handleSave}
                className="bg-[#ff3b3b] hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium flex items-center transition-colors shadow-sm"
              >
                <Save className="mr-2" size={18} /> Save Post
              </button>
            </div>
          </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Blog Management</h2>
          <p className="text-gray-500 text-sm mt-1">Manage all blog posts for KO Sports Cafe.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleAddNew}
            className="px-5 py-2 bg-[#ff3b3b] hover:bg-red-600 text-white rounded-lg font-medium flex items-center shadow-sm transition-colors"
          >
            <Plus className="mr-2" size={18} /> Add New Post
          </button>
        </div>
      </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {posts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider border-b border-gray-200">
                    <th className="px-6 py-4 font-medium">Post Title</th>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {posts.map(post => (
                    <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {post.image && (
                            <img src={post.image} alt="" className="w-10 h-10 rounded object-cover flex-shrink-0" />
                          )}
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">{post.title}</p>
                            <p className="text-xs text-gray-500">{post.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium border border-gray-200">
                          {post.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleEdit(post)}
                          className="text-blue-600 hover:text-blue-800 p-2 rounded hover:bg-blue-50 transition-colors inline-block mr-2"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(post.id)}
                          className="text-red-600 hover:text-red-800 p-2 rounded hover:bg-red-50 transition-colors inline-block"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500">
              <p>No blog posts found. Create one to get started.</p>
            </div>
          )}
        </div>
    </div>
  );
};

export default AdminBlog;
