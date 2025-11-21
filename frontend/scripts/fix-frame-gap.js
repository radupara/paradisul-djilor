const fs = require('fs');
const path = require('path');

const framesDir = path.join(__dirname, '../src/assets/images/frames');

// Configuration
const gapStart = 210; // The last correct frame
const nextAvailableFrame = 222; // The frame after the gap

async function fixGap() {
    const files = fs.readdirSync(framesDir)
        .filter(file => file.startsWith('frame-') && file.endsWith('.webp'));

    // Sort files numerically
    files.sort((a, b) => {
        const numA = parseInt(a.match(/frame-(\d+)\.webp/)[1]);
        const numB = parseInt(b.match(/frame-(\d+)\.webp/)[1]);
        return numA - numB;
    });

    let expectedNum = gapStart + 1;
    let renames = 0;

    for (const file of files) {
        const currentNum = parseInt(file.match(/frame-(\d+)\.webp/)[1]);

        // Skip frames before the gap
        if (currentNum <= gapStart) continue;

        // If we found a frame that is greater than the expected number (which is what happens after the gap)
        // We rename it to the expected number
        if (currentNum >= nextAvailableFrame) {
            const newNumPadded = String(expectedNum).padStart(3, '0');
            const oldPath = path.join(framesDir, file);
            const newPath = path.join(framesDir, `frame-${newNumPadded}.webp`);

            console.log(`Renaming ${file} -> frame-${newNumPadded}.webp`);
            fs.renameSync(oldPath, newPath);
            renames++;
            expectedNum++;
        }
    }

    console.log(`Renamed ${renames} files.`);
    console.log(`New last frame should be: ${expectedNum - 1}`);
}

fixGap().catch(console.error);
