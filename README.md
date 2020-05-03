# [ Lamwong | MPC ]
สถานะฟังเพลง และ ดูวีดีโอในแอป Media Player Classic ทั้งรุ่น Home Cinema และ Black Edition

Lamwong ได้แก้ไขมาจาก MPC-DiscordRPC ของคุณ angeloanan Original Link: [ [Link](https://github.com/angeloanan/MPC-DiscordRPC) ]
![Picture Example](https://i.imgur.com/ADNnAcK.png)

## การทำงานของ Lamwong
Lamwong | MPC ได้ดึงข้อมูลการเล่นจากเว็บอินเตอร์เฟสจาก MPC-HC / MPC-BE และ แสดงในโปรไฟล์ Discord ของคุณผ่าน Rich Presence API.

ปล. Lamwong | MPC สามารถทำงานได้ในแอป Discord เท่านั้น ไม่สามารถทำงานบนเว็บ Discord ได้.

## วิธีติดตั้ง และ ใช้งาน
1. เมื่อคุณเปิดโปรแกรม Media Player Classic เข้าไปที่ `มุมมอง > ตัวเลือก > เครื่องเล่น > ส่วนประสานเว็บ [ View > Options > Player > Web Interface ]` และ ทำการเปิด `ฟังบนพอร์ต: [Listen on port:]` ค่าเริ่มต้นคือ `13579` แต่ถ้าคุณอยากจะเปลี่ยนตัวเลข คุณจะต้องเปลี่ยนทั้ง แอป และ ไฟล์ `config.js`
![Enable the option "Listen on port"](https://cdn.discordapp.com/attachments/416273308540207116/428748994307424256/unknown.png)
![In File config.js](https://cdn.discordapp.com/attachments/576044495125348382/706386019871752192/unknown.png)
