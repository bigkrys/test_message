#!/usr/bin/env node

// 测试Twilio Mock API的脚本
const https = require('http');

const testData = {
  to: "+8613800138000",
  from: "+12345678900", 
  body: "Your verification code is: 1234. Valid for 5 minutes."
};

const postData = JSON.stringify(testData);

const options = {
  hostname: 'localhost',
  port: 8888,
  path: '/api/v1/mock/twilio/messages',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('测试请求数据:');
console.log(JSON.stringify(testData, null, 2));
console.log('\n发送请求到: http://localhost:8888/api/v1/mock/twilio/messages');
console.log('Content-Type:', options.headers['Content-Type']);
console.log('---\n');

const req = https.request(options, (res) => {
  console.log(`状态码: ${res.statusCode}`);
  console.log(`响应头: ${JSON.stringify(res.headers, null, 2)}`);
  console.log('---');
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('响应数据:');
      console.log(JSON.stringify(response, null, 2));
    } catch (error) {
      console.log('原始响应:');
      console.log(data);
    }
  });
});

req.on('error', (error) => {
  console.error('请求错误:', error);
});

// 发送请求数据
req.write(postData);
req.end();