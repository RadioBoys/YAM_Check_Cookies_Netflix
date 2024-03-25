
const NodeCache = require('node-cache');
const axios = require('axios');

const RESET = '\x1b[0m';
const RED_ITALIC = '\x1b[31;3m';

const cache = new NodeCache();

async function getDateTimeFromGoogle() {
    let timer = cache.get('timer');
    if (timer === undefined) {
        try {
            const response = await axios.get('https://worldtimeapi.org/api/timezone/Asia/Ho_Chi_Minh');
            timer = new Date(response.data.utc_datetime);
            cache.set('timer', timer, 10); // Lưu thời gian vào cache với thời gian sống là 5 giây
        } catch (error) {
            console.log(`\n${RED_ITALIC}                                   [   CẢNH BÁO DỪNG LẠI   ] \n\n          Hãy đặt lại thời gian máy tính của bạn / Kết nối internet để tiếp tục kiểm tra \n\n${RESET}`);
            console.log(`┌─────────────────────────────────────────────┐
│           ❤️ YAM with SharenGay ❤️          │
├─────────────────────────────────────────────┤
│ SharenGay:   https://sharengay.com/         │
│ Xomkey:      https://xomkey.com/            │
│ YAM Discord: https://discord.sharengay.com/ │
└─────────────────────────────────────────────┘`);
            console.log(`\nChương trình sẽ tự động tắt sau 10s nữa ...`);

            // Wait for 10 seconds before closing the program
            timer = null;
            await waitForTimeout(10000);
            process.exit();
        }
    }
    return timer;
}

function waitForTimeout(timeout) {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}

// Function to wait for a timeout
function formatTime(milliseconds) {
    const hours = Math.floor(milliseconds / 3600000);
    milliseconds %= 3600000;
    const minutes = Math.floor(milliseconds / 60000);
    milliseconds %= 60000;
    const seconds = Math.floor(milliseconds / 1000);
    return `${hours} giờ - ${minutes} phút - ${seconds} giây`;
}

module.exports = { getDateTimeFromGoogle, waitForTimeout, formatTime };
