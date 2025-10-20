import { faker } from "@faker-js/faker";
export const generateEmployee = () => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
});
