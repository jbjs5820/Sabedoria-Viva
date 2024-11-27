import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { useDropzone } from 'react-dropzone';
import { supabase } from '../../lib/supabaseClient';

interface PostEditorProps {
  onSubmit: (content: string, mediaUrls: string[], category: string, visibility: 'public' | 'community') => Promise<void>;
}

export default function PostEditor({ onSubmit }: PostEditorProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [category, setCategory] = useState('general');
  const [visibility, setVisibility] = useState<'public' | 'community'>('public');
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
      Image
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-lg focus:outline-none max-w-none'
      }
    }
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: handleImageDrop
  });

  async function handleImageDrop(acceptedFiles: File[]) {
    try {
      const newMediaUrls = [];
      
      for (const file of acceptedFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data, error } = await supabase.storage
          .from('post-images')
          .upload(filePath, file, {
            upsert: false
          });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('post-images')
          .getPublicUrl(filePath);

        newMediaUrls.push(publicUrl);
        editor?.commands.setImage({ src: publicUrl });
      }

      setMediaUrls([...mediaUrls, ...newMediaUrls]);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    }
  }

  const handleSubmit = async () => {
    if (!editor?.getText().trim()) {
      alert('Please enter some content');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(
        editor.getHTML(),
        mediaUrls,
        category,
        visibility
      );
      editor.commands.clearContent();
      setMediaUrls([]);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-dark-900 rounded-lg p-6 space-y-4 border border-dark-800">
      <div className="flex gap-4 mb-4">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-dark-800 border-dark-700 text-white rounded-lg focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="general">General</option>
          <option value="wisdom">Wisdom</option>
          <option value="experience">Experience</option>
          <option value="question">Question</option>
        </select>

        <select
          value={visibility}
          onChange={(e) => setVisibility(e.target.value as 'public' | 'community')}
          className="bg-dark-800 border-dark-700 text-white rounded-lg focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="public">Public</option>
          <option value="community">Community Only</option>
        </select>
      </div>

      <EditorContent 
        editor={editor} 
        className="min-h-[150px] bg-dark-800 rounded-lg p-4 text-white"
      />

      <div {...getRootProps()} className="border-2 border-dashed border-dark-700 rounded-lg p-4 text-center cursor-pointer hover:border-primary-500 transition-colors">
        <input {...getInputProps()} />
        <p className="text-gray-400">Drag & drop images here, or click to select</p>
        <p className="text-sm text-gray-500">Max size: 5MB</p>
      </div>

      {mediaUrls.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {mediaUrls.map((url, index) => (
            <img 
              key={index} 
              src={url} 
              alt={`Upload ${index + 1}`} 
              className="w-20 h-20 object-cover rounded-lg"
            />
          ))}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
      >
        {isSubmitting ? 'Posting...' : 'Post'}
      </button>
    </div>
  );
}