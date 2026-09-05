export async function uploadFileToStorage(file: File): Promise<{ url: string; isCloud: false }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('Failed to read file locally'));
        return;
      }
      resolve({ url: reader.result, isCloud: false });
    };
    reader.onerror = () => reject(new Error('Failed to read file locally'));
    reader.readAsDataURL(file);
  });
}
