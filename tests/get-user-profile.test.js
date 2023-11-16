const { spec, request } = require("pactum");
const { notNull } = require("pactum-matchers");
const { faker } = require("@faker-js/faker");

const baseUrl = "https://practice.expandtesting.com/notes/api";

describe("Get users profile test suite", () => {
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

  it("Get user profile that is currently logged in ", async () => {
    await spec()
      .get(baseUrl + "/users/profile")
      .withHeaders("x-auth-token", authToken)
      .expectStatus(200);
  });

  it("Get user profile without auth token ", async () => {
    await spec()
      .get(baseUrl + "/users/profile")
      .expectStatus(401);
  });

  it("Update user profile that is currently logged in", async () => {
    const updateRequestBody = {
      name: "Practice User",
      phone: "0123456789",
    };

    await spec()
      .patch(baseUrl + "/users/profile")
      .withBody(updateRequestBody)
      .withHeaders("x-auth-token", authToken)
      .expectStatus(200)
      .expectJsonMatch({
        data: {
          id: notNull(),
          name: "Practice User",
          phone: "0123456789",
        },
      });
  });

  it("Update user profile with missing required field", async () => {
    const updateRequestBody = {
      phone: "0123456789"
    };

    await spec()
      .patch(baseUrl + "/users/profile")
      .withBody(updateRequestBody)
      .withHeaders("x-auth-token", authToken)
      .expectStatus(400)
      .expectJsonLike({
          message: "User name must be between 4 and 30 characters"
      })
  });
});
