// frontend/src/components/ImageKitUploader.tsx
import type { FC, ChangeEvent } from 'react';

export interface UploadedAsset {
  fileId: string;
  name: string;
  url: string;
  size: number;
}

interface Props {
  pendingFiles: File[];
  onFilesChange: (files: File[]) => void;
  uploading?: boolean;
  uploadProgress?: number;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

/**
 * Sanitizes client name and contact details into a safe ImageKit folder name:
 * /Clients/Files/{ClientName}_{ContactDetails}
 */
export function buildClientImageKitFolder(fullName: string, contact: string): string {
  const cleanName = fullName
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
  const cleanContact = contact
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');

  const folderLeaf = `${cleanName || 'Client'}_${cleanContact || 'NoContact'}`;
  return `/Clients/Files/${folderLeaf}`;
}

/**
 * Uploads all queued files to ImageKit inside /Clients/Files/{Name}_{Contact} when Submit is clicked
 */
export async function uploadQueuedClientFiles(
  files: File[],
  fullName: string,
  contact: string,
  onProgress?: (percent: number) => void
): Promise<UploadedAsset[]> {
  if (!files || files.length === 0) return [];

  const targetFolder = buildClientImageKitFolder(fullName, contact);
  const uploadedResults: UploadedAsset[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const authRes = await fetch(`${API_BASE}/api/imagekit-auth`);
    if (!authRes.ok) {
      throw new Error('Could not connect to upload authentication server.');
    }
    const { token, expire, signature, publicKey } = await authRes.json();
    const resolvedPublicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY || publicKey;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', `${Date.now()}_${file.name}`);
    formData.append('publicKey', resolvedPublicKey);
    formData.append('signature', signature);
    formData.append('expire', String(expire));
    formData.append('token', token);
    formData.append('folder', targetFolder);

    const uploaded = await new Promise<UploadedAsset>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://upload.imagekit.io/api/v1/files/upload');

      xhr.upload.onprogress = (evt) => {
        if (evt.lengthComputable && onProgress) {
          const fileFraction = evt.loaded / evt.total;
          const overallPercent = Math.round(((i + fileFraction) / files.length) * 100);
          onProgress(overallPercent);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const data = JSON.parse(xhr.responseText);
          resolve({
            fileId: data.fileId,
            name: data.name,
            url: data.url,
            size: data.size,
          });
        } else {
          reject(new Error(`Upload failed for "${file.name}". Verify ImageKit keys.`));
        }
      };

      xhr.onerror = () => reject(new Error(`Network error while uploading "${file.name}".`));
      xhr.send(formData);
    });

    uploadedResults.push(uploaded);
  }

  return uploadedResults;
}

export const ImageKitDirectUploader: FC<Props> = ({
  pendingFiles,
  onFilesChange,
  uploading = false,
  uploadProgress = 0,
}) => {
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedList = e.target.files;
    if (!selectedList || selectedList.length === 0) return;

    const newFiles = Array.from(selectedList);
    onFilesChange([...pendingFiles, ...newFiles]);
    e.target.value = '';
  };

  const removeQueuedFile = (indexToRemove: number) => {
    onFilesChange(pendingFiles.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="glass-subcard rounded-3xl p-5 sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h4 className="text-sm font-semibold">
            Upload Project Assets (Logos, Screenshots, CSVs, 3D Models)
          </h4>
          <p className="mt-0.5 text-xs opacity-60">
            Optional — Select multiple files. They will be uploaded together when you click Submit.
          </p>
        </div>

        <label className="liquid-glass-pill inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full px-6 py-3 text-xs font-semibold">
          <span>+ Select Files</span>
          <input
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
            disabled={uploading}
          />
        </label>
      </div>

      {uploading && (
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-[11px] font-semibold opacity-75">
            <span>Uploading {pendingFiles.length} file(s) to your client folder...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-500/20">
            <div
              className="h-full bg-current transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {pendingFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <span className="block text-[11px] font-bold uppercase tracking-wider opacity-50">
            Queued Files ({pendingFiles.length}) — Uploads on Submit
          </span>
          <div className="flex flex-wrap gap-2">
            {pendingFiles.map((file, idx) => (
              <div
                key={`${file.name}-${idx}`}
                className="liquid-glass-pill inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-xs font-medium"
              >
                <span className="max-w-[200px] truncate">{file.name}</span>
                <span className="text-[10px] opacity-55">
                  ({(file.size / 1024).toFixed(0)} KB)
                </span>
                {!uploading && (
                  <button
                    type="button"
                    onClick={() => removeQueuedFile(idx)}
                    className="cursor-pointer rounded-full px-1 text-xs font-bold opacity-60 hover:opacity-100"
                    title="Remove file"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};