const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

const uploadDir = '/app/uploads'; // 设置为绝对路径

// 确保上传目录存在
if (!fs.existsSync(uploadDir)){
	fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, uploadDir); // 使用绝对路径作为文件保存路径
	},
	filename: function (req, file, cb) {
		cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
	}
});

const upload = multer({ storage: storage });

app.post('/v1/upload', upload.single('file'), (req, res) => {
	if (req.file) {
		// 根据你的服务器配置可能需要调整这里的 URL 生成逻辑
		const fullUrl = req.protocol + '://' + req.get('host') + '/uploads/' + req.file.filename;
		res.json({ url: fullUrl });
	} else {
		res.status(400).send('No file uploaded.');
	}
});

// 你可能需要调整这个静态文件服务的路径，确保它指向正确的位置
app.use('/uploads', express.static(uploadDir));

app.listen(3000, () => {
	console.log('Server started on http://localhost:3000');
});
