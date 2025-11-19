const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8888;

// 中间件配置
app.use(cors()); // 允许所有来源的跨域请求
app.use(express.json({ limit: '10mb' })); // 解析JSON请求体
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // 解析URL编码请求体

// 添加请求日志中间件
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
  console.log('Content-Type:', req.get('Content-Type'));
  next();
});

// 生成唯一SID的函数
function generateSID() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `SM${timestamp}${random}`;
}

// 格式化日期为ISO字符串
function formatDate() {
  return new Date().toISOString();
}

// Twilio Messages API Mock接口
app.post('/api/v1/mock/twilio/messages', (req, res) => {
  try {
    // 添加调试信息
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);
    console.log('Request body type:', typeof req.body);
    
    // 检查req.body是否存在
    if (!req.body) {
      return res.status(400).json({
        error: 'Request body is missing or invalid. Please ensure Content-Type is application/json'
      });
    }
    
    const { to, from, body } = req.body;
    
    // 验证必需的字段
    if (!to || !from || !body) {
      return res.status(400).json({
        error: 'Missing required fields: to, from, and body are required',
        received: { to, from, body }
      });
    }

    // 生成响应数据
    const now = formatDate();
    const response = {
      sid: generateSID(),
      status: "sent",
      to: to,
      from: from,
      body: body,
      date_created: now,
      date_updated: now,
      date_sent: now,
      num_segments: "1",
      price: "-0.0079",
      price_unit: "USD"
    };
    

    console.log(`[${new Date().toLocaleString()}] Message sent:`, {
      sid: response.sid,
      to: response.to,
      from: response.from
    });

    res.status(200).json(response);

    // 往企业微信发送验证码
    const webhookUrl = process.env.WECHAT_WEBHOOK_URL;
    
    if (!webhookUrl) {
      console.warn('企业微信 Webhook URL 未配置，跳过通知发送');
      return;
    }
    
    const wechatMessage = {
      msgtype: "text",
      text: {
        content: `验证码通知\n\n号码: ${to}\n验证码: ${body}\n时间: ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`
      }
    };

    fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(wechatMessage)
    })
    .then(wechatRes => wechatRes.json())
    .then(wechatData => {
      console.log('企业微信通知发送成功:', wechatData);
    })
    .catch(err => {
      console.error('企业微信通知发送失败:', err);
    });
    
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// 健康检查接口
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 根路径
app.get('/', (req, res) => {
  res.json({
    message: 'Twilio Messages Mock API',
    endpoints: {
      'POST /api/v1/mock/twilio/messages': 'Send a mock message',
      'GET /health': 'Health check'
    }
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 Twilio Mock API Server is running on port ${PORT}`);
  console.log(`📍 API endpoint: http://localhost:${PORT}/api/v1/mock/twilio/messages`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;