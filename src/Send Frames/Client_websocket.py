import asyncio
import websockets

async def hello():
    uri = "ws://192.168.137.205:8766"
    async with websockets.connect(uri) as websocket:
        fo = open("./Caerte_van_Oostlant_4MB.jpg","rb")
        await websocket.send(fo)
        await websocket.recv()

asyncio.get_event_loop().run_until_complete(hello())