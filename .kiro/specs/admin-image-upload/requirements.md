# Requirements Document

## Introduction

This document specifies the requirements for an admin image upload API endpoint for a Cloudflare Pages application. The endpoint will allow authenticated administrators to upload images to Cloudflare R2 object storage and receive public URLs for the uploaded images.

## Glossary

- **Upload_Endpoint**: The POST /api/admin/upload API route that handles image uploads
- **R2_Storage**: Cloudflare R2 object storage service bound as "BUCKET"
- **Auth_Token**: Bearer token passed in the Authorization header for authentication
- **Image_File**: A file in one of the supported formats (JPEG, PNG, WebP, GIF)
- **Public_URL**: The publicly accessible URL for an uploaded image in R2
- **Unique_Filename**: A generated filename that prevents collisions with existing files

## Requirements

### Requirement 1: Authentication

**User Story:** As a system administrator, I want only authenticated users to upload images, so that unauthorized users cannot abuse the upload functionality.

#### Acceptance Criteria

1. WHEN a request is received without an Authorization header, THEN THE Upload_Endpoint SHALL return a 401 Unauthorized response
2. WHEN a request is received with an Authorization header that does not start with "Bearer ", THEN THE Upload_Endpoint SHALL return a 401 Unauthorized response
3. WHEN a request is received with a valid Bearer token, THEN THE Upload_Endpoint SHALL proceed with processing the upload

### Requirement 2: File Upload Processing

**User Story:** As an administrator, I want to upload image files via FormData, so that I can add images to the application.

#### Acceptance Criteria

1. WHEN a valid authenticated request contains FormData with an image file, THEN THE Upload_Endpoint SHALL extract the file from the FormData
2. WHEN the request does not contain a file in the FormData, THEN THE Upload_Endpoint SHALL return a 400 Bad Request response with an error message
3. WHEN the FormData contains a file, THEN THE Upload_Endpoint SHALL validate the file before processing

### Requirement 3: File Type Validation

**User Story:** As a system administrator, I want to restrict uploads to supported image formats, so that only valid image files are stored.

#### Acceptance Criteria

1. WHEN an uploaded file has a MIME type of image/jpeg, image/png, image/webp, or image/gif, THEN THE Upload_Endpoint SHALL accept the file for processing
2. WHEN an uploaded file has a MIME type that is not image/jpeg, image/png, image/webp, or image/gif, THEN THE Upload_Endpoint SHALL return a 400 Bad Request response with an error message indicating invalid file type
3. WHEN validating file type, THE Upload_Endpoint SHALL check the MIME type from the uploaded file metadata

### Requirement 4: File Size Validation

**User Story:** As a system administrator, I want to limit upload file sizes, so that storage costs and bandwidth usage remain manageable.

#### Acceptance Criteria

1. WHEN an uploaded file is 5MB or smaller, THEN THE Upload_Endpoint SHALL accept the file for processing
2. WHEN an uploaded file exceeds 5MB, THEN THE Upload_Endpoint SHALL return a 400 Bad Request response with an error message indicating the file is too large
3. THE Upload_Endpoint SHALL calculate file size in bytes where 5MB equals 5,242,880 bytes

### Requirement 5: Unique Filename Generation

**User Story:** As a system administrator, I want uploaded files to have unique names, so that files do not overwrite each other in storage.

#### Acceptance Criteria

1. WHEN processing an upload, THE Upload_Endpoint SHALL generate a unique filename for the file
2. WHEN generating a unique filename, THE Upload_Endpoint SHALL preserve the original file extension
3. WHEN generating a unique filename, THE Upload_Endpoint SHALL use a method that ensures uniqueness across concurrent uploads

### Requirement 6: R2 Storage Upload

**User Story:** As an administrator, I want uploaded images stored in R2, so that they are durably persisted and publicly accessible.

#### Acceptance Criteria

1. WHEN a file passes all validations, THEN THE Upload_Endpoint SHALL upload the file to R2_Storage using the BUCKET binding
2. WHEN uploading to R2_Storage, THE Upload_Endpoint SHALL use the generated unique filename as the object key
3. WHEN uploading to R2_Storage, THE Upload_Endpoint SHALL set the appropriate Content-Type header based on the file's MIME type
4. IF the R2 upload fails, THEN THE Upload_Endpoint SHALL return a 500 Internal Server Error response with an error message

### Requirement 7: Public URL Response

**User Story:** As an administrator, I want to receive the public URL of uploaded images, so that I can reference them in the application.

#### Acceptance Criteria

1. WHEN an upload succeeds, THEN THE Upload_Endpoint SHALL return a 200 OK response with a JSON body
2. WHEN returning a success response, THE Upload_Endpoint SHALL include the Public_URL in the JSON response body
3. THE Public_URL SHALL be a fully qualified URL that allows public access to the uploaded image in R2_Storage

### Requirement 8: Error Handling

**User Story:** As a developer, I want clear error messages for failed uploads, so that I can diagnose and fix issues quickly.

#### Acceptance Criteria

1. WHEN an error occurs during upload processing, THEN THE Upload_Endpoint SHALL return an appropriate HTTP status code
2. WHEN an error occurs during upload processing, THEN THE Upload_Endpoint SHALL return a JSON response body containing an error message
3. WHEN multiple validation errors could apply, THE Upload_Endpoint SHALL return the first validation error encountered
