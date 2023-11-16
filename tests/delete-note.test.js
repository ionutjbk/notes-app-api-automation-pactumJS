const { spec, request } = require("pactum");
const { faker } = require("@faker-js/faker");

const baseUrl = "https://practice.expandtesting.com/notes/api";

describe("Delete note by id test suite", () => {
  let authToken = "";
  let noteId = "";

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

    const notes = await spec()
      .post(baseUrl + "/notes")
      .withHeaders("x-auth-token", authToken)
      .withBody({
        title: "This is the title",
        description: "This is the description",
        category: "Home",
      });

    noteId = notes.body.data.id;
  });

  it("Try to delete note by id", async () => {
    await spec()
      .delete(baseUrl + `/notes/${noteId}`)
      .withHeaders("x-auth-token", authToken)
      .expectStatus(200)
      .expectJsonLike({ message: "Note successfully deleted" });
  });

  it("Try to delete note with invalid id", async () => {
    await spec()
      .delete(baseUrl + `/notes/{invalid_id}`)
      .withHeaders("x-auth-token", authToken)
      .expectStatus(400)
      .expectJsonLike({ message: "Note ID must be a valid ID" });
  });
});
