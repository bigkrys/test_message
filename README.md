# Twilio Messages Mock API

一个模拟Twilio短信API的快速接口，允许所有跨域访问。

## 🚀 快速开始

### 启动服务器
```bash
npm start
```

服务器将在端口8888上运行：
- API接口：http://localhost:8888/api/v1/mock/twilio/messages
- 健康检查：http://localhost:8888/health

### 后台运行
```bash
nohup node server.js > server.log 2>&1 &
```

## 📡 API接口

### POST /api/v1/mock/twilio/messages

发送模拟短信消息

**请求示例：**
```bash
curl -X POST http://localhost:8888/api/v1/mock/twilio/messages \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+8613800138000",
    "from": "+12345678900", 
    "body": "Your SOLAI verification code is: 1234. Valid for 5 minutes."
  }'
```

**请求体格式：**
```json
{
  "to": "+8613800138000",
  "from": "+12345678900", 
  "body": "Your SOLAI verification code is: 1234. Valid for 5 minutes."
}
```

**响应示例 (200 OK)：**
```json
{
  "sid": "SM1761833998049RT2MB2",
  "status": "sent",
  "to": "+8613800138000",
  "from": "+12345678900",
  "body": "Your SOLAI verification code is: 1234. Valid for 5 minutes.",
  "date_created": "2025-10-30T14:19:58.048Z",
  "date_updated": "2025-10-30T14:19:58.048Z",
  "date_sent": "2025-10-30T14:19:58.048Z",
  "num_segments": "1",
  "price": "-0.0079",
  "price_unit": "USD"
}
```

## 🔧 其他接口

### GET /health
健康检查接口
```bash
curl http://localhost:8888/health
```

### GET /
API信息和端点列表
```bash
curl http://localhost:8888/
```

## ⚠️ 注意事项

1. **Content-Type必须设置为 `application/json`**
2. 确保请求体包含所有必需字段：`to`, `from`, `body`
3. 服务器配置了CORS，允许所有来源的跨域请求
4. SID是动态生成的，格式为：`SM{timestamp}{random}`

## 🐛 故障排除

如果遇到"Cannot destructure property 'to' of 'req.body' as it is undefined"错误：

1. 检查Content-Type是否设置为 `application/json`
2. 确保请求体是有效的JSON格式
3. 验证所有必需字段都已包含

查看服务器日志：
```bash
tail -f server.log
```