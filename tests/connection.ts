import Connection, { Protocol } from '~/connection';

describe('new Connection(url)', () => {
  it('should create from url', async () => {
    expect(
      new Connection(
        'mysql://username:password@localhost:3306/database?key=value'
      )
    ).toMatchObject({
      database: 'database',
      hostname: 'localhost',
      options: { key: 'value' },
      password: 'password',
      port: 3306,
      protocol: Protocol.Mysql,
      username: 'username'
    });
  });
  it('should create from object', async () => {
    expect(
      new Connection({
        database: 'database',
        hostname: 'localhost',
        options: { key: 'value' },
        password: 'password',
        port: 3306,
        protocol: Protocol.Mysql,
        username: 'username'
      })
    ).toMatchObject({
      database: 'database',
      hostname: 'localhost',
      options: { key: 'value' },
      password: 'password',
      port: 3306,
      protocol: Protocol.Mysql,
      username: 'username'
    });
  });
  it('should convert url', async () => {
    expect(
      new Connection({
        database: 'database',
        hostname: 'localhost',
        options: { key: 'value', howdy: 'texas' },
        password: 'password',
        port: 3306,
        protocol: Protocol.Mysql,
        username: 'username'
      }).url
    ).toBe(
      'mysql://username:password@localhost:3306/database?key=value&howdy=texas'
    );
  });
});
