# automation-reference-agent-utils-files

**Source:** https://xgodo.com/docs/automation/reference/agent/utils/files

**Scraped:** 2025-01-31T19:32:00.000Z

---

# File Operations

Utils

Read, write, list, upload, and manage files on the device

Access file operations through `agent.utils.files`. Comprehensive file system access for automations. For uploading files to the server, use`agent.utils.uploadTempFile`.

AgentFiles Interface

TypeScriptCopy

```
interface AgentFiles {
  exists(path: string): boolean;
  getSize(filePath: string): number;
  readFullFileBase64(filePath: string): string;
  readFullFile(filePath: string): string;
  openStream(filePath: string): string;
  readChunk(streamId: string, chunkSize: number): number[];
  closeStream(streamId: string): void;
  list(dirPath: string): FileInfo[];
  getPathInfo(path: string): DirectoryInfo | FilePathInfo | PathNotFoundInfo;
  getStorageRoot(): string;
  getHashes(filePath: string): FileHashes | FileHashError;
  base64ToBytes(base64: string): Uint8Array;
  bytesToBlob(bytes: number[] | Uint8Array, mimeType?: string): Blob | null;
  readFileAsBlob(filePath: string, mimeType?: string): Blob | null;
}

// On agent.utils (for file upload)
interface AgentUtils {
  uploadTempFile(filename: string, base64Data: string): Promise<UploadTempFileResult | { success: false; error: string }>;
  uploadTempFile(localFilePath: string): Promise<UploadTempFileResult | { success: false; error: string }>;
}
```

## Basic Operations

### `exists()`

TypeScriptCopy

```
exists(path: string): boolean
```

Checks if a file or directory exists at the specified path.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `path` | `string` | Path to check |

#### Returns

`boolean`true if the path exists

#### Examples

TypeScriptCopy

```
if (agent.utils.files.exists("/sdcard/Download/data.json")) {
  const content = agent.utils.files.readFullFile("/sdcard/Download/data.json");
}
```

### `getSize()`

TypeScriptCopy

```
getSize(filePath: string): number
```

Gets the size of a file in bytes.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `filePath` | `string` | Path to the file |

#### Returns

`number`File size in bytes, or -1 if not found

#### Examples

TypeScriptCopy

```
const size = agent.utils.files.getSize("/sdcard/video.mp4");
```

### `getStorageRoot()`

TypeScriptCopy

```
getStorageRoot(): string
```

Gets the root storage path for the device (typically '/sdcard' or '/storage/emulated/0').

#### Returns

`string`Storage root path

#### Examples

TypeScriptCopy

```
const root = agent.utils.files.getStorageRoot();
const downloadPath = root + "/Download";
```

## Reading Files

### `readFullFile()`

TypeScriptCopy

```
readFullFile(filePath: string): string
```

Reads the entire file content as UTF-8 text.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `filePath` | `string` | Path to the file |

#### Returns

`string`File content as text

#### Examples

TypeScriptCopy

```
const config = agent.utils.files.readFullFile("/sdcard/config.json");
const data = JSON.parse(config);
```

### `readFullFileBase64()`

TypeScriptCopy

```
readFullFileBase64(filePath: string): string
```

Reads the entire file content as a Base64-encoded string. Useful for binary files.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `filePath` | `string` | Path to the file |

#### Returns

`string`Base64-encoded file content

#### Examples

TypeScriptCopy

```
const imageBase64 = agent.utils.files.readFullFileBase64("/sdcard/DCIM/photo.jpg");
const ocrResult = await agent.actions.recognizeText(imageBase64);
```

### `readFileAsBlob()`

TypeScriptCopy

```
readFileAsBlob(filePath: string, mimeType?: string): Blob | null
```

Reads a file directly as a Blob object.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `filePath` | `string` | Path to the file |
| `mimeType?` | `string` | MIME type for the blob |

#### Returns

`Blob | null`Blob object or null on failure

#### Examples

TypeScriptCopy

