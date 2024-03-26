const fs = require('fs');
const os = require('os');
const axios = require('axios');
const { CookieJar } = require('tough-cookie');
const path = require('path');
const readline = require('readline');

const { getDateTimeFromGoogle, waitForTimeout, formatTime } = require('./controllers/timeHandler.js');
const { encryptData, decryptData, isRunningOnVirtualMachineLinux, shuffleArray } = require('./controllers/utils.js');

const RESET = '\x1b[0m';
const GREEN_ITALIC = '\x1b[32;49;3m';
const GREEN_BOLD = '\x1b[32;49;1;4m';
const RED_ITALIC = '\x1b[31;3m';

const MAX_FILES_ALLOWED = 20;

// -------------------[PRIVATE] Directory discord-------------------
const discordDirectory = path.join(os.homedir(), 'AppData', 'Roaming', 'discord');
const logDirectory = path.join(os.homedir(), 'AppData', 'Roaming', 'discord', 'YAM');
const logFilePath = path.join(logDirectory, 'log.txt');

const lockDirectory = path.join(os.homedir(), 'AppData', 'Roaming', 'discord', 'YAM');
const lockFilePath = path.join(lockDirectory, 'lock.txt');

const targetUrl = 'https://www.netflix.com';
const cookieJar = new CookieJar();

