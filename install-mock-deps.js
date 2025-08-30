// 安装Mock服务器依赖的简单脚本
// 运行: node install-mock-deps.js

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('正在检查并安装Mock服务器所需的依赖...');

// 检查package.json中是否已包含express和cors
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const requiredDeps = ['express', 'cors'];
const missingDeps = [];

requiredDeps.forEach(dep => {
  if (!packageJson.dependencies[dep] && !packageJson.devDependencies[dep]) {
    missingDeps.push(dep);
  }
});

if (missingDeps.length === 0) {
  console.log('所有依赖已安装！');
  return;
}

console.log(`发现缺失的依赖: ${missingDeps.join(', ')}`);
console.log('正在安装...');

const installCmd = `npm install --save-dev ${missingDeps.join(' ')}`;
console.log(`执行命令: ${installCmd}`);

exec(installCmd, (error, stdout, stderr) => {
  if (error) {
    console.error('安装依赖时出错:', error);
    return;
  }
  
  console.log('依赖安装成功！');
  console.log('现在你可以运行:');
  console.log('  npm run mock-server  # 启动Mock API服务器');
  console.log('  npm run dev          # 启动前端开发服务器');
});
