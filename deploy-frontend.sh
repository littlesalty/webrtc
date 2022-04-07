#!/bin/bash
set -e

read -s -p "Enter passphrase for key '$HOME/.ssh/id_rsa': " sshPass  
echo ""
export SSHPASS=$sshPass

echo "🧹 Cleanup..."
sshpass -e -P "passphrase" ssh root@saltyspicer.top rm -rf /root/webrtc/frontend/*

echo "⌛ Deploying..."
sshpass -e -P "passphrase" scp frontend.zip root@saltyspicer.top://root/webrtc
sshpass -e -P "passphrase" ssh root@saltyspicer.top unzip -o /root/webrtc/frontend.zip -d /root/webrtc/ 

rm frontend.zip
unset SSHPASS

echo "✅ Done"