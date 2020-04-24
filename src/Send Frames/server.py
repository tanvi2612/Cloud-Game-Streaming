#from subprocess import check_output
#check_output("ffmpeg -framerate 10 -i %0d.bmp -vcodec h264_qsv -b:v 750k 30fps_gta_test.mp4", shell=True)
import socket                   # Import socket module

port = 12348              # Reserve a port for your service every new transfer wants a new port or you must wait.
s = socket.socket()             # Create a socket object
s.bind(('', port))            # Bind to the port
s.listen(5)                     # Now wait for client connection.

print 'Server listening....'


while True:
    conn, addr = s.accept()     # Establish connection with client.
  #  print 'Got connection from', addr
    data = conn.recv(8000000)
 #   print('Server received', repr(data))

    for i in range(100):
        
        filename=str(i)+'.bmp' #In the same folder or path is this file running must the file you want to tranfser to be
        
        f = open(filename,'rb')
        l = f.read(8000000)
        while (l):
           conn.send(l)
    #       print('Sent ',repr(l))
           l = f.read(8000000)
        f.close()

        print('Done sending')
    conn.close()
