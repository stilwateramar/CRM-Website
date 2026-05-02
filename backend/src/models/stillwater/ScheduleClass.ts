import { Schema, model, Document, Types } from 'mongoose';

export type DayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export interface IScheduleClass extends Document {
  _id: Types.ObjectId;
  provider: Types.ObjectId;
  day: DayOfWeek;
  time: string;
  duration: number;
  name: string;
  level: string;
  teacher: string;
  spots: number;
  createdAt: Date;
}

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const scheduleSchema = new Schema<IScheduleClass>(
  {
    provider: { type: Schema.Types.ObjectId, ref: 'SwProvider', required: true, index: true },
    day: { type: String, enum: DAYS, required: true },
    time: { type: String, required: true },
    duration: { type: Number, default: 60 },
    name: { type: String, required: true },
    level: { type: String, default: 'All levels' },
    teacher: { type: String, default: '' },
    spots: { type: Number, default: 14 },
  },
  { timestamps: true }
);

export const ScheduleClass = model<IScheduleClass>('SwScheduleClass', scheduleSchema);
