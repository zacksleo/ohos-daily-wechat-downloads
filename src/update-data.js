const fs = require('fs/promises');
const path = require('path');
const getDownloadCount = require('./get-download-count');

async function updateData() {
  try {
    // 获取最新下载量
    const newData = await getDownloadCount();
    
    // 读取现有数据
    const dataPath = path.join(__dirname, '../data/download-counts.json');
    let existingData = [];
    
    try {
      const data = await fs.readFile(dataPath, 'utf8');
      existingData = JSON.parse(data) || [];
    } catch (error) {
      console.error(`Error reading existing data file: ${error.message}`);
    }
    
    // 检查是否已有今天的记录
    const todayIndex = existingData.findIndex(entry => entry.date === newData.date);
    
    if (todayIndex > -1) {
      // 更新今日记录
      existingData[todayIndex] = newData;
    } else {
      // 添加新记录
      existingData.push(newData);
    }
    
    // 写入更新后的数据
    await fs.writeFile(dataPath, JSON.stringify(existingData, null, 2), 'utf8');
    console.log('Data updated successfully');
    return true;
  } catch (error) {
    console.error(`Failed to update data: ${error.message}`);
    return false;
  }
}

// Test the function
if (require.main === module) {
  updateData()
    .then(success => process.exit(success ? 0 : 1))
    .catch(error => {
      console.error(`Script error: ${error.message}`);
      process.exit(1);
    });
}

module.exports = updateData;