import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";
import { Send, Image as ImageIcon, Sparkles, Video, Loader2, Upload, MapPin, Globe } from 'lucide-react';
import { ChatMessage } from '../types';

// Initial Tabs
type Tab = 'concierge' | 'create' | 'edit' | 'motion';

const AIAtelier: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('concierge');
  const Motion = motion as any;

  return (
    <section id="atelier" className="py-24 bg-white relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl text-obsidian mb-4">The Atelier</h2>
          <p className="font-sans text-stone-500 font-light">
            Experience the future of dining with KOS Intelligence.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-8 mb-16 border-b border-stone-100 pb-1">
          {[
            { id: 'concierge', label: 'Concierge', icon: Sparkles },
            { id: 'create', label: 'Create', icon: ImageIcon },
            { id: 'edit', label: 'Refine', icon: Upload },
            { id: 'motion', label: 'Motion', icon: Video },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center gap-2 pb-4 font-sans text-sm tracking-widest uppercase transition-all duration-300 relative ${
                activeTab === tab.id ? 'text-obsidian' : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.id && (
                <Motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-[1px] bg-bronze"
                />
              )}
            </button>
          ))}
        </div>

        <div className="max-w-4xl mx-auto bg-stone-50/50 rounded-lg border border-stone-100 p-8 min-h-[500px]">
          <AnimatePresence mode="wait">
            {activeTab === 'concierge' && <ConciergePanel key="concierge" />}
            {activeTab === 'create' && <CreatePanel key="create" />}
            {activeTab === 'edit' && <EditPanel key="edit" />}
            {activeTab === 'motion' && <MotionPanel key="motion" />}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/*                               CONCIERGE (CHAT)                             */
/* -------------------------------------------------------------------------- */

