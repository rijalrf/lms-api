import { Prisma } from '../../prisma/generated-client/client';

export const MATERIAL_POPULARS_SQL = Prisma.sql`
      SELECT m.title, m.description, COUNT(a.id) as countAssignment
      FROM Materials m
      JOIN Assignments a ON m.id = a.materialId
      WHERE a.status = 'FINISH'
      GROUP BY m.id
      ORDER BY countAssignment DESC
      LIMIT 3
`;

export type MaterialPopularSQLResult = {
  title: string;
  description: string;
  countAssignment: bigint;
};
