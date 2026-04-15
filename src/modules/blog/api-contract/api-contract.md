#  API Contract — Blogger Module

##  Authentication

All protected endpoints require:
Authorization: Bearer <jwt_token>


### List Articles (Public)

GET /api/articles?search=&type=BLOG|ACTUALITE&tag=tagId&page=1&limit=9

**Response 200:**

```json
{
  "data": [
    {
      "article_id": "a1714000000001",
      "title": "Article Title",
      "slug": "article-title",
      "type": "BLOG",
      "excerpt": "Short summary...",
      "cover_img": "https://...",
      "status": "PUBLISHED",
      "author_id": "u1",
      "tags": [{ "id": "t1", "name": "React" }],
      "likesCount": 12,
      "savesCount": 5,
      "created_at": "2026-04-14",
      "updated_at": "2026-04-14"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 9,
    "total": 42,
    "totalPages": 5
  }
}
```

### Get Single Article (Public)

GET /api/articles/:id
GET /api/articles/slug/:slug

**Response 200:**  

```json 

{
  "data": {
    "article_id": "a1714000000001",
    "title": "Full Article Title",
    "slug": "full-article-title",
    "type": "BLOG",
    "excerpt": "...",
    "cover_img": "https://...",
    "content": "{ \"root\": { ... } }",
    "status": "PUBLISHED",
    "author_id": "u1",
    "tags": [{"id": "t1", "name": "React"}],
    "likesCount": 12,
    "savesCount": 5,
    "created_at": "2026-04-14",
    "updated_at": "2026-04-14"
  }
} 
``` 
**Error 404** 

```json
{
  "error": {
    "code": "ARTICLE_NOT_FOUND",
    "message": "Article not found"
  }
} 
``` 
### Create Article (Admin Only)

POST /api/articles
Authorization: Bearer <jwt_token>

**Request Body:**
```json 
{
  "title": "string (required, min:5, max:200)",
  "type": "BLOG | ACTUALITE",
  "excerpt": "string (required, max:200)",
  "cover_img": "string (required, URL)",
  "content": "string (required, Lexical JSON)",
  "status": "DRAFT | PUBLISHED",
  "tags": ["tagId1", "tagId2"]
} 
``` 
**rules** 
**slug:auto generated** 
**status: PUBLISHED  all required fields must be present** 

**response 201**  
```json
{
  "data": {
    "article_id": "a1714000000001",
    "title": "Article Title",
    "slug": "article-title",
    "type": "BLOG",
    "status": "DRAFT",
    "author_id": "u1",
    "tags": ["tagId1", "tagId2"],
    "created_at": "2026-04-14"
  }
}
 ``` 
**error 400 validation** 
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "errors": {
      "title": "Title is required",
      "excerpt": "Excerpt is required",
      "cover_img": "Cover image is required for publishing",
      "content": "Content is required for publishing"
    }
  }
}
```  
**error 401 Unauthorized** 
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
``` 

