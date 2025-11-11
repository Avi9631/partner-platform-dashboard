import { z } from 'zod';

const projectsPortfolioSchema = z.object({
  totalExperience: z.string().min(1, 'Experience in years is required'),
  totalProjectsCompleted: z.string().min(1, 'Number of completed projects is required'),
  totalProjectsOngoing: z.string().min(1, 'Number of ongoing projects is required'),
  totalUnitsDelivered: z.string().optional(),
  projectTypes: z.array(z.string()).min(1, 'Select at least one project type'),
  operatingCities: z.array(z.string()).min(1, 'Select at least one operating city'),
  notableProjects: z.array(z.object({
    projectName: z.string().min(2, 'Project name is required'),
    location: z.string().min(2, 'Location is required'),
    projectType: z.string().min(1, 'Project type is required'),
    status: z.enum(['completed', 'ongoing']),
    unitsCount: z.string().optional(),
    completionYear: z.string().optional(),
  })).optional(),
});

export default projectsPortfolioSchema;
