# Design Document: Admin Image Upload API

## Overview

The admin image upload API provides a secure endpoint for authenticated administrators to upload images to Cloudflare R2 object storage. The endpoint follows the Cloudflare Workers Functions pattern, validates incoming files, generates unique filenames, and returns public URLs for uploaded images.

The implementation leverages Cloudflare's edge computing platform with R2 for object storage, providing low-latency uploads and globally distributed image delivery.

## Architecture

The upload endpoint follows a request-response pattern with the following flow:

```
Client Request (FormData + Auth) 
  → Authentication Check 
  → File Extraction 
  → File Type Validation 
  → File Size Validation 
  → Unique Filename Generation 
  → R2 Upload 
  → Public URL Generation 
  → JSON Response
```

**Key Architectural Decisions:**

1. **Cloudflare Workers Functions Format**: Uses the `onRequestPost` export pattern for seamless integration with Cloudflare Pages
2. **R2 Object Storage**: Leverages Cloudflare R2 for cost-effective, globally distributed image storage
3. **Synchronous Processing**: Upload processing is synchronous to provide immediate feedback to the client
4. **Edge Execution**: Runs at Cloudflare's edge for low-latency uploads from any geographic location

## Components and Interfaces

### 1. Authentication Module

**Purpose**: Verify that requests contain valid Bearer tokens

**Interface**:
```javascript
function verifyAuth(request: Request): boolean
```

**Behavior**:
- Extracts the Authorization header from the request
- Checks if the header exists and starts with "Bearer "
- Returns true if valid, false otherwise

**Implementation Notes**:
- Follows the existing auth pattern from other admin routes
- Does not validate the token value itself (assumes presence of Bearer token is sufficient)

### 2. File Extraction Module

**Purpose**: Extract the uploaded file from FormData

**Interface**:
```javascript
async function extractFile(request: Request): Promise<File | null>
```

**Behavior**:
- Parses the request body as FormData
- Extracts the file from a known field name (e.g., "file" or "image")
- Returns the File object or null if not found

**Implementation Notes**:
- Uses the Web API FormData interface
- Expects a single file upload (not multiple files)

### 3. File Validation Module

**Purpose**: Validate file type and size constraints

**Interface**:
```javascript
function validateFileType(file: File): { valid: boolean, error?: string }
function validateFileSize(file: File): { valid: boolean, error?: string }
```

**Behavior**:
- `validateFileType`: Checks if file.type is one of: image/jpeg, image/png, image/webp, image/gif
- `validateFileSize`: Checks if file.size <= 5,242,880 bytes (5MB)
- Returns validation result with error message if invalid

**Constants**:
```javascript
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB in bytes
```

### 4. Filename Generation Module

**Purpose**: Generate unique filenames to prevent collisions

**Interface**:
```javascript
function generateUniqueFilename(originalFilename: string): string
```

**Behavior**:
- Extracts the file extension from the original filename
- Generates a unique identifier (using crypto.randomUUID() or timestamp + random string)
- Combines unique identifier with original extension
- Returns the unique filename

**Example Output**: `a3f2b8c9-4d5e-6f7a-8b9c-0d1e2f3a4b5c.jpg`

**Implementation Notes**:
- Uses `crypto.randomUUID()` for uniqueness (available in Cloudflare Workers)
- Preserves original file extension for proper MIME type handling

### 5. R2 Upload Module

**Purpose**: Upload validated files to Cloudflare R2 storage

**Interface**:
```javascript
async function uploadToR2(
  bucket: R2Bucket, 
  filename: string, 
  file: File
): Promise<{ success: boolean, error?: string }>
```

**Behavior**:
- Converts File to ArrayBuffer or ReadableStream
- Uploads to R2 using bucket.put(filename, data, options)
- Sets Content-Type header based on file.type
- Returns success status or error message

**R2 API Usage**:
```javascript
await env.BUCKET.put(filename, await file.arrayBuffer(), {
  httpMetadata: {
    contentType: file.type
  }
})
```

### 6. URL Generation Module

**Purpose**: Generate public URLs for uploaded images

**Interface**:
```javascript
function generatePublicUrl(filename: string, bucketName: string): string
```

**Behavior**:
- Constructs the public R2 URL using the bucket's public domain
- Format: `https://<bucket-public-domain>/<filename>`
- Returns the fully qualified URL

**Implementation Notes**:
- R2 bucket must have public access configured
- The public domain is typically: `https://pub-<hash>.r2.dev` or a custom domain
- May need to be configured via environment variable or hardcoded based on deployment

### 7. Main Request Handler

**Purpose**: Orchestrate the upload flow and handle errors

**Interface**:
```javascript
export async function onRequestPost({ request, env }): Promise<Response>
```

**Behavior**:
1. Verify authentication
2. Extract file from FormData
3. Validate file type
4. Validate file size
5. Generate unique filename
6. Upload to R2
7. Generate public URL
8. Return JSON response

