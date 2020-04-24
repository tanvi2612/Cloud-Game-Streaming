import asyncio
import websockets

async def echo(websocket, path):
    async for message in websocket:
        await websocket.send(message)
        output = open("output.jpeg","wb")
        output.write(message)

start_server = websockets.serve(echo, "", 8766)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()