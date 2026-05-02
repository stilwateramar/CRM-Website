import cron from 'node-cron';
import mongoose from 'mongoose';
import { Booking } from '../models/Booking';
import { YogaClass } from '../models/Class';
import { User } from '../models/User';
import { sendWhatsappText } from './whatsappService';

/**
 * Runs every 15 minutes; finds bookings for classes starting in ~24h
 * (between 23h45m and 24h15m from now) whose reminder hasn't been sent.
 */
export function startReminderJobs() {
  cron.schedule('*/15 * * * *', async () => {
    if (mongoose.connection.readyState !== 1) return;
    try {
      const now = Date.now();
      const lower = new Date(now + 23 * 60 * 60 * 1000 + 45 * 60 * 1000);
      const upper = new Date(now + 24 * 60 * 60 * 1000 + 15 * 60 * 1000);

      const classes = await YogaClass.find({
        startTime: { $gte: lower, $lte: upper },
        status: 'scheduled',
      }).select('_id title startTime');

      if (!classes.length) return;

      const classIds = classes.map((c) => c._id);
      const bookings = await Booking.find({
        yogaClass: { $in: classIds },
        reminderSent: { $ne: true },
        status: { $in: ['pending', 'confirmed'] },
      });

      for (const b of bookings) {
        const cls = classes.find((c) => c._id.equals(b.yogaClass));
        const student = await User.findById(b.student);
        if (!student) continue;
        const time = cls?.startTime.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
        const msg = `Hi ${student.name}! Reminder: your class "${cls?.title}" is at ${time}. See you on the mat!`;
        if (student.phone && student.preferences?.reminderEnabled !== false) {
          try {
            await sendWhatsappText(student.phone, msg);
          } catch (e) {
            console.warn('reminder send failed', e);
          }
        }
        b.reminderSent = true;
        await b.save();
      }
      console.log(`[reminders] processed ${bookings.length} bookings`);
    } catch (err) {
      console.error('reminder job error', err);
    }
  });
  console.log('Reminder jobs scheduled (every 15 min, 24h lookahead)');
}