const ConciergePanel: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Welcome to KOS Café. I can help you find dishes, local events, or information about our location. How can I assist you today?' }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: userMsg,
        config: {
          tools: [{ googleSearch: {} }, { googleMaps: {} }],
        },
      });

      const text = response.text || "I'm sorry, I couldn't process that.";
      
      // Extract grounding sources
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      const sources: Array<{ uri: string; title: string }> = [];

      if (groundingChunks) {
        groundingChunks.forEach((chunk: any) => {
          if (chunk.web) {
            sources.push({ uri: chunk.web.uri, title: chunk.web.title });
          } else if (chunk.maps && chunk.maps.placeAnswerSources) {
             // Maps sources often come in nested structures
             // Simplification for display
             sources.push({ uri: '#', title: 'Google Maps Data' });
          }
        });
      }

      setMessages(prev => [...prev, { role: 'model', text, groundingSources: sources }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting to the network right now." }]);
    } finally {
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-6 mb-6 max-h-[400px] pr-2 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`px-6 py-4 max-w-[80%] rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-obsidian text-white rounded-br-none' 
                : 'bg-white border border-stone-200 text-obsidian rounded-bl-none'
            }`}>
              <p className="font-sans text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
            </div>
            
            {/* Grounding Sources */}
            {msg.groundingSources && msg.groundingSources.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2 max-w-[80%]">
                {msg.groundingSources.slice(0, 3).map((source, i) => (
                  <a 
                    key={i} 
                    href={source.uri} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[10px] uppercase tracking-wider bg-stone-100 hover:bg-stone-200 px-2 py-1 rounded-md text-stone-600 transition-colors"
                  >
                    {source.title.includes('Maps') ? <MapPin className="w-3 h-3"/> : <Globe className="w-3 h-3" />}
                    <span className="truncate max-w-[150px]">{source.title}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="bg-white border border-stone-200 px-6 py-4 rounded-2xl rounded-bl-none flex items-center gap-2">
               <Loader2 className="w-4 h-4 animate-spin text-bronze" />
               <span className="text-xs text-stone-400">Thinking...</span>
             </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="relative">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about our menu, location, or food trends..."
          className="w-full bg-transparent border-b border-stone-300 py-3 pr-10 text-obsidian placeholder-stone-400 focus:border-bronze focus:outline-none transition-colors font-sans"
        />
        <button 
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="absolute right-0 top-3 text-stone-400 hover:text-bronze disabled:opacity-50 transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};

/* -------------------------------------------------------------------------- */
/*                               CREATE (IMAGE GEN)                           */
/* -------------------------------------------------------------------------- */

const CreatePanel: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setGeneratedImage(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Using gemini-3-pro-image-preview (Nano Banana Pro)
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            imageSize: size,
            aspectRatio: "1:1"
          }
        },
      });

      // Extract image
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          setGeneratedImage(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (error) {
      console.error("Image generation failed", error);
      alert("Failed to generate image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col md:flex-row gap-8">
      <div className="flex-1 space-y-6">
        <div>
          <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Prompt</label>
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A futuristic coffee cup on a marble table, cinematic lighting..."
            className="w-full bg-white border border-stone-200 rounded-sm p-4 text-obsidian focus:border-bronze focus:outline-none transition-colors min-h-[120px]"
          />
        </div>
        
        <div>
          <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Resolution</label>
          <div className="flex gap-4">
            {(['1K', '2K', '4K'] as const).map((s) => (
              <button 
                key={s}
                onClick={() => setSize(s)}
                className={`px-4 py-2 border text-sm transition-all ${
                  size === s ? 'border-bronze text-bronze' : 'border-stone-200 text-stone-400 hover:border-stone-300'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleGenerate}
          disabled={loading || !prompt}
          className="w-full bg-obsidian text-white py-3 font-sans uppercase tracking-widest text-xs hover:bg-stone-800 transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
          {loading ? 'Dreaming...' : 'Generate Art'}
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center bg-stone-100 min-h-[300px] border border-stone-200 rounded-sm overflow-hidden relative">
        {generatedImage ? (
          <img src={generatedImage} alt="Generated" className="w-full h-full object-contain" />
        ) : (
          <div className="text-stone-400 flex flex-col items-center gap-2">
            <Sparkles className="w-6 h-6 opacity-50" />
            <span className="text-xs uppercase tracking-widest">Preview Area</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

/* -------------------------------------------------------------------------- */
/*                               REFINE (IMAGE EDIT)                          */
/* -------------------------------------------------------------------------- */

const EditPanel: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      setFilePreview(URL.createObjectURL(f));
      setResultImage(null);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data:image/...;base64, prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleEdit = async () => {
    if (!file || !prompt) return;
    setLoading(true);

    try {
      const base64Data = await fileToBase64(file);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Using gemini-2.5-flash-image (Nano Banana)
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: file.type,
                data: base64Data
              }
            },
            { text: prompt }
          ],
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          setResultImage(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (error) {
      console.error("Edit failed", error);
      alert("Failed to edit image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Area */}
        <div 
          className="border-2 border-dashed border-stone-200 rounded-sm h-[300px] flex flex-col items-center justify-center relative hover:border-bronze transition-colors bg-stone-50 cursor-pointer"
        >
          {filePreview ? (
            <img src={filePreview} alt="Original" className="w-full h-full object-contain" />
          ) : (
            <div className="text-center p-6">
               <Upload className="w-8 h-8 mx-auto text-stone-400 mb-2" />
               <p className="text-sm text-stone-500">Click to upload photo</p>
            </div>
          )}
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer" 
          />
        </div>

        {/* Result Area */}
        <div className="border border-stone-200 rounded-sm h-[300px] flex items-center justify-center bg-stone-100 overflow-hidden">
          {resultImage ? (
             <img src={resultImage} alt="Result" className="w-full h-full object-contain" />
          ) : (
             <div className="text-stone-400 text-xs uppercase tracking-widest">Edited Image</div>
          )}
        </div>
      </div>

      <div className="flex gap-4 items-end">
        <div className="flex-grow">
          <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Instructions</label>
          <input 
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g., Add a retro filter, remove background..."
            className="w-full bg-white border border-stone-200 py-3 px-4 text-obsidian focus:border-bronze focus:outline-none transition-colors"
          />
        </div>
        <button 
          onClick={handleEdit}
          disabled={loading || !file || !prompt}
          className="bg-obsidian text-white px-8 py-3 font-sans uppercase tracking-widest text-xs hover:bg-stone-800 transition-colors flex items-center gap-2 h-[48px] disabled:opacity-70"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Edit
        </button>
      </div>
    </motion.div>
  );
};

/* -------------------------------------------------------------------------- */
/*                               MOTION (VEO)                                 */
/* -------------------------------------------------------------------------- */

const MotionPanel: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      setFilePreview(URL.createObjectURL(f));
      setVideoUrl(null);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleGenerateVideo = async () => {
    if (!file) return;
    
    // API Key Check for Veo
    if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
            try {
                await window.aistudio.openSelectKey();
                // Assume success after dialog interaction, or we can check hasKey again
            } catch (e) {
                console.error("Key selection failed", e);
                return;
            }
        }
    }

    setLoading(true);
    setStatusText('Initializing Veo...');
    setVideoUrl(null);

    try {
      const base64Data = await fileToBase64(file);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      setStatusText('Generating video (this may take a minute)...');
      
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        image: {
          imageBytes: base64Data,
          mimeType: file.type,
        },
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: aspectRatio
        }
      });

      // Polling loop
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({operation: operation});
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        // Fetch the video content
        const videoRes = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await videoRes.blob();
        setVideoUrl(URL.createObjectURL(blob));
      } else {
        throw new Error("No video URI returned");
      }

    } catch (error) {
      console.error("Video generation failed", error);
      alert("Failed to generate video.");
    } finally {
      setLoading(false);
      setStatusText('');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col md:flex-row gap-8">
      <div className="flex-1 space-y-6">
        <div>
          <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Source Image</label>
           <div 
            className="border-2 border-dashed border-stone-200 rounded-sm h-[200px] flex flex-col items-center justify-center relative hover:border-bronze transition-colors bg-stone-50 cursor-pointer"
          >
            {filePreview ? (
              <img src={filePreview} alt="Original" className="w-full h-full object-contain" />
            ) : (
              <div className="text-center p-6">
                <Upload className="w-8 h-8 mx-auto text-stone-400 mb-2" />
                <p className="text-sm text-stone-500">Upload photo</p>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer" 
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Aspect Ratio</label>
          <div className="flex gap-4">
            {(['16:9', '9:16'] as const).map((r) => (
              <button 
                key={r}
                onClick={() => setAspectRatio(r)}
                className={`px-4 py-2 border text-sm transition-all ${
                  aspectRatio === r ? 'border-bronze text-bronze' : 'border-stone-200 text-stone-400 hover:border-stone-300'
                }`}
              >
                {r === '16:9' ? 'Landscape (16:9)' : 'Portrait (9:16)'}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleGenerateVideo}
          disabled={loading || !file}
          className="w-full bg-obsidian text-white py-3 font-sans uppercase tracking-widest text-xs hover:bg-stone-800 transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />}
          {loading ? 'Processing...' : 'Animate with Veo'}
        </button>
        {loading && <p className="text-center text-xs text-stone-500 animate-pulse">{statusText}</p>}
        
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-sm">
           <p className="text-xs text-blue-800 leading-relaxed">
             <strong>Note:</strong> Veo requires a paid API key. You will be prompted to select your key securely via Google AI Studio when you click generate. <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline">Learn more</a>.
           </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-black min-h-[300px] border border-stone-200 rounded-sm overflow-hidden">
        {videoUrl ? (
          <video controls autoPlay loop className="w-full h-full object-contain">
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="text-stone-500 flex flex-col items-center gap-2">
            <Video className="w-6 h-6 opacity-50" />
            <span className="text-xs uppercase tracking-widest">Video Output</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AIAtelier;
