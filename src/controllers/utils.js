
const { execSync } = require('child_process');
const CryptoJS = require('crypto-js');

// Function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function isRunningOnVirtualMachine() {
    try {
        // Kiểm tra xem có tồn tại các khóa Registry liên quan đến máy ảo không
        const output = execSync('wmic computersystem get manufacturer');
        const manufacturer = output.toString().toLowerCase();

        // Kiểm tra xem chuỗi kết quả có chứa các từ khóa thông thường liên quan đến máy ảo không
        if (manufacturer.includes('vmware') || 
            manufacturer.includes('virtual') || 
            manufacturer.includes('xen') || 
            manufacturer.includes('kvm') ||
            manufacturer.includes('qemu') ||
            manufacturer.includes('hyper-v') ||
            manufacturer.includes('parallels desktop') ||
            manufacturer.includes('bitbox') ||
            manufacturer.includes('sandboxie') ||
            manufacturer.includes('toolwiz time freeze') ||
            manufacturer.includes('deep freeze') ||
            manufacturer.includes('shadow defender') ||
            manufacturer.includes('cameyo') ||
            manufacturer.includes('bufferzone') ||
            manufacturer.includes('shade sandbox')) {
            return true;
        }

        return false;
    } catch (error) {
        console.error('Error occurred while checking virtual machine:', error);
        return false;
    }
}

function isRunningOnVirtualMachineLinux() {
    try {
        // Kiểm tra thông tin về nhà sản xuất CPU để phát hiện máy ảo
        const output = execSync('lscpu');
        const cpuInfo = output.toString().toLowerCase();

        // Kiểm tra xem chuỗi kết quả có chứa các từ khóa thông thường liên quan đến máy ảo không
        if (cpuInfo.includes('hypervisor') || 
            cpuInfo.includes('kvm') ||
            cpuInfo.includes('vmware') || 
            cpuInfo.includes('virtualbox') ||
            cpuInfo.includes('xen') ||
            cpuInfo.includes('qemu') ||
            cpuInfo.includes('microsoft')) {
            return true;
        }

        return false;
    } catch (error) {
        console.error('Error occurred while checking virtual machine:', error);
        return false;
    }
}

function isRunningOnVirtualMachineMacOS() {
    try {
        // Kiểm tra thông tin hệ thống để phát hiện máy ảo
        const output = execSync('sysctl -n machdep.cpu.features');
        const cpuFeatures = output.toString().toLowerCase();

        // Kiểm tra xem chuỗi kết quả có chứa các từ khóa thông thường liên quan đến máy ảo không
        if (cpuFeatures.includes('hypervisor') || 
            cpuFeatures.includes('virtual') ||
            cpuFeatures.includes('vmware') || 
            cpuFeatures.includes('virtualbox') ||
            cpuFeatures.includes('parallels') ||
            cpuFeatures.includes('xen') ||
            cpuFeatures.includes('qemu')) {
            return true;
        }

        return false;
    } catch (error) {
        console.error('Error occurred while checking virtual machine:', error);
        return false;
    }
}

// Encode with AES;
function encryptData(data, password) {
    return CryptoJS.AES.encrypt(data, password).toString();
}

// Decode with AES;
function decryptData(encryptedData, password) {
    const bytes = CryptoJS.AES.decrypt(encryptedData, password);
    return bytes.toString(CryptoJS.enc.Utf8);
}

module.exports = { encryptData, decryptData, isRunningOnVirtualMachine, isRunningOnVirtualMachineLinux, isRunningOnVirtualMachineMacOS, shuffleArray };
