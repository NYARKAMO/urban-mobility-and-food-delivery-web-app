# SwiftRide API Documentation

This directory contains all API endpoints for the SwiftRide application. The API is organized into four main modules:

1. **Admin API** - Administrative operations
2. **Driver API** - Driver-related operations
3. **Restaurant API** - Restaurant partner operations
4. **User API** - Customer/User operations

## Base URL
```
http://localhost:3000/api
```

## Authentication
Most endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Response Format
All responses follow a standard format:
```json
{
  "status": "success|error",
  "data": {},
  "message": "Response message",
  "timestamp": "2026-01-27T12:00:00Z"
}
```

---

## Table of Contents

- [Admin API](./admin.md)
- [Driver API](./drivers.md)
- [Restaurant API](./restaurants.md)
- [User API](./users.md)

---

## Error Codes

| Code | Status | Meaning |
|------|--------|---------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Access denied |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Internal server error |

---

## Rate Limiting

- API requests are limited to 1000 requests per hour per IP
- Rate limit headers are included in responses:
  - `X-RateLimit-Limit`: 1000
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset timestamp