```
const imageBlob = agent.utils.files.readFileAsBlob("/sdcard/image.png", "image/png");
```

## Streaming Large Files

### `openStream()`

TypeScriptCopy

```
openStream(filePath: string): string
```

Opens a file stream for reading large files in chunks.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `filePath` | `string` | Path to the file |

#### Returns

`string`Stream ID for use with readChunk and closeStream

#### Examples

TypeScriptCopy

```
const streamId = agent.utils.files.openStream("/sdcard/large_file.bin");
let chunk;
while ((chunk = agent.utils.files.readChunk(streamId, 1024 * 1024)).length > 0) {
  // Process chunk...
}
agent.utils.files.closeStream(streamId);
```

### `readChunk()`

TypeScriptCopy

```
readChunk(streamId: string, chunkSize: number): number[]
```

Reads a chunk of data from an open file stream.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `streamId` | `string` | Stream ID from openStream() |
| `chunkSize` | `number` | Maximum bytes to read |

#### Returns

`number[]`Array of byte values (empty if end of file)

### `closeStream()`

TypeScriptCopy

```
closeStream(streamId: string): void
```

Closes an open file stream.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `streamId` | `string` | Stream ID from openStream() |

## Directory Operations

### `list()`

TypeScriptCopy

```
list(dirPath: string): FileInfo[]
```

Lists all files and directories in the specified directory.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `dirPath` | `string` | Directory path |

#### Returns

`FileInfo[]`Array of file/directory information

#### Examples

TypeScriptCopy

```
const files = agent.utils.files.list("/sdcard/Download");
for (const file of files) {
  console.log(file.name, file.isDirectory ? "(dir)" : file.size + " bytes");
}
```

### `getPathInfo()`

TypeScriptCopy

```
getPathInfo(path: string): DirectoryInfo | FilePathInfo | PathNotFoundInfo
```

Gets detailed information about a path, including whether it's a file or directory.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `path` | `string` | Path to check |

#### Returns

`DirectoryInfo | FilePathInfo | PathNotFoundInfo`Detailed path information based on path type

#### Examples

TypeScriptCopy

```
const info = agent.utils.files.getPathInfo("/sdcard/Download");
if (info.exists && info.isDirectory) {
  console.log("Contains", info.totalItems, "items");
}
```

## File Integrity

### `getHashes()`

TypeScriptCopy

```
getHashes(filePath: string): FileHashes | FileHashError
```

Calculates MD5, SHA-1, and SHA-256 hashes for a file.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `filePath` | `string` | Path to the file |

#### Returns

`FileHashes | FileHashError`Hash values or error

#### Examples

TypeScriptCopy

```
const hashes = agent.utils.files.getHashes("/sdcard/download.apk");
if (!("error" in hashes)) {
  console.log("MD5:", hashes.md5);
  console.log("SHA-256:", hashes.sha256);
}
```

## File Upload

### `uploadTempFile()`

TypeScriptCopy

```
uploadTempFile(filename: string, base64Data: string): Promise<UploadTempFileResult | { success: false; error: string }>
```

Uploads a file to the server as a temporary file. The file will be automatically deleted after 15 minutes. This overload accepts base64-encoded file data.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `filename` | `string` | Name for the uploaded file (including extension) |
| `base64Data` | `string` | Base64-encoded file content |

#### Returns

`UploadTempFileResult | { success: false; error: string }`Upload result with file URL on success, or error on failure

#### Examples

Upload a screenshot

TypeScriptCopy

```
const screenshot = await agent.actions.screenshot(1080, 1920, 80);
if (screenshot.screenshot) {
  const result = await agent.utils.uploadTempFile(
    "screenshot.jpg",
    screenshot.screenshot
  );

  if (result.success) {
    console.log("File URL:", result.data.url);
    console.log("Expires at:", result.data.expiresAt);
  } else {
    console.error("Upload failed:", result.error);
  }
}
```

Upload text data as file

TypeScriptCopy

