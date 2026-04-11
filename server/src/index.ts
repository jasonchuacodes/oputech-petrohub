import dotenv from 'dotenv';
dotenv.config();

import cron from 'node-cron';
import { app } from './app';
import { runAutoCheckout } from './jobs/autocheckout.job';

const PORT = process.env.PORT || 8000;

(async () => {
    try {
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);

            const timezone = process.env.TZ ?? 'Asia/Manila';
            cron.schedule('59 23 * * *', runAutoCheckout, {
                timezone,
            });
            console.log(`Auto-checkout cron job scheduled at 11:59 PM (${timezone})`);
        });
    } catch (error) {
        console.error(`Failed to connect to DB`, error);
        process.exit();
    }
})();
