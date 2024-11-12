# **Simple Note 2**

## 專案連結

- **Gitmind**: [Project Mind Map](https://gitmind.com/app/docs/mx5veu0a)
- **Trello**: [Task Management Board](https://trello.com/b/i1GNL4DS/simplenote2)

---

## 🚀 **Backend 啟動步驟**

### 1. 啟動 Docker

```bash
# 移動至 Docker 檔案所在的資料夾
cd /djangogirlsVenv
# 使用 Docker Compose 啟動服務
docker-compose up -d --build
```

### 2. 啟動 ngork ( _開啟 cmd_ )

```bash
# 啟動 Docker 之後，使用 Ngrok 將本地伺服器暴露給外部訪問
ngrok http 8000

# 如果需要新增 Ngrok Token
ngrok config add-authtoken <your_token>
```

### 3. 啟動 Breeze AI ( _在桌面的資料夾_ )

```bash
直接啟動 Breeze.py
```

### 4. 啟動 ZeroTier ( _開啟軟體程式_ )

```bash
連接到 AI API 的本地伺服器（通常為 localhost:8091）

使用 ZeroTier 提供的連接網址進行訪問，例如：http://192.168.196.106:8091
```

### 若要停止 Docker

```bash
# 移動至 Docker 檔案所在的資料夾
cd /djangogirlsVenv

# 使用 Docker Compose 停止服務
docker-compose down
```
