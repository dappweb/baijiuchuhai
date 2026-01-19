# Implementation Plan: Admin Image Upload API

## Overview

This implementation plan breaks down the admin image upload API into discrete coding tasks. The endpoint will be implemented as a Cloudflare Workers Function that handles authentication, file validation, R2 upload, and response generation. Tasks are ordered to build incrementally, with testing integrated throughout.

## Tasks

- [ ] 1. Set up project structure and constants
  - Create `/functions/api/admin/upload.js` file
  - Define constants for allowed MIME types and max file size
  - Set up basic exports structure for Cloudflare Workers Functions
  - _Requirements: 3.1, 4.1_

- [ ] 2. Implement authentication module
  - [ ] 2.1 Create `verifyAuth` function
    - Extract Authorization header from request
    - Check for "Bearer " prefix
    - Return boolean indicating auth status
    - _Requirements: 1.1, 1.2, 1.3_
  
  - [ ] 2.2 Write unit tests for authentication
    - Test missing Authorization header
    - Test malformed Authorization header
    - Test valid Bearer token
    - _Requirements: 1.1, 1.2, 1.3_
  
  - [ ] 2.3 Write property test for authentication
    - **Property 10: Authentication Required**
    - **Validates: Requirements 1.3**

- [ ] 3. Implement file extraction module
  - [ ] 3.1 Create `extractFile` function
    - Parse request body as FormData
    - Extract file from FormData (check common field names: "file", "image")
    - Return File object or null
    - Handle FormData parsing errors
    - _Requirements: 2.1, 2.2_
  
  - [ ] 3.2 Write unit tests for file extraction
    - Test successful extraction from valid FormData
    - Test missing file returns null
    - Test empty FormData returns null
    - _Requirements: 2.1, 2.2_
  
  - [ ] 3.3 Write property test for file extraction
    - **Property 6: Valid Files Are Extracted From FormData**
    - **Validates: Requirements 2.1**

- [ ] 4. Implement file validation module
  - [ ] 4.1 Create `validateFileType` function
    - Check if file.type is in allowed MIME types array
    - Return validation result object with valid flag and error message
    - _Requirements: 3.1, 3.2_
  
  - [ ] 4.2 Create `validateFileSize` function
    - Check if file.size <= MAX_FILE_SIZE (5MB)
    - Return validation result object with valid flag and error message
    - _Requirements: 4.1, 4.2_
  
  - [ ] 4.3 Write unit tests for file validation
    - Test each supported MIME type is accepted
    - Test unsupported MIME types are rejected
    - Test file at 5MB limit is accepted
    - Test file over 5MB is rejected
    - _Requirements: 3.1, 3.2, 4.1, 4.2_
  
  - [ ] 4.4 Write property test for valid files acceptance
    - **Property 1: Valid Files Are Accepted**
    - **Validates: Requirements 3.1, 4.1**
  
  - [ ] 4.5 Write property test for invalid MIME type rejection
    - **Property 2: Invalid MIME Types Are Rejected**
    - **Validates: Requirements 3.2**
  
  - [ ] 4.6 Write property test for oversized file rejection
    - **Property 3: Oversized Files Are Rejected**
    - **Validates: Requirements 4.2**

- [ ] 5. Checkpoint - Ensure validation logic works
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implement filename generation module
  - [ ] 6.1 Create `generateUniqueFilename` function
    - Extract file extension from original filename
    - Generate unique identifier using crypto.randomUUID()
    - Combine UUID with original extension
    - Return unique filename
    - _Requirements: 5.1, 5.2_
  
  - [ ] 6.2 Write unit tests for filename generation
    - Test extension preservation for various file types
    - Test generated filenames are valid
    - Test multiple calls generate different filenames
    - _Requirements: 5.1, 5.2_
  
  - [ ] 6.3 Write property test for filename uniqueness
    - **Property 4: Unique Filenames Prevent Collisions**
    - **Validates: Requirements 5.1**
  
  - [ ] 6.4 Write property test for extension preservation
    - **Property 5: File Extensions Are Preserved**
    - **Validates: Requirements 5.2**

