const { spec, request, expect } = require("pactum");

const baseUrl = "https://practice.expandtesting.com/notes/api";

describe("Create new note test suite", async () => {
  let authToken = "" 
  before(async () => {
    request.setDefaultTimeout(10000);
    const response = await spec()
      .post(baseUrl + "/users/login")
      .withHeaders("Content-Type", "application/json")
      .withBody({
        email: "user@email.com",
        password: "thepassword",
      })
      .expectStatus(200);

    authToken = response.body.data.token;
  });

  it('Create new note', async () => {
    await spec()
    .post(baseUrl + "/notes")
    .withHeaders("x-auth-token", authToken)
    .withBody({
      title: "This is the title",
      description: "This is the description",
      category: "Home",
    })
    .expectStatus(200)
  });
  
});
