const { spec, request } = require("pactum");
const { faker } = require("@faker-js/faker");

const baseUrl = "https://practice.expandtesting.com/notes/api";

describe("Register new user", () => {
  before(async () => {
    request.setDefaultTimeout(10000);
  });

  const randomName = faker.person.lastName();
  const randomEmail = faker.internet.email();
  const randomPassword = faker.internet.password({ length: 20 });

  const requestBody = {
    name: randomName,
    email: randomEmail,
    password: randomPassword,
  };

  it("Register a new user", async () => {
    await spec()
      .post(baseUrl + "/users/register")
      .withHeaders("Content-Type", "application/json")
      .withBody(requestBody)
      .expectStatus(201);
  });

  it("Register a new user that already exists", async () => {
    await spec()
      .post(baseUrl + "/users/register")
      .withHeaders("Content-Type", "application/json")
      .withBody(requestBody)
      .expectStatus(409);
  });

  it("Register a new user without required field", async () => {
    await spec()
      .post(baseUrl + "/users/register")
      .withHeaders("Content-Type", "application/json")
      .withBody({
        name: randomName,
        email: "invalid email",
        password: randomPassword,
      })
      .expectStatus(400);
  });

  
});
