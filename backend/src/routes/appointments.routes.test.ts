import appointmentsRouter from './appointments.routes';

function getRouteHandler(router: any, path: string, method: string) {
  const layer = router.stack.find(
    (l: any) => l.route && l.route.path === path && l.route.methods[method]
  );
  return layer?.route?.stack[0]?.handle;
}

function createMockRes() {
  return {
    statusCode: 200,
    body: undefined as any,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: any) {
      this.body = payload;
      return this;
    },
  };
}

jest.mock('../utils', () => ({
  getFileData: jest.fn(),
  addNewDataToFile: jest.fn(),
}));

const { getFileData } = require('../utils') as {
  getFileData: jest.Mock;
};

describe('appointments.routes', () => {
  const handler = getRouteHandler(appointmentsRouter, '/availability', 'get');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns available timeslots and clinic opticians', () => {
    getFileData.mockImplementation((fileName: string) => {
      switch (fileName) {
        case 'clinics':
          return [
            {
              id: 'clinic-1',
              name: 'Test Clinic',
              opticians: ['optician-1'],
            },
          ];
        case 'opticians':
          return [
            {
              id: 'optician-1',
              name: 'Test Optician',
              services_id: ['service-1'],
            },
          ];
        case 'appointments':
          return [
            {
              id: 'appt-1',
              patient_id: 'patient-1',
              appointment_datetime: '2025-10-02T09:00:00Z',
              clinic_id: 'clinic-1',
              service_id: 'service-1',
              notes: 'Test',
            },
          ];
        default:
          return [];
      }
    });

    const req = {
      query: {
        clinic_id: 'clinic-1',
        date: '2025-10-02',
        service_id: 'service-1',
        optician_id: 'optician-1',
      },
    } as any;
    const res = createMockRes();

    handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.available_timeslots).toContain('10:00');
    expect(res.body.available_timeslots).not.toContain('09:00');
    expect(res.body.opticians).toEqual([
      {
        id: 'optician-1',
        name: 'Test Optician',
      },
    ]);
  });
});
