const { spec, request } = require("pactum");
const { faker } = require("@faker-js/faker");

const baseUrl = "https://practice.expandtesting.com/notes/api";

describe("Login test suite", () => {
  const randomName = faker.person.lastName();
  const randomEmail = faker.internet.email();
  const randomPassword = faker.internet.password({ length: 20 });

  const requestBody = {
    name: randomName,
    email: randomEmail,
    password: randomPassword,
  };

  before(async () => {
    request.setDefaultTimeout(10000);

    await spec()
      .post(baseUrl + "/users/register")
      .withHeaders("Content-Type", "application/json")
      .withBody(requestBody)
      .expectStatus(201);
  });

  it("POST login user with valid credentials", async () => {
    await spec()
      .post(baseUrl + "/users/login")
      .withHeaders("Content-Type", "application/json")
      .withBody({ email: requestBody.email, password: requestBody.password })
      .expectStatus(200);
  });

  it("POST login user with invalid credentials", async () => {
    await spec()
      .post(baseUrl + "/users/login")
      .withHeaders("Content-Type", "application/json")
      .withBody({ email: requestBody.email, password: "wrong_password" })
      .expectStatus(401);
  });
});
