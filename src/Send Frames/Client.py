import socket                   # Import socket module
import time
time.sleep(5)
s = socket.socket()             # Create a socket object
host = "192.168.137.205"  #Ip address that the TCPServer  is there
port = 12348         # Reserve a port for your service every new transfer wants a new port or you must wait.

s.connect((host, port))
s.send("Hello server!")
for i in range(100):
    with open('frame'+str(i)+'.bmp', 'wb') as f:
        print ('file opened')
        while True:
            print('receiving data...')
            data = s.recv(8000000)
            if not data:
                break
            f.write(data)
            f.close()
print('Successfully get the file')
s.close()
print('connection closed')
