import { Prisma } from '../../prisma/generated-client/client.js';

export const TOP_TRAINERS_SQL = Prisma.sql`
    SELECT u.id , u.name, u.email, COUNT(a.id) as countAssignment
    FROM Users u
    JOIN Assignments a ON u.id = a.userId
    -- WHERE u.role = 'ADMIN' AND a.status = 'FINISH'
    GROUP BY u.id
    ORDER BY countAssignment DESC
    LIMIT 3
  `;

export type TopTrainerSQLResult = {
  id: number;
  name: string;
  email: string;
  countAssignment: bigint;
};
