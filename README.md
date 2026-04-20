# Twilio Messages Mock API

A lightweight mock API that simulates Twilio's SMS messaging endpoint. CORS is enabled for all origins, making it convenient for local development and integration testing.

## 🚀 Quick Start

### Start the server
```bash
npm start
```

The server runs on port `8888`:
- API endpoint: http://localhost:8888/api/v1/mock/twilio/messages
- Health check: http://localhost:8888/health

### Run in the background
```bash
nohup node server.js > server.log 2>&1 &
```

## 📡 API

### POST /api/v1/mock/twilio/messages

Send a mock SMS message.

**Example request:**
```bash
curl -X POST http://localhost:8888/api/v1/mock/twilio/messages \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+8613800138000",
    "from": "+12345678900",
    "body": "Your verification code is: 1234. Valid for 5 minutes."
  }'
```

**Request body:**
```json
{
  "to": "+8613800138000",
  "from": "+12345678900",
  "body": "Your verification code is: 1234. Valid for 5 minutes."
}
```

**Example response (200 OK):**
```json
{
  "sid": "SM1761833998049RT2MB2",
  "status": "sent",
  "to": "+8613800138000",
  "from": "+12345678900",
  "body": "Your verification code is: 1234. Valid for 5 minutes.",
  "date_created": "2025-10-30T14:19:58.048Z",
  "date_updated": "2025-10-30T14:19:58.048Z",
  "date_sent": "2025-10-30T14:19:58.048Z",
  "num_segments": "1",
  "price": "-0.0079",
  "price_unit": "USD"
}
```

## 🔧 Other endpoints

### GET /health
Health check.
```bash
curl http://localhost:8888/health
```

### GET /
API information and endpoint list.
```bash
curl http://localhost:8888/
```

## ⚠️ Notes

1. `Content-Type` must be set to `application/json`.
2. The request body must include all required fields: `to`, `from`, `body`.
3. CORS is enabled for all origins.
4. The `sid` is generated dynamically in the form `SM{timestamp}{random}`.

## 🐛 Troubleshooting

If you see the error `Cannot destructure property 'to' of 'req.body' as it is undefined`:

1. Check that `Content-Type` is set to `application/json`.
2. Ensure the request body is valid JSON.
3. Verify all required fields are present.

Tail the server log:
```bash
tail -f server.log
```
