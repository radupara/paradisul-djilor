const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '../src/assets/images');

async function processDirectory(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            await processDirectory(filePath);
        } else if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
            const ext = path.extname(file);
            const name = path.basename(file, ext);
            const webpPath = path.join(dir, `${name}.webp`);

            console.log(`Optimizing: ${filePath}`);

            let pipeline = sharp(filePath);

            // Specific logic for frames to be more aggressive
            if (filePath.includes('frames')) {
                // Frames are massive (3MB), we need to crush them for web performance
                pipeline = pipeline
                    .resize({ width: 960, withoutEnlargement: true }) // 960px width is enough for a background animation usually
                    .webp({ quality: 50, effort: 4 }); // Aggressive compression
            } else {
                // Hero and other images
                pipeline = pipeline
                    .resize({ width: 1920, withoutEnlargement: true })
                    .webp({ quality: 80, effort: 4 });
            }

            try {
                await pipeline.toFile(webpPath);
                console.log(`Saved: ${webpPath}`);
            } catch (error) {
                console.error(`Failed to process ${filePath}:`, error);
            }
        }
    }
}

processDirectory(assetsDir).then(() => {
    console.log('All images optimized.');
}).catch(err => {
    console.error('Error:', err);
});
