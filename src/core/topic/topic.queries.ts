import { Prisma } from '../../prisma/generated-client/client.js';

export const TOPIC_POPULARS_SQL = Prisma.sql`
    SELECT t.title, t.description, COUNT(a.id) as countAssignment
    FROM Topics t
    INNER JOIN Assignments a ON t.id = a.topicId    
    WHERE a.status = 'FINISH'    
    GROUP BY t.id
    ORDER BY countAssignment DESC
    LIMIT 3
`;

export type TopicPopularSQLResult = {
  title: string;
  description: string;
  countAssignment: bigint;
};