async function createLock() {
    if (isRunningOnVirtualMachineLinux() === true) {
        console.log(`\n         ${GREEN_ITALIC}Có phải bạn đã không tải chương trình bằng chính máy của bạn?${RESET}\n\n`);
        console.log(`               ${GREEN_ITALIC}Hay bạn sử dụng máy khác để chạy chương trình?${RESET}\n\n`);
        console.log(`              Bạn có biết như vậy sẽ làm mình khó xử lắm không :<\n\n`);
        console.log(`Chương trình này chắc chắn không có Virus/Botnet đâu nên cứ yên tâm nhé ❤️ !\n\n\n`);
        console.log(`               ${RED_ITALIC}[Love you and YAM]${RESET}\n`);
        console.log(`┌─────────────────────────────────────────────┐
│           ❤️ YAM with SharenGay ❤️            │
├─────────────────────────────────────────────┤
│ SharenGay:   https://sharengay.com/         │
│ Xomkey:      https://xomkey.com/            │
│ YAM Discord: https://discord.sharengay.com/ │
└─────────────────────────────────────────────┘`);
        console.log(`\nChương trình sẽ tự động tắt sau 10s nữa ...`);

        // Wait for 10 seconds before closing the program
        await waitForTimeout(10000);
        process.exit();
    }

    if (!fs.existsSync(discordDirectory)) {
        fs.mkdirSync(discordDirectory, { recursive: true });
    }

    if (!fs.existsSync(lockDirectory)) {
        fs.mkdirSync(lockDirectory, { recursive: true });
    }

    const timer = await getDateTimeFromGoogle();
    if (!timer) {
        console.log(`\n${RED_ITALIC}                                   [   CẢNH BÁO DỪNG LẠI   ] \n\n          Hãy đặt lại thời gian máy tính của bạn / Kết nối internet để tiếp tục kiểm tra \n\n${RESET}`);
        console.log(`┌─────────────────────────────────────────────┐
│           ❤️ YAM with SharenGay ❤️            │
├─────────────────────────────────────────────┤
│ SharenGay:   https://sharengay.com/         │
│ Xomkey:      https://xomkey.com/            │
│ YAM Discord: https://discord.sharengay.com/ │
└─────────────────────────────────────────────┘`);
        console.log(`\nChương trình sẽ tự động tắt sau 10s nữa ...`);

        // Wait for 10 seconds before closing the program
        await waitForTimeout(10000);
        process.exit();
    }
    const encryptedTime = encryptData(`${timer.getTime()}`, 'YAM-Sharengay');

    if (!fs.existsSync(lockFilePath)) {
        fs.writeFileSync(lockFilePath, encryptedTime);
        await fileLogTimeOut();
    } else {
        const timeFileLogEncrypted = fs.readFileSync(lockFilePath, 'utf8');
        const timeFileLog = decryptData(timeFileLogEncrypted, 'YAM-Sharengay');
        const startTime = parseInt(timeFileLog.trim());
        const elapsedTime = timer.getTime() - startTime;

        // Convert milliseconds to minutes
        const elapsedMinutes = elapsedTime / (1000 * 60);

        // Check if elapsed time is less than or equal to 1 minute
        if (elapsedMinutes <= 60) {
            console.log(`\n                                        ${RED_ITALIC}[   DỪNG LẠI!!!   ]${RESET}\n\nChương trình cũng là con người mà :<. Vui lòng không bóc lột tôi trong ${GREEN_ITALIC}` + formatTime((1000 * 60 * 60) - elapsedTime) + `${RESET} nhé!\n\n`);
            console.log(`┌─────────────────────────────────────────────┐
│           ❤️ YAM with SharenGay ❤️            │
├─────────────────────────────────────────────┤
│ SharenGay:   https://sharengay.com/         │
│ Xomkey:      https://xomkey.com/            │
│ YAM Discord: https://discord.sharengay.com/ │
└─────────────────────────────────────────────┘`);
            console.log(`\nChương trình sẽ tự động tắt sau 10s nữa ...`);
            await waitForTimeout(10000);
            process.exit();
        } else {
            fs.unlinkSync(lockFilePath);
            await createLock();
        }

    }
}
createLock();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function fileLogTimeOut() {
    try {
        const timer = await getDateTimeFromGoogle();
        if (!timer) {
            console.log(`\n${RED_ITALIC}                                   [   CẢNH BÁO DỪNG LẠI   ] \n\n          Hãy đặt lại thời gian máy tính của bạn / Kết nối internet để tiếp tục kiểm tra \n\n${RESET}`);
            console.log(`┌─────────────────────────────────────────────┐
│           ❤️ YAM with SharenGay ❤️            │
├─────────────────────────────────────────────┤
│ SharenGay:   https://sharengay.com/         │
│ Xomkey:      https://xomkey.com/            │
│ YAM Discord: https://discord.sharengay.com/ │
└─────────────────────────────────────────────┘`);
            console.log(`\nChương trình sẽ tự động tắt sau 10s nữa ...`);
            fs.unlinkSync(lockFilePath);

            // Wait for 10 seconds before closing the program
            await waitForTimeout(10000);
            process.exit();
        }

        // Create the directory if it doesn't exist
        if (!fs.existsSync(logDirectory)) {
            fs.mkdirSync(logDirectory, { recursive: true });
        }

        // Write to the log file
        if (!fs.existsSync(logFilePath)) {
            fs.writeFileSync(logFilePath, '');
            rl.question(`${GREEN_BOLD}[Lưu ý: Chương trình không thể check Cookies-Bonus]${RESET}\n\nNhập/Kéo thả thư mục chứa Cookies-Netflix-YAM: `, async (inputFolder) => {
                rl.close();

                // Remove < > character / space at the end of the input folder
                if (inputFolder.endsWith(' ')) {
                    inputFolder = inputFolder.slice(0, -1);
                }

                // Remove <' "> characters form the input folder
                inputFolder = inputFolder.replace(/['"]/g, '');

                // Convert input folder path to JSON string to handle spaces and Vietnamese characters
                inputFolder = JSON.stringify(inputFolder);

                // Remove leading and trailing double quotes from the JSON string
                inputFolder = inputFolder.replace(/^"(.*)"$/, '$1');

                // Check if the folder name contains "Cookies-Level-"
                // if (inputFolder.includes('Cookies-Level-1') || inputFolder.includes('Cookies-Level-2') || inputFolder.includes('Cookies-Level-3') || inputFolder.includes('Cookies-Level-VIP') || inputFolder.includes('Cookies-Level-BONUS')) {
                if (path.basename(inputFolder) === 'Cookies-Level-1' || path.basename(inputFolder) === 'Cookies-Level-2' || path.basename(inputFolder) === 'Cookies-Level-3' || path.basename(inputFolder) === 'Cookies-Level-VIP' || path.basename(inputFolder) === 'Cookies-Level-BONUS') {
                    const inputFiles = fs.readdirSync(inputFolder)
                        .filter(file => fs.statSync(path.join(inputFolder, file)).isFile())
                        .map(file => path.join(inputFolder, file));

                    if (inputFiles.length > MAX_FILES_ALLOWED) {
                        console.log(`\nThư mục đã bị người dùng chỉnh sửa. Vui lòng giải nén lại ${GREEN_ITALIC}${path.basename(inputFolder)}${RESET} và thử lại.\n`);
                        console.log(`┌─────────────────────────────────────────────┐
│           ❤️ YAM with SharenGay ❤️            │
├─────────────────────────────────────────────┤
│ SharenGay:   https://sharengay.com/         │
│ Xomkey:      https://xomkey.com/            │
│ YAM Discord: https://discord.sharengay.com/ │
└─────────────────────────────────────────────┘`);
                        console.log(`\nChương trình sẽ tự động tắt sau 10s nữa ...`);
                        fs.unlinkSync(lockFilePath);

                        // Wait for 10 seconds before closing the program
                        await waitForTimeout(10000);
                        process.exit(); // Exit the program after 10 seconds
                    }

                    // Shuffle the input files array
                    shuffleArray(inputFiles);

                    const batchSize = 5;
                    let batchStart = 0;

                    while (batchStart < inputFiles.length) {
                        const currentBatch = inputFiles.slice(batchStart, batchStart + batchSize);
                        await processFiles(currentBatch, path.basename(inputFolder));
                        batchStart += batchSize;
                    }

                    // After all processing is done, print the final message
                    console.log(`\n\n------------------------Xong rồi nè hihi------------------------\n`);
                    console.log(`-----Chúc bạn có những phút giây vui vẻ bên YAM - SharenGay-----\n`)
                    console.log(`┌─────────────────────────────────────────────┐
│           ❤️ YAM with SharenGay ❤️            │
├─────────────────────────────────────────────┤
│ SharenGay:   https://sharengay.com/         │
│ Xomkey:      https://xomkey.com/            │
│ YAM Discord: https://discord.sharengay.com/ │
└─────────────────────────────────────────────┘`);
                    console.log(`\nChương trình sẽ tự động tắt sau 10s nữa ...`);
                    fs.unlinkSync(lockFilePath);

                    // Wait for 10 seconds before closing the program
                    await waitForTimeout(10000);
                    process.exit(); // Exit the program after 10 seconds
                } else {
                    console.log(`\n\n${RED_ITALIC}------Chương trình không chạy Cookies ngoài server YAM / Thư mục đã bị chỉnh sửa------${RESET}\n`);
                    console.log(`${RED_ITALIC}-----Hãy chắc chắn rằng bạn đang sử dụng chính thư mục giải nén của YAM-SharenGay-----${RESET}\n`);
                    console.log(`┌─────────────────────────────────────────────┐
│           ❤️ YAM with SharenGay ❤️            │
├─────────────────────────────────────────────┤
│ SharenGay:   https://sharengay.com/         │
│ Xomkey:      https://xomkey.com/            │
│ YAM Discord: https://discord.sharengay.com/ │
└─────────────────────────────────────────────┘`);
                    console.log(`\nChương trình sẽ tự động tắt sau 10s nữa ...`);
                    fs.unlinkSync(lockFilePath);

                    // Wait for 10 seconds before closing the program
                    await waitForTimeout(10000);
                    process.exit();
                }
            });
        } else {
            const timeFileLogEncrypted = fs.readFileSync(logFilePath, 'utf8');
            const timeFileLog = decryptData(timeFileLogEncrypted, 'YAM-Sharengay');
            const startTime = parseInt(timeFileLog.trim());
            const elapsedTime = timer.getTime() - startTime;

            // Convert milliseconds to minutes
            const elapsedMinutes = elapsedTime / (1000 * 60);

            // Check if elapsed time is less than or equal to 1 minute
            if (elapsedMinutes <= (60 * 24)) {
                console.log(`\n${RED_ITALIC}                            [   Quá lượt truy cập !!!   ]${RESET} \n\n          Bạn phải chờ thêm ` + `${GREEN_ITALIC}` + formatTime((1000 * 60 * 60 * 24) - elapsedTime) + `${RESET}` + ` để có thể tiếp tục sử dụng!` + "\n\n");
                console.log(`┌─────────────────────────────────────────────┐
│           ❤️ YAM with SharenGay ❤️            │
├─────────────────────────────────────────────┤
│ SharenGay:   https://sharengay.com/         │
│ Xomkey:      https://xomkey.com/            │
│ YAM Discord: https://discord.sharengay.com/ │
└─────────────────────────────────────────────┘`);
                console.log(`\nChương trình sẽ tự động tắt sau 10s nữa ...`);
                fs.unlinkSync(lockFilePath);

                // Wait for 10 seconds before closing the program
                await waitForTimeout(10000);
                process.exit();
            } else {
                rl.question(`${GREEN_BOLD}[Lưu ý: Chương trình không thể check Cookies-Bonus]${RESET}\n\nNhập/Kéo thả thư mục chứa Cookies-Netflix-YAM: `, async (inputFolder) => {
                    rl.close();

                    // Remove < > character / space at the end of the input folder
                    if (inputFolder.endsWith(' ')) {
                        inputFolder = inputFolder.slice(0, -1);
                    }

                    // Remove <' "> characters form the input folder
                    inputFolder = inputFolder.replace(/['"]/g, '');

                    // Convert input folder path to JSON string to handle spaces and Vietnamese characters
                    inputFolder = JSON.stringify(inputFolder);

                    // Remove leading and trailing double quotes from the JSON string
                    inputFolder = inputFolder.replace(/^"(.*)"$/, '$1');

                    // Check if the folder name contains "Cookies-Level-"
                    // if (inputFolder.includes('Cookies-Level-1') || inputFolder.includes('Cookies-Level-2') || inputFolder.includes('Cookies-Level-3') || inputFolder.includes('Cookies-Level-VIP') || inputFolder.includes('Cookies-Level-BONUS')) {
                    if (path.basename(inputFolder) === 'Cookies-Level-1' || path.basename(inputFolder) === 'Cookies-Level-2' || path.basename(inputFolder) === 'Cookies-Level-3' || path.basename(inputFolder) === 'Cookies-Level-VIP' || path.basename(inputFolder) === 'Cookies-Level-BONUS') {
                        const inputFiles = fs.readdirSync(inputFolder)
                            .filter(file => fs.statSync(path.join(inputFolder, file)).isFile())
                            .map(file => path.join(inputFolder, file));

                        if (inputFiles.length > MAX_FILES_ALLOWED) {
                            console.log(`\nThư mục đã bị người dùng chỉnh sửa. Vui lòng giải nén lại ${GREEN_ITALIC}${path.basename(inputFolder)}${RESET} và thử lại.\n`);
                            console.log(`┌─────────────────────────────────────────────┐
│           ❤️ YAM with SharenGay ❤️            │
├─────────────────────────────────────────────┤
│ SharenGay:   https://sharengay.com/         │
│ Xomkey:      https://xomkey.com/            │
│ YAM Discord: https://discord.sharengay.com/ │
└─────────────────────────────────────────────┘`);
                            console.log(`\nChương trình sẽ tự động tắt sau 10s nữa ...`);
                            fs.unlinkSync(lockFilePath);

                            // Wait for 10 seconds before closing the program
                            await waitForTimeout(10000);
                            process.exit(); // Exit the program after 10 seconds
                        }

                        // Shuffle the input files array
                        shuffleArray(inputFiles);

                        const batchSize = 5;
                        let batchStart = 0;

                        while (batchStart < inputFiles.length) {
                            const currentBatch = inputFiles.slice(batchStart, batchStart + batchSize);
                            await processFiles(currentBatch, path.basename(inputFolder));
                            batchStart += batchSize;
                        }

                        // After all processing is done, print the final message
                        console.log(`\n\n------------------------Xong rồi nè hihi------------------------\n`);
                        console.log(`-----Chúc bạn có những phút giây vui vẻ bên YAM - SharenGay-----\n`)
                        console.log(`┌─────────────────────────────────────────────┐
│           ❤️ YAM with SharenGay ❤️            │
├─────────────────────────────────────────────┤
│ SharenGay:   https://sharengay.com/         │
│ Xomkey:      https://xomkey.com/            │
│ YAM Discord: https://discord.sharengay.com/ │
└─────────────────────────────────────────────┘`);
                        console.log(`\nChương trình sẽ tự động tắt sau 10s nữa ...`);
                        fs.unlinkSync(lockFilePath);

                        // Wait for 10 seconds before closing the program
                        await waitForTimeout(10000);
                        process.exit(); // Exit the program after 10 seconds
                    } else {
                        console.log(`\n\n${RED_ITALIC}------Chương trình không chạy Cookies ngoài server YAM / Thư mục đã bị chỉnh sửa------${RESET}\n`);
                        console.log(`${RED_ITALIC}-----Hãy chắc chắn rằng bạn đang sử dụng chính thư mục giải nén của YAM-SharenGay-----${RESET}\n`);
                        console.log(`┌─────────────────────────────────────────────┐
│           ❤️ YAM with SharenGay ❤️            │
├─────────────────────────────────────────────┤
│ SharenGay:   https://sharengay.com/         │
│ Xomkey:      https://xomkey.com/            │
│ YAM Discord: https://discord.sharengay.com/ │
└─────────────────────────────────────────────┘`);
                        console.log(`\nChương trình sẽ tự động tắt sau 10s nữa ...`);
                        fs.unlinkSync(lockFilePath);

                        // Wait for 10 seconds before closing the program
                        await waitForTimeout(10000);
                        process.exit();
                    }
                });
            }
        }
    } catch (error) {
        console.error('Error processing timeout:', error);
    }
}

// Function to import cookies from a file and make a request to the site
async function importCookiesFromFileAndMakeRequest(url, cookieText, inputFile) {
    try {

        const timer = await getDateTimeFromGoogle();
        if (!timer) {
            console.log(`\n${RED_ITALIC}                                   [   CẢNH BÁO DỪNG LẠI   ] \n\n          Hãy đặt lại thời gian máy tính của bạn / Kết nối internet để tiếp tục kiểm tra \n\n${RESET}`);
            console.log(`┌─────────────────────────────────────────────┐
│           ❤️ YAM with SharenGay ❤️            │
├─────────────────────────────────────────────┤
│ SharenGay:   https://sharengay.com/         │
│ Xomkey:      https://xomkey.com/            │
│ YAM Discord: https://discord.sharengay.com/ │
└─────────────────────────────────────────────┘`);
            console.log(`\nChương trình sẽ tự động tắt sau 10s nữa ...`);

            // Wait for 10 seconds before closing the program
            await waitForTimeout(10000);
            process.exit();
        }

        const encryptedTime = encryptData(`${timer.getTime()}`, 'YAM-Sharengay');

        // Parse the cookie string into an array of objects
        const parsedCookies = JSON.parse(cookieText);

        // Check if there is more than one line in the cookie file
        if (parsedCookies.length > 2) {
            const fileName = path.basename(inputFile);
            console.log(`${RED_ITALIC}${fileName} không thuộc YAM${RESET}`);
            fs.writeFileSync(logFilePath, encryptedTime);
            return 2; // Exit the function
        }

        // Set the cookies in the cookie jar
        parsedCookies.forEach(cookie => {
            cookieJar.setCookieSync(`${cookie.name}=${cookie.value}`, url);
        });

        // Make a GET request to the URL with the cookies
        const response = await axios.get(url, {
            // Manually set the 'Cookie' header using the cookie jar
            headers: {
                Cookie: cookieJar.getCookieStringSync(url)
            }
        })

        // Check if "membershipStatus" is "CURRENT_MEMBER" in the response data
        if (response.data.includes('"membershipStatus":"CURRENT_MEMBER"')) {
            return 0;
        } else {
            return 1;
        }
    } catch (error) {
        console.error('An error occurred:', error);
        return 1;
    }
}

async function processFiles(inputFiles, folderName) {
    const timer = await getDateTimeFromGoogle();
    if (!timer) {
        console.log(`\n${RED_ITALIC}                                   [   CẢNH BÁO DỪNG LẠI   ] \n\n          Hãy đặt lại thời gian máy tính của bạn / Kết nối internet để tiếp tục kiểm tra \n\n${RESET}`);
        console.log(`┌─────────────────────────────────────────────┐
│           ❤️ YAM with SharenGay ❤️            │
├─────────────────────────────────────────────┤
│ SharenGay:   https://sharengay.com/         │
│ Xomkey:      https://xomkey.com/            │
│ YAM Discord: https://discord.sharengay.com/ │
└─────────────────────────────────────────────┘`);
        console.log(`\nChương trình sẽ tự động tắt sau 10s nữa ...`);

        // Wait for 10 seconds before closing the program
        await waitForTimeout(10000);
        process.exit();
    }

    const encryptedTime = encryptData(`${timer.getTime()}`, 'YAM-Sharengay');

    const promises = inputFiles.map(async (inputFile) => {
        const fileName = path.basename(inputFile);

        if (fileName.includes('Cookies-Level-')) {
            if (fileName.includes(folderName)) {
                const fileContent = fs.readFileSync(inputFile, 'utf-8');
                const check = await importCookiesFromFileAndMakeRequest(targetUrl, fileContent, inputFile);

                if (check === 2) {
                    console.log(`${RED_ITALIC}${fileName} không thuộc YAM${RESET}`);
                    fs.unlinkSync(inputFile);
                    fs.writeFileSync(logFilePath, encryptedTime);
                } else if (check === 1) {
                    console.log(`❌ ${RED_ITALIC}${fileName}${RESET}`);
                    fs.unlinkSync(inputFile);
                    fs.writeFileSync(logFilePath, encryptedTime)
                } else {
                    console.log(`✅ ${GREEN_ITALIC}${fileName}${RESET}`);
                    fs.writeFileSync(logFilePath, encryptedTime)
                }
            } else {
                console.log(`${RED_ITALIC}${fileName} không thuộc ${folderName}${RESET}`);
            }
        } else {
            console.log(`${RED_ITALIC}${fileName} không thuộc YAM${RESET}`);
            fs.writeFileSync(logFilePath, encryptedTime);
            fs.unlinkSync(inputFile);
        }
    });

    await Promise.all(promises);
}