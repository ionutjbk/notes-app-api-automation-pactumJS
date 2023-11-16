const { spec, request } = require("pactum");
const { faker } = require("@faker-js/faker");

const baseUrl = "https://practice.expandtesting.com/notes/api";

describe("Logout user test suite", () => {
  const randomName = faker.person.lastName();
  const randomEmail = faker.internet.email();
  const randomPassword = faker.internet.password({ length: 20 });

  const requestBody = {
    name: randomName,
    email: randomEmail,
    password: randomPassword,
  };
  let authToken = "";

  before(async () => {
    request.setDefaultTimeout(10000);

    await spec()
      .post(baseUrl + "/users/register")
      .withHeaders("Content-Type", "application/json")
      .withBody(requestBody)
      .expectStatus(201);

    const response = await spec()
      .post(baseUrl + "/users/login")
      .withHeaders("Content-Type", "application/json")
      .withBody({ email: requestBody.email, password: requestBody.password })
      .expectStatus(200);

    authToken = response.body.data.token;
  });

  it("Logging out user by invalidating the auth token", async () => {
    await spec()
      .delete(baseUrl + "/users/logout")
      .withHeaders("x-auth-token", authToken)
      .expectStatus(200);
  });

  it("Trying to logout user with invalid no token", async () => {
    await spec()
      .delete(baseUrl + "/users/logout")
      .expectStatus(401);
  });

});


