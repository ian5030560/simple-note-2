import json
from channels.generic.websocket import AsyncWebsocketConsumer

class AIConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()  # 接受 WebSocket 連接

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        text = text_data_json['message']
        
        # 這裡你可以處理 AI 服務的請求邏輯
        result = await self.send_ai_request(text)

        # 回傳結果給前端
        await self.send(text_data=json.dumps({
            'result': result
        }))
    
    async def send_ai_request(self, text):
        import aiohttp
        
        url = "http://192.168.196.106:8091"
        post_text = {
            "title": "",
            "content": text
        }
        headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer your_token"
        }

        # 發送異步 HTTP POST 請求
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=post_text, headers=headers) as response:
                if response.status == 200:
                    try:
                        result = await response.json()
                        return result  # 返回解析後的 JSON 結果
                    except aiohttp.ContentTypeError:
                        return await response.text()
                else:
                    return f"Request failed with status code {response.status}"
