import json
from channels.testing import WebsocketCommunicator
from django.test import TestCase
from myproject.asgi import application  # Replace with your actual ASGI application path

class AIConsumerTestCase(TestCase):
    async def test_websocket_connection(self):
        """Test WebSocket connection."""
        communicator = WebsocketCommunicator(application, "/ws/ai/")  # Replace with your WebSocket route
        connected, subprotocol = await communicator.connect()
        self.assertTrue(connected)

        await communicator.disconnect()

    async def test_websocket_message_handling(self):
        """Test WebSocket message handling and AI response."""
        communicator = WebsocketCommunicator(application, "/ws/ai/")  # Replace with your WebSocket route
        await communicator.connect()

        # Send a message to the WebSocket
        test_message = {"message": "Test input for AI"}
        await communicator.send_json_to(test_message)

        # Receive the response
        response = await communicator.receive_json_from()
        self.assertIn("result", response)

        await communicator.disconnect()

    # async def test_invalid_json_handling(self):
    #     """Test handling of invalid JSON messages."""
    #     communicator = WebsocketCommunicator(application, "/ws/ai/")  # Replace with your WebSocket route
    #     await communicator.connect()

    #     # Send invalid JSON
    #     invalid_message = "Invalid JSON format"
    #     await communicator.send_to(invalid_message)

    #     # Expect the connection to close due to an error
    #     with self.assertRaises(json.JSONDecodeError):
    #         await communicator.receive_json_from()

    #     await communicator.disconnect()

    async def test_ai_api_integration(self):
        """Test integration with AI API."""
        communicator = WebsocketCommunicator(application, "/ws/ai/")  # Replace with your WebSocket route
        await communicator.connect()

        # Mock AI API response (you can use libraries like aioresponses for this in real tests)
        test_message = {"message": "Test input for AI"}
        expected_result = {"response": "AI processed result"}

        async def mock_send_ai_request(*args, **kwargs):
            return expected_result

        from aiSocket.consumers import AIConsumer  # Replace with your actual consumer path
        AIConsumer.send_ai_request = mock_send_ai_request

        # Send a message to the WebSocket
        await communicator.send_json_to(test_message)

        # Receive the response
        response = await communicator.receive_json_from()
        self.assertEqual(response["result"], expected_result)

        await communicator.disconnect()