```
const jsonData = JSON.stringify({ results: [1, 2, 3] });
const base64 = btoa(jsonData);

const result = await agent.utils.uploadTempFile("results.json", base64);
if (result.success) {
  console.log("Uploaded to:", result.data.url);
}
```

### `uploadTempFile (local file)()`

TypeScriptCopy

```
uploadTempFile(localFilePath: string): Promise<UploadTempFileResult | { success: false; error: string }>
```

Uploads a local file from the device to the server as a temporary file. The file will be automatically deleted after 15 minutes. This overload reads the file in chunks to handle large files efficiently.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `localFilePath` | `string` | Absolute path to the file on the device |

#### Returns

`UploadTempFileResult | { success: false; error: string }`Upload result with file URL on success, or error on failure

#### Examples

Upload a downloaded file

TypeScriptCopy

```
const result = await agent.utils.uploadTempFile("/sdcard/Download/report.pdf");

if (result.success) {
  console.log("Uploaded:", result.data.originalName);
  console.log("Size:", result.data.size, "bytes");
  console.log("URL:", result.data.url);
} else {
  console.error("Upload failed:", result.error);
}
```

Upload and share URL

TypeScriptCopy

```
const imagePath = "/sdcard/DCIM/Camera/photo.jpg";

if (agent.utils.files.exists(imagePath)) {
  const result = await agent.utils.uploadTempFile(imagePath);
  if (result.success) {
    // Use the URL (valid for 15 minutes)
    await agent.utils.job.submitTask("success", {
      imageUrl: result.data.url
    }, true, []);
  }
}
```

## Data Conversion

### `base64ToBytes()`

TypeScriptCopy

```
base64ToBytes(base64: string): Uint8Array
```

Converts a Base64-encoded string to a Uint8Array.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `base64` | `string` | Base64-encoded string |

#### Returns

`Uint8Array`Decoded byte array

### `bytesToBlob()`

TypeScriptCopy

```
bytesToBlob(bytes: number[] | Uint8Array, mimeType?: string): Blob | null
```

Converts a byte array to a Blob object.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `bytes` | `number[] | Uint8Array` | Byte array |
| `mimeType?` | `string` | MIME type for the blob |

#### Returns

`Blob | null`Blob object or null on failure

## Types

### FileInfo

TypeScriptCopy

```
interface FileInfo {
  name: string;        // File or directory name
  path: string;        // Full path
  isDirectory: boolean;
  isFile: boolean;
  size: number;        // Size in bytes (0 for directories)
  lastModified: number; // Timestamp
}
```

### DirectoryInfo

TypeScriptCopy

```
interface DirectoryInfo {
  exists: true;
  path: string;
  name: string;
  isDirectory: true;
  isFile: false;
  lastModified: number;
  canRead: boolean;
  canWrite: boolean;
  fileCount: number;      // Number of files
  directoryCount: number; // Number of subdirectories
  totalItems: number;     // Total items
}
```

### FilePathInfo

TypeScriptCopy

```
interface FilePathInfo {
  exists: true;
  path: string;
  name: string;
  isDirectory: false;
  isFile: true;
  lastModified: number;
  canRead: boolean;
  canWrite: boolean;
  size: number;
}
```

### PathNotFoundInfo

TypeScriptCopy

```
interface PathNotFoundInfo {
  exists: false;
  error?: string;
}
```

### FileHashes

TypeScriptCopy

```
interface FileHashes {
  md5: string;
  sha1: string;
  sha256: string;
  size: number;
}
```

### UploadTempFileResult

Result returned when a file is successfully uploaded.

TypeScriptCopy

```
interface UploadTempFileResult {
  success: true;
  message: string;           // "File uploaded successfully"
  data: {
    filename: string;        // Server-assigned filename (e.g., "1234567890_example.pdf")
    originalName: string;    // Original filename provided
    size: number;            // File size in bytes
    url: string;             // Full URL to access the file
    expiresAt: string;       // ISO 8601 expiration timestamp (15 minutes from upload)
  };
}
```