**error 403 forbidden** 
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Admin access required"
  }
}
```  

### Update Article (Admin Only)


PUT /api/articles/:id
Authorization: Bearer <jwt_token>

**Request Body:**
```json 
{
  "title": "Updated Title",
  "type": "BLOG | ACTUALITE",
  "excerpt": "string",
  "cover_img": "string",
  "content": "string",
  "status": "DRAFT | PUBLISHED",
  "tags": ["tagId1", "tagId3"]
}
```  

**Response 200:** 

```json 
{
  "data": {
    "article_id": "a1714000000001",
    "title": "Updated Title",
    "slug": "updated-title",
    "type": "BLOG",
    "excerpt": "Updated excerpt...",
    "cover_img": "https://...",
    "content": "{ \"root\": { ... } }",
    "status": "PUBLISHED",
    "author_id": "u1",
    "tags": ["tagId1", "tagId3"],
    "updated_at": "2026-04-14"
  }
}
``` 
**error 404**  
```json 
{
  "error": {
    "code": "ARTICLE_NOT_FOUND",
    "message": "Article not found"
  }
}
``` 



### Change Article Status (Admin Only)

**To PUBLISHED: requires title, excerpt, cover_img, content**
**To DRAFT: no validation required** 


**response: 200**  
```json
{
  "data": {
    "article_id": "a1714000000001",
    "status": "PUBLISHED",
    "updated_at": "2026-04-14"
  }
}
``` 

**error 400 can not publish**  
```json 
{
  "error": {
    "code": "INVALID_STATUS_CHANGE",
    "message": "Cannot publish article. Missing required fields for publishing.",
    "errors": {
      "title": "Title is required for publishing",
      "excerpt": "Excerpt is required for publishing",
      "cover_img": "Cover image is required for publishing",
      "content": "Content is required for publishing"
    }
  }
}
```  

### Delete Article (Admin Only)


DELETE /api/articles/:id
Authorization: Bearer <jwt_token>

**Response** 
204 No Content

**Error 404:** 

```json 
{
  "error": {
    "code": "ARTICLE_NOT_FOUND",
    "message": "Article not found"
  }
}
``` 

### List Tags (Public)


GET /api/tags


**Response200:** 




```json 
{
  "data": [
    { "id": "t1", "name": "JavaScript", "count": 8 },
    { "id": "t2", "name": "React", "count": 5 },
    { "id": "t3", "name": "CSS", "count": 0 }
  ]
}
``` 

### Create Tag (Admin Only)


POST /api/tags
Authorization: Bearer <jwt_token>


**Request** 

```json 
{
  "name": "string (required, unique, max:50)"
}
``` 

**Response 201:** 

```json 
{
  "data": {
    "id": "t1714000000001",
    "name": "NewTag",
    "count": 0
  }
}
```  

**Error 409 (Duplicate):** 

```json 
{
  "error": {
    "code": "DUPLICATE_TAG",
    "message": "Tag with this name already exists"
  }
}
```   

**Error 400:** 

```json 
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Tag name is required"
  }
}
```     


### Delete Tag (Admin Only)

DELETE /api/tags/:id
Authorization: Bearer <jwt_token>

**Constraint: Can only delete if count === 0 (not used in any article)**
**Response: 204 No Content**

**Error 400**  

```json 
{
  "error": {
    "code": "TAG_IN_USE",
    "message": "Cannot delete tag. It is used in 3 articles."
  }
}
``` 

**Error 404**  

```json 
{
  "error": {
    "code": "TAG_NOT_FOUND",
    "message": "Tag not found"
  }
}
``` 

### Like Article (Authenticated) 

POST /api/articles/:id/likes
Authorization: Bearer <jwt_token>



**Response 200:**  

```json 
{
  "data": {
    "liked": true,
    "likesCount": 13
  }
}
```  

### Unlike Article (Authenticated) 

POST /api/articles/:id/likes
Authorization: Bearer <jwt_token>



**Response 200:**  

```json 
{
  "data": {
    "liked": false,
    "likesCount": 12
  }
}
``` 

**Error 404:**  

```json 
{
  "error": {
    "code": "ARTICLE_NOT_FOUND",
    "message": "Article not found"
  }
}
``` 

### Save Article (Authenticated) 

POST /api/articles/:id/saves
Authorization: Bearer <jwt_token>



**Response 200:**  

```json 
{
  "data": {
    "saved": true,
    "savesCount": 6
  }
}
```  

### Unsave Article (Authenticated) 

POST /api/articles/:id/saves
Authorization: Bearer <jwt_token>



**Response 200:**  

```json 
{
  "data": {
    "saved": false,
    "savesCount": 12
  }
}
``` 

## Upload Cover Image (Admin Only)
POST /api/upload/cover
Authorization: Bearer <jwt_token>

**Content-Type: multipart/form-data** 

**Form Data:**

**file: (image/*, max: 5MB)**

**Response 201:**

```json
{
  "data": {
    "url": "https://cdn.example.com/covers/abc.webp",
    "filename": "abc.webp",
    "size": 204800
  }
} 
```
**Error 413 (File Too Large):**
```json
{
  "error": {
    "code": "FILE_TOO_LARGE",
    "message": "File size exceeds 5MB limit"
  }
}
```
**Error 400 (Invalid Type):**
```json
{
  "error": {
    "code": "INVALID_FILE_TYPE",
    "message": "Only image files are allowed (jpg, png, webp)"
  }
} 
```
**Standard Error Format**
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable description",
    "status": 400
  }
}
```
### Related Articles (Public)


GET /api/articles/:id/related?limit=3


**Response 200:** 

```json 
{
  "data": [
    {
      "article_id": "a1714000000002",
      "title": "Related Article Title",
      "slug": "related-article",
      "type": "BLOG",
      "excerpt": "Short summary...",
      "cover_img": "https://...",
      "reading_time": 5,
      "shared_tags": ["React", "JavaScript"],
      "shared_tags_count": 2,
      "relevance_score": 2.5,
      "created_at": "2026-04-14"
    }
  ],
  "meta": {
    "is_fallback": false,
    "total_matches": 3
  }
}
``` 

### Save Draft (Admin Only)

PATCH `/api/articles/:id/draft`
Authorization: Bearer <jwt_token>


**Request Body:**
```json
{
  "title": "Draft Title (optional)",
  "excerpt": "Draft excerpt (optional)", 
  "content": "{ \"root\": { ... } }",
  "cover_img": "https://...",
  "tags": ["tagId1"]
} 
```

**Response 200:** 
```json
{
  "data": {
    "article_id": "a1714000000001",
    "status": "DRAFT",
    "updated_at": "2026-04-15T18:30:00Z",
    "saved_as_draft": true
  }
}
```json