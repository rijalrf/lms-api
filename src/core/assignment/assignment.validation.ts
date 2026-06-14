import z from 'zod';
import { toTimeOnly, toDateOnly } from '../../common/datetime.helper';

const dateOnly = z.preprocess((arg) => {
  if (typeof arg == 'string' || arg instanceof Date) return toDateOnly(arg);
}, z.date());

const timeOnly = z.preprocess((arg) => {
  if (typeof arg == 'string' || arg instanceof Date) return toTimeOnly(arg);
}, z.date());

export class AssignmentValidation {
  static CREATEUPDATE = z.object({
    topicId: z.number().min(1),
    materialId: z.number().min(1),
    userId: z.number().min(1),
    trainingDate: dateOnly,
    startTime: timeOnly,
    endTime: timeOnly,
    maxParticipant: z.number().min(1),
    classRoomLink: z.string().min(1),
    status: z.string().min(1),
  });
}
