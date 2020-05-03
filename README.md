# [ Lamwong | MPC ]
สถานะฟังเพลง และ ดูวีดีโอในแอป Media Player Classic ทั้งรุ่น Home Cinema และ Black Edition

Lamwong ได้แก้ไขมาจาก MPC-DiscordRPC ของคุณ angeloanan | Original Link: [ [Link](https://github.com/angeloanan/MPC-DiscordRPC) ]
![Picture Example](https://i.imgur.com/ADNnAcK.png)

## การทำงานของ Lamwong
Lamwong | MPC ได้ดึงข้อมูลการเล่นจากเว็บอินเตอร์เฟสจาก MPC-HC / MPC-BE และ แสดงในโปรไฟล์ Discord ของคุณผ่าน Rich Presence API.

ปล. Lamwong | MPC สามารถทำงานได้ในแอป Discord เท่านั้น ไม่สามารถทำงานบนเว็บ Discord ได้.

## วิธีติดตั้ง และ ใช้งาน
1. เมื่อคุณเปิดโปรแกรม Media Player Classic เข้าไปที่ `มุมมอง > ตัวเลือก > เครื่องเล่น > ส่วนประสานเว็บ [ View > Options > Player > Web Interface ]` และ ทำการเปิด `ฟังบนพอร์ต: [Listen on port:]` ค่าเริ่มต้นคือ `13579` แต่ถ้าคุณอยากจะเปลี่ยนตัวเลข คุณจะต้องเปลี่ยนทั้ง แอป และ ไฟล์ `config.js` | ถ้าคุณตั้งไว้อยู่แล้ว สามารถข้ามขั้นตอนนี้ได้เลย.
![Enable the option "Listen on port"](https://cdn.discordapp.com/attachments/416273308540207116/428748994307424256/unknown.png)
![In File config.js](https://cdn.discordapp.com/attachments/576044495125348382/706386019871752192/unknown.png)

2. ติดตั้ง [Node.js](https://nodejs.org/) ถ้าติดตั้งแล้ว สามารถข้ามขั้นตอนนี้ได้เลย.

3. ดาวน์โหลด **Lamwong | MPC** จาก[ลิ้ง](https://github.com/Anouwong/lamwong-mpc/archive/master.zip) ไฟล์จะเป็น `.zip` ถ้าคุณใช้เป็นคำสั่งให้พิมพ์ได้ตามด้านล่าง จำเป็นต้องมีแอป [Git](https://git-scm.com/) ถ้าอยากจะใช้แบบคำสั่ง.
```sh
git clone https://github.com/Anouwong/lamwong-mpc.git && cd lamwong-mpc
```

4. ทำการติดตั้งโมดูลของ Lamwong | MPC โดยการพิมพ์ `npm i`.

5. ดับเบิ้ลคลิกที่ไฟล์ `start.bat` สำหรับ Windows | สำหรับคำสั่งพิมพ์ `npm start` หรือ `node index.js`.

> ปล. สำหรับคำสั่ง `npm start` จำเป็นต้องมีโมดูล `pm2` สามารถใช้ได้โดยการติดตั้ง `npm install -g pm2` เมื่อใช้คำสั่งนี้แล้วการทำงานจะอยู่เบื้องหลัง โดยที่ไม่จำเป็นต้องเปิดหน้าต่างคำสั่งค้างไว้ เหมือนกับคำสั่ง `node index.js`.

เมื่อคุณได้ใช้คำสั่ง `npm start` แล้วต้องการที่จะปิดการทำงาน สามารถทำได้ โดยการสั่ง `npm stop`.

## วิธีอัปเดต
1. นำทางไปยังเส้นทางไฟล์ที่คุณโคลน / ดาวน์โหลดโปรเจคนี้ และ เปิดหน้าต่างคำสั่งให้เส้นทางตรงกับตัวแอป.
2. ปิดการทำงานของโปรแกรมโดยการพิมพ์ `npm stop`.
3. [ดาวน์โหลดไฟล์นี้](https://github.com/Anouwong/lamwong-mpc/archive/master.zip) และ วางทับไฟล์เก่า.
  หรือว่า ถ้าคุณได้ติดตั้ง Git แล้วคุณสามารถพิมพ์คำสั่งนี้ เพื่ออัปเดตไฟล์.
```sh
git pull
```
4. ดับเบิ้ลคลิกที่ไฟล์ `start.bat` สำหรับ Windows | สำหรับคำสั่งพิมพ์ `npm start` หรือ `node index.js`.
จากนั้นก็ปิดหน้าต่างคำสั่งได้เลย ^^.

## ส่วนการตั้งค่าในไฟล์ `config.js`
