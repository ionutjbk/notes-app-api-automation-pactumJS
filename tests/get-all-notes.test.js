const { spec, request } = require("pactum");

const getAllNotesSchema = require("../data/response/getNotesSchema.json");
const baseUrl = "https://practice.expandtesting.com/notes/api";

describe("Get all notes test suite", () => {
  const requestBody = {
    email: "user@email.com",
    password: "thepassword",
  };
  let authToken = "";

  before(async () => {
    request.setDefaultTimeout(10000);

    const response = await spec()
      .post(baseUrl + "/users/login")
      .withBody(requestBody)
      .expectStatus(200);

    await spec()
      .post(baseUrl + "/notes")
      .withHeaders("x-auth-token", authToken)
      .withBody({
        title: "This is the title",
        description: "This is the description",
        category: "Home",
      });

    authToken = response.body.data.token;
  });

  it("Get all notes", async () => {
    await spec()
      .get(baseUrl + "/notes")
      .withHeaders("x-auth-token", authToken)
      .expectStatus(200)
      .expectJsonSchema(getAllNotesSchema);
  });
});