**Error Handling**:
- Returns appropriate HTTP status codes (401, 400, 500)
- Returns JSON error responses with descriptive messages
- Catches and handles exceptions during R2 upload

## Data Models

### Request Format

**HTTP Method**: POST

**Endpoint**: `/api/admin/upload`

**Headers**:
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body** (FormData):
```
file: <binary image data>
```

### Response Format

**Success Response** (200 OK):
```json
{
  "success": true,
  "url": "https://pub-xxxxx.r2.dev/a3f2b8c9-4d5e-6f7a-8b9c-0d1e2f3a4b5c.jpg",
  "filename": "a3f2b8c9-4d5e-6f7a-8b9c-0d1e2f3a4b5c.jpg"
}
```

**Error Response** (4xx/5xx):
```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

### Error Response Examples

**401 Unauthorized**:
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

**400 Bad Request** (No file):
```json
{
  "success": false,
  "error": "No file provided"
}
```

**400 Bad Request** (Invalid type):
```json
{
  "success": false,
  "error": "Invalid file type. Supported types: JPEG, PNG, WebP, GIF"
}
```

**400 Bad Request** (File too large):
```json
{
  "success": false,
  "error": "File size exceeds 5MB limit"
}
```

**500 Internal Server Error**:
```json
{
  "success": false,
  "error": "Failed to upload file to storage"
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Valid Files Are Accepted

*For any* file with a MIME type in [image/jpeg, image/png, image/webp, image/gif] and size <= 5,242,880 bytes, when uploaded with valid authentication, the file should pass validation and proceed to upload.

**Validates: Requirements 3.1, 4.1**

### Property 2: Invalid MIME Types Are Rejected

*For any* file with a MIME type not in [image/jpeg, image/png, image/webp, image/gif], when uploaded with valid authentication, the endpoint should return a 400 Bad Request response with an error message about invalid file type.

**Validates: Requirements 3.2**

### Property 3: Oversized Files Are Rejected

*For any* file with size > 5,242,880 bytes, when uploaded with valid authentication, the endpoint should return a 400 Bad Request response with an error message about file size limit.

**Validates: Requirements 4.2**

### Property 4: Unique Filenames Prevent Collisions

*For any* set of concurrent uploads, all generated filenames should be unique (no collisions).

**Validates: Requirements 5.1**

### Property 5: File Extensions Are Preserved

*For any* original filename with an extension, the generated unique filename should preserve the same file extension.

**Validates: Requirements 5.2**

### Property 6: Valid Files Are Extracted From FormData

*For any* valid FormData containing a file field, the file extraction function should successfully return the File object.

**Validates: Requirements 2.1**

### Property 7: R2 Upload Correctness

*For any* valid file that passes validation, when uploaded to R2, the R2 object should have the correct object key (matching the generated filename) and the correct Content-Type header (matching the file's MIME type).

**Validates: Requirements 6.1, 6.2, 6.3**

### Property 8: Successful Upload Response Structure

*For any* successful upload, the response should have status 200, contain a JSON body with "success": true, include a "url" field with a fully qualified URL, and include a "filename" field.

**Validates: Requirements 7.1, 7.2, 7.3**

### Property 9: Error Response Structure

*For any* error condition (authentication failure, validation failure, upload failure), the response should have an appropriate HTTP status code (401, 400, or 500) and contain a JSON body with "success": false and an "error" field with a descriptive message.

**Validates: Requirements 8.1, 8.2**

### Property 10: Authentication Required

*For any* request with a valid Bearer token in the Authorization header, the authentication check should pass and allow processing to continue.

**Validates: Requirements 1.3**

### Property 11: Validation Before Processing

*For any* request containing a file, validation (type and size checks) should occur before any upload to R2 is attempted.

**Validates: Requirements 2.3**

## Error Handling

The endpoint implements comprehensive error handling at each stage of processing:

### Authentication Errors

- **Missing Authorization Header**: Return 401 with "Unauthorized" message
- **Malformed Authorization Header**: Return 401 with "Unauthorized" message
- Implementation: Check for header existence and "Bearer " prefix

### Request Parsing Errors

- **No File in FormData**: Return 400 with "No file provided" message
- **FormData Parsing Failure**: Return 400 with "Invalid request format" message
- Implementation: Try-catch around FormData parsing and file extraction

### Validation Errors

- **Invalid MIME Type**: Return 400 with "Invalid file type. Supported types: JPEG, PNG, WebP, GIF"
- **File Too Large**: Return 400 with "File size exceeds 5MB limit"
- Implementation: Explicit validation checks with early returns

### Upload Errors

- **R2 Upload Failure**: Return 500 with "Failed to upload file to storage"
- **R2 Connection Issues**: Return 500 with "Storage service unavailable"
- Implementation: Try-catch around R2 put operation

### Error Response Format

All errors follow a consistent JSON structure:
```json
{
  "success": false,
  "error": "Descriptive error message"
}
```

## Testing Strategy

The testing strategy employs both unit tests and property-based tests to ensure comprehensive coverage of the upload endpoint functionality.

### Unit Testing

Unit tests focus on specific examples, edge cases, and error conditions:

**Authentication Tests**:
- Test missing Authorization header returns 401
- Test malformed Authorization header (no "Bearer " prefix) returns 401
- Test valid Bearer token allows processing

**File Extraction Tests**:
- Test successful file extraction from valid FormData
- Test missing file in FormData returns 400
- Test empty FormData returns 400

**Validation Tests**:
- Test each supported MIME type (JPEG, PNG, WebP, GIF) is accepted
- Test unsupported MIME types (e.g., image/svg+xml, text/plain) are rejected
- Test file exactly at 5MB limit is accepted
- Test file at 5MB + 1 byte is rejected
- Test very small files (1KB) are accepted

**Filename Generation Tests**:
- Test generated filenames preserve original extensions
- Test generated filenames are valid (no special characters that break URLs)
- Test multiple calls generate different filenames

**R2 Upload Tests** (with mocked R2):
- Test successful upload sets correct Content-Type
- Test successful upload uses correct object key
- Test R2 failure is caught and returns 500

**Response Format Tests**:
- Test successful upload returns correct JSON structure
- Test error responses return correct JSON structure
- Test URL format is valid (starts with https://)

### Property-Based Testing

Property tests verify universal properties across randomized inputs. Each test should run a minimum of 100 iterations.

**Testing Library**: Use `fast-check` for JavaScript property-based testing

**Property Test Configuration**:
- Minimum 100 iterations per test
- Each test tagged with: **Feature: admin-image-upload, Property {N}: {property text}**

**Property Tests to Implement**:

1. **Property 1: Valid Files Are Accepted**
   - Generate random files with valid MIME types and sizes <= 5MB
   - Verify all pass validation
   - Tag: **Feature: admin-image-upload, Property 1: Valid Files Are Accepted**

2. **Property 2: Invalid MIME Types Are Rejected**
   - Generate random files with invalid MIME types
   - Verify all return 400 with appropriate error
   - Tag: **Feature: admin-image-upload, Property 2: Invalid MIME Types Are Rejected**

3. **Property 3: Oversized Files Are Rejected**
   - Generate random files with sizes > 5MB
   - Verify all return 400 with appropriate error
   - Tag: **Feature: admin-image-upload, Property 3: Oversized Files Are Rejected**

4. **Property 4: Unique Filenames Prevent Collisions**
   - Generate multiple filename generation calls
   - Verify no duplicates in results
   - Tag: **Feature: admin-image-upload, Property 4: Unique Filenames Prevent Collisions**

5. **Property 5: File Extensions Are Preserved**
   - Generate random filenames with various extensions
   - Verify generated filenames preserve extensions
   - Tag: **Feature: admin-image-upload, Property 5: File Extensions Are Preserved**

6. **Property 6: Valid Files Are Extracted From FormData**
   - Generate random valid FormData with files
   - Verify extraction succeeds for all
   - Tag: **Feature: admin-image-upload, Property 6: Valid Files Are Extracted From FormData**

7. **Property 7: R2 Upload Correctness**
   - Generate random valid files
   - Verify R2 object key and Content-Type are correct
   - Tag: **Feature: admin-image-upload, Property 7: R2 Upload Correctness**

8. **Property 8: Successful Upload Response Structure**
   - Generate random successful uploads
   - Verify response structure is correct for all
   - Tag: **Feature: admin-image-upload, Property 8: Successful Upload Response Structure**

9. **Property 9: Error Response Structure**
   - Generate random error conditions
   - Verify error response structure is correct for all
   - Tag: **Feature: admin-image-upload, Property 9: Error Response Structure**

10. **Property 10: Authentication Required**
    - Generate random requests with valid Bearer tokens
    - Verify all pass authentication
    - Tag: **Feature: admin-image-upload, Property 10: Authentication Required**

11. **Property 11: Validation Before Processing**
    - Generate random requests with files
    - Verify validation occurs before R2 upload attempts
    - Tag: **Feature: admin-image-upload, Property 11: Validation Before Processing**

### Integration Testing

While not part of the automated test suite, manual integration testing should verify:
- End-to-end upload flow with real R2 bucket
- Public URL accessibility after upload
- Concurrent upload handling
- Large file upload performance

### Test Environment Setup

**Mocking Requirements**:
- Mock R2 bucket for unit and property tests
- Mock crypto.randomUUID() for deterministic filename tests
- Mock FormData parsing for edge case testing

**Test Data**:
- Sample image files in each supported format
- Invalid file samples (wrong MIME types, oversized)
- Various filename patterns with different extensions