- [ ] 7. Implement R2 upload module
  - [ ] 7.1 Create `uploadToR2` function
    - Convert File to ArrayBuffer
    - Call env.BUCKET.put() with filename, data, and httpMetadata
    - Set Content-Type header from file.type
    - Handle R2 upload errors with try-catch
    - Return success status or error message
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
  
  - [ ] 7.2 Write unit tests for R2 upload (with mocked R2)
    - Test successful upload sets correct Content-Type
    - Test successful upload uses correct object key
    - Test R2 failure is caught and handled
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
  
  - [ ] 7.3 Write property test for R2 upload correctness
    - **Property 7: R2 Upload Correctness**
    - **Validates: Requirements 6.1, 6.2, 6.3**

- [ ] 8. Implement URL generation module
  - [ ] 8.1 Create `generatePublicUrl` function
    - Construct public R2 URL using bucket domain
    - Use environment variable or hardcoded domain for R2 public URL
    - Return fully qualified URL with filename
    - _Requirements: 7.3_
  
  - [ ] 8.2 Write unit tests for URL generation
    - Test URL format is correct
    - Test URL includes filename
    - Test URL starts with https://
    - _Requirements: 7.3_

- [ ] 9. Checkpoint - Ensure core modules work
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Implement main request handler
  - [ ] 10.1 Create `onRequestPost` function
    - Call verifyAuth and return 401 if unauthorized
    - Call extractFile and return 400 if no file
    - Call validateFileType and return 400 if invalid
    - Call validateFileSize and return 400 if too large
    - Call generateUniqueFilename
    - Call uploadToR2 and return 500 if upload fails
    - Call generatePublicUrl
    - Return 200 with success JSON response
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 3.1, 3.2, 4.1, 4.2, 5.1, 6.1, 7.1, 7.2, 8.1, 8.2_
  
  - [ ] 10.2 Write unit tests for request handler
    - Test authentication failure returns 401
    - Test missing file returns 400
    - Test invalid file type returns 400
    - Test oversized file returns 400
    - Test successful upload returns 200 with correct structure
    - _Requirements: 1.1, 1.2, 2.2, 3.2, 4.2, 7.1, 7.2_
  
  - [ ] 10.3 Write property test for successful response structure
    - **Property 8: Successful Upload Response Structure**
    - **Validates: Requirements 7.1, 7.2, 7.3**
  
  - [ ] 10.4 Write property test for error response structure
    - **Property 9: Error Response Structure**
    - **Validates: Requirements 8.1, 8.2**
  
  - [ ] 10.5 Write property test for validation before processing
    - **Property 11: Validation Before Processing**
    - **Validates: Requirements 2.3**

- [ ] 11. Add error handling and edge cases
  - [ ] 11.1 Add try-catch for FormData parsing errors
    - Wrap FormData parsing in try-catch
    - Return 400 with "Invalid request format" on error
    - _Requirements: 2.2_
  
  - [ ] 11.2 Add comprehensive error messages
    - Ensure all error responses have descriptive messages
    - Match error message format from design document
    - _Requirements: 8.2_
  
  - [ ] 11.3 Write unit tests for edge cases
    - Test FormData parsing failure
    - Test R2 connection issues
    - Test various error message formats
    - _Requirements: 2.2, 6.4, 8.2_

- [ ] 12. Final checkpoint - Integration verification
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- All tasks are required for comprehensive implementation
- Each task references specific requirements for traceability
- Property tests should run minimum 100 iterations using fast-check library
- R2 bucket must have public access configured for URL generation to work
- The R2 public domain URL may need to be configured via environment variable
- Consider adding CORS headers if the endpoint will be called from browser clients
