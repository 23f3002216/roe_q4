const { chromium } = require('playwright');

async function scrapeAndSum() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const seeds = [27, 28, 29, 30, 31, 32, 33, 34, 35, 36];
  let totalSum = 0;
  
  console.log('Starting DataDash QA automation...');
  
  for (const seed of seeds) {
    try {
      const url = `https://sanand0.github.io/tdsdata/js_table/?seed=${seed}`
      console.log(`Scraping Seed ${seed}...`);
      
      await page.goto(url, { waitUntil: 'networkidle' });
      
      // Extract all numbers from tables
      const numbers = await page.evaluate(() => {
        const tables = document.querySelectorAll('table');
        const allNumbers = [];
        
        tables.forEach(table => {
          const cells = table.querySelectorAll('td, th');
          cells.forEach(cell => {
            const text = cell.textContent.trim();
            // Extract numbers (including decimals and negatives)
            const matches = text.match(/-?\d+\.?\d*/g);
            if (matches) {
              matches.forEach(match => {
                const num = parseFloat(match);
                if (!isNaN(num)) {
                  allNumbers.push(num);
                }
              });
            }
          });
        });
        
        return allNumbers;
      });
      
      const seedSum = numbers.reduce((sum, num) => sum + num, 0);
      totalSum += seedSum;
      
      console.log(`Seed ${seed}: Found ${numbers.length} numbers, sum = ${seedSum}`);
      
    } catch (error) {
      console.error(`Error scraping Seed ${seed}:`, error.message);
    }
  }
  
  await browser.close();
  
  console.log('\n=== FINAL RESULT ===');
  console.log(`Total sum of all numbers across all tables: ${totalSum}`);
  console.log('===================');
  
  return totalSum;
}

scrapeAndSum().catch(console.error);