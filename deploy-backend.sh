#!/bin/bash
set -e

read -s -p "Enter passphrase for key '$HOME/.ssh/id_rsa': " sshPass  
echo ""
export SSHPASS=$sshPass

echo "๐งน Cleanup..."
sshpass -e -P "passphrase" ssh root@saltyspicer.top rm -rf /root/webrtc/backend/*

echo "โ Deploying..."
sshpass -e -P "passphrase" scp backend.zip root@saltyspicer.top://root/webrtc
sshpass -e -P "passphrase" ssh root@saltyspicer.top<unpack-and-run-backend.sh

rm backend.zip
unset SSHPASS

echo "โ Done"