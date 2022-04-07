
cd /root/webrtc/
unzip backend.zip
cd backend
npm i --only=prod
pm2 -s restart chatAPI