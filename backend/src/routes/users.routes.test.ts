import usersRouter from './users.routes';

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
  addNewDataToFile: jest.fn(),
  getFileData: jest.fn(),
}));

const { getFileData } = require('../utils') as {
  getFileData: jest.Mock;
};

describe('users.routes', () => {
  const handler = getRouteHandler(usersRouter, '/login', 'post');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns user data on valid login', () => {
    getFileData.mockReturnValue([
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'james@gmail.com',
        password: '119c9ae6f9ca741bd0a76f87fba0b22cab5413187afb2906aa2875c38e213603',
        role: 'patient',
        first_name: 'James',
        last_name: 'Smith',
        phone_number: '123-456-7890',
        birthday: '1985-01-15',
      },
    ]);

    const req = { body: { email: 'james@gmail.com', password: 'james' } } as any;
    const res = createMockRes();

    handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe('james@gmail.com');
    expect(res.body.password).toBeUndefined();
    expect(res.body.role).toBe('patient');
  });

  it('returns 401 for invalid credentials', () => {
    getFileData.mockReturnValue([
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'james@gmail.com',
        password: '119c9ae6f9ca741bd0a76f87fba0b22cab5413187afb2906aa2875c38e213603',
        role: 'patient',
        first_name: 'James',
        last_name: 'Smith',
        phone_number: '123-456-7890',
        birthday: '1985-01-15',
      },
    ]);

    const req = { body: { email: 'james@gmail.com', password: 'wrongpass' } } as any;
    const res = createMockRes();

    handler(req, res);

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('Invalid credentials');
  });
});
