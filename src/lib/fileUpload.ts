import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from './firebase';

export async function uploadFileToStorage(file: File): Promise<{ url: string; isCloud: true }> {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
  const fileRef = ref(storage, `admin-uploads/${Date.now()}-${safeName}`);
  const snapshot = await uploadBytes(fileRef, file, { contentType: file.type || 'application/octet-stream' });
  return { url: await getDownloadURL(snapshot.ref), isCloud: true };
}
