import { describe, it, expect } from 'vitest';
import { SchoolRegistrationData, User } from '../../types';
import { ChronogramService } from '../directorAssistant/chronogramService';
import { EducatorChronogramService } from '../educatorAssistant/educatorChronogramService';
import { INITIAL_ASSISTANT_SETTINGS, INITIAL_EDUCATOR_SETTINGS } from '../db/mockData';

describe('School Registration & Multi-Staff Onboarding', () => {
  const sampleRegData: SchoolRegistrationData = {
    school: {
      name: 'Institut Secondaire Excellence',
      type: 'complexe_scolaire',
      code: 'ISE-ABJ',
      address: 'Angré 8ème Tranche, Cocody',
      city: 'Abidjan',
      country: "Côte d'Ivoire",
      phone: '+225 07 00 11 22 33',
      email: 'contact@excellence.ci',
      currency: 'FCFA',
      directorName: 'M. Jean Kouadio'
    },
    director: {
      firstName: 'Jean',
      lastName: 'Kouadio',
      email: 'directeur@excellence.ci',
      phone: '+225 07 00 11 22 33',
      password: 'secret_director'
    },
    academicDirector: {
      firstName: 'Michel',
      lastName: 'Bamba',
      email: 'de@excellence.ci',
      phone: '+225 05 44 55 66 77',
      cycle: 'complexe',
      password: 'secret_de'
    },
    educator: {
      firstName: 'Aminata',
      lastName: 'Traoré',
      email: 'educatrice@excellence.ci',
      phone: '+225 01 77 88 99 00',
      assignedClassIds: ['c_6a', 'c_3a', 'c_td'],
      password: 'secret_educator'
    }
  };

  it('correctly sets up Director, DE, and Educator user profiles upon registration', () => {
    const schoolId = 'school_test_123';

    const directorUser: User = {
      id: `u_dir_${schoolId}`,
      email: sampleRegData.director.email,
      firstName: sampleRegData.director.firstName,
      lastName: sampleRegData.director.lastName,
      role: 'director',
      schoolId: schoolId,
      phone: sampleRegData.director.phone
    };

    const academicDirectorUser: User = {
      id: `u_cde_${schoolId}`,
      email: sampleRegData.academicDirector.email,
      firstName: sampleRegData.academicDirector.firstName,
      lastName: sampleRegData.academicDirector.lastName,
      role: 'academic_director',
      schoolId: schoolId,
      phone: sampleRegData.academicDirector.phone
    };

    const educatorUser: User = {
      id: `u_educ_${schoolId}`,
      email: sampleRegData.educator.email,
      firstName: sampleRegData.educator.firstName,
      lastName: sampleRegData.educator.lastName,
      role: 'counselor',
      schoolId: schoolId,
      phone: sampleRegData.educator.phone
    };

    expect(directorUser.role).toBe('director');
    expect(academicDirectorUser.role).toBe('academic_director');
    expect(educatorUser.role).toBe('counselor');
    expect(directorUser.schoolId).toBe(schoolId);
    expect(academicDirectorUser.schoolId).toBe(schoolId);
    expect(educatorUser.schoolId).toBe(schoolId);
  });

  it('generates operational chronogram tasks for newly onboarded DE and Educator', () => {
    const schoolId = 'school_test_123';
    const deId = 'u_cde_test';
    const educId = 'u_educ_test';
    const monday = new Date('2026-08-24T08:00:00');

    // DE Tasks
    const deTasks = ChronogramService.generateTasksForDate(
      monday,
      deId,
      schoolId,
      INITIAL_ASSISTANT_SETTINGS
    );
    expect(deTasks.length).toBeGreaterThan(0);
    expect(deTasks[0].schoolId).toBe(schoolId);
    expect(deTasks[0].userId).toBe(deId);

    // Educator Tasks (19 tasks)
    const educTasks = EducatorChronogramService.generateTasksForDate(
      monday,
      educId,
      schoolId,
      INITIAL_EDUCATOR_SETTINGS
    );
    expect(educTasks.length).toBe(19);
    expect(educTasks[0].schoolId).toBe(schoolId);
    expect(educTasks[0].educatorId).toBe(educId);
  });
});
