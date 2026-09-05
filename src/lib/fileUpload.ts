import { supabase } from './supabase';

export async function uploadFileToStorage(file: File): Promise<{ url: string; isCloud: true }> {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
  const path = `admin-uploads/${Date.now()}-${safeName}`;
  const { error } = await supabase.storage.from('admin-uploads').upload(path, file, {
    contentType: file.type || 'application/octet-stream',
    upsert: false,
  });
  if (error) throw error;
  return { url: supabase.storage.from('admin-uploads').getPublicUrl(path).data.publicUrl, isCloud: true };
}
