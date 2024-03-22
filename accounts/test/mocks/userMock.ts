import { User } from '../../src/modules/users/entities/user';
import { UserRole } from '../../src/modules/users/entities/user';

const defaultId = '76c19af6-c172-4803-93a1-6ca1466bd52c';
const defaultEmail = 'user1@example.com';
const defaultPassword = 'Abcdef@';
const defaultName = 'Default User';
const defaultRole = UserRole.ADMIN;
const defaultUser: User = {
  id: defaultId,
  email: defaultEmail,
  password: defaultPassword,
  name: defaultName,
  role: defaultRole,
  createdAt: new Date('2024-03-06T20:59:27.084Z'),
  updatedAt: new Date('2024-03-06T20:59:27.084Z'),
};

const { password, createdAt, updatedAt, ...defaultUserWithoutOcultedValues } = defaultUser;
const { id, ...defaultUserWithoutOcultedValuesAndId } = defaultUserWithoutOcultedValues;

const defaultNewUser = { ...defaultUserWithoutOcultedValuesAndId, password };
const changeUserInfo = {
  name: 'Changed User',
};
const changedUserWithoutPassword = { ...defaultUserWithoutOcultedValues, ...changeUserInfo };
const defaultUserToValidate = {
  email: defaultEmail,
  password: defaultPassword,
}
const defaultValidatedUser = {
  id: defaultId,
  email: defaultEmail,
  name: defaultName,
  role: defaultRole,
}

export {
  defaultId,
  defaultEmail,
  defaultPassword,
  defaultName,
  defaultRole,
  defaultUser,
  defaultNewUser,
  changeUserInfo,
  defaultUserWithoutOcultedValues,
  changedUserWithoutPassword,
  defaultUserToValidate,
  defaultValidatedUser,
};
