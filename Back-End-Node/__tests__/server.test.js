const request = require("supertest");
const app = require("../server");
const { beforeAll, afterAll } = require("@jest/globals");
const nock = require("nock");
const { pool } = require("../dbConfig");


let token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwicm9sZXMiOiJtZW50b3IiLCJpYXQiOjE3MDIzOTI2MTUsImV4cCI6MTcwMjQ3OTAxNX0.JTl0Jm0atVu4_tNP1j7LEAm7WLI79VVNobOhIrMcxK4";

const mockSlackResponse = {
  authed_user: {
    id: "mocked_user_id",
    access_token: "mocked_access_token",
  },
};

beforeAll(() => {
  nock("https://slack.com")
    .post("/api/oauth.v2.access")
    .reply(200, mockSlackResponse);

  nock("https://slack.com/api")
    .get("/users.profile.get")
    .query(true)
    .reply(200, {
      profile: {
        email: "test@example.com",
        first_name: "John",
        last_name: "Doe",
        title: "Software Engineer",
        image_original: "https://example.com/avatar.jpg",
      },
    });
});

describe("GET /cities", () => {
  it("should respond with 200 OK", async () => {
    const response = await request(app)
      .get("/cities")
      .set("authorization", "Bearer " + token);
    expect(response.status).toBe(200);
  });
});

describe("GET /profile", () => {
  it("should respond with 200 OK", async () => {
    const response = await request(app)
      .get("/profile")
      .expect("Content-Type", /json/)
      .expect(200)
      .set("authorization", "Bearer " + token);
  });
});

describe("POST /insert-signup", () => {
  it("should insert signup class", async () => {
    const response = await request(app)
      .post("/insert-signup")
      .expect("Content-Type", /json/)
      .send({
        sessionId: "2",
        role: "1",
      })
      .expect(200)
      .set("authorization", "Bearer " + token);
  });
});

describe("Cancel sign up", () => {
  it("should cancel signup", async () => {
    const response = await request(app)
      .get("/cancel-signup/1")
      .expect(200)
      .set("authorization", "Bearer " + token);
  });
});

describe("GET /signup-details", () => {
  it("should respond with 200 OK", async () => {
    const response = await request(app)
      .get("/signup-details")
      .expect("Content-Type", /json/)
      .expect(200)
      .set("authorization", "Bearer " + token);
  });
});

describe("GET /lesson_content", () => {
  it("should respond with 200 OK", async () => {
    const response = await request(app)
      .get("/lesson_content")
      .expect("Content-Type", /json/)
      .expect(200)
      .set("authorization", "Bearer " + token);
  });
});

describe("GET /attendance/:sessionId", () => {
  it("should respond with 200 OK and return attendance data for a session", async () => {
    const sessionId = 2;

    const response = await request(app)
      .get(`/attendance/${sessionId}`)
      .expect("Content-Type", /json/)
      .expect(200)
      .set("authorization", "Bearer " + token);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should respond with 404 if the session ID is not found", async () => {
    const nonExistentSessionId = 999;

    const response = await request(app)
      .get(`/attendance/${nonExistentSessionId}`)
      .expect("Content-Type", /json/)
      .expect(200)
      .set("authorization", "Bearer " + token);
    expect(response.body.length).toBe(0);
  });
});

describe("GET /roles", () => {
  it("should respond with 200 OK and return roles", async () => {
    const response = await request(app)
      .get("/roles")
      .expect("Content-Type", /json/)
      .expect(200)
      .set("authorization", "Bearer " + token);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });
});


describe("Helper Function Tests", () => {
  // Assuming userId and sessionId are valid for your database
  const userId = 1;
  const sessionId = 1;
  const role = 1;

  describe("getSignUpDetailsFromDatabase", () => {
    it("should retrieve sign-up details for a user", async () => {
      const response = await request(app)
        .get("/signup-details")
        .set("authorization", "Bearer " + token);

      // Assuming the response body is an array of sign-up details
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      // Add more specific checks based on your response structure
    });
  });

  describe("cancelSignUp", () => {
    it("should cancel sign-up for a user and session", async () => {
      const response = await request(app)
        .get(`/cancel-signup/${sessionId}`)
        .expect(200)
        .set("authorization", "Bearer " + token);

      // Assuming the response body contains success message or confirmation
      expect(response.body.success).toBe(true);
    });
  });

  describe("insertSignUp", () => {
    it("should insert sign-up for a user and session", async () => {
      const response = await request(app)
        .post("/insert-signup")
        .send({
          sessionId: sessionId,
          role: role,
        })
        .expect(200)
        .set("authorization", "Bearer " + token);

      // Assuming the response body contains success message or confirmation
      expect(response.body.success).toBe(true);
    });
  });

 


  
});

afterAll(async () => {
  // Clean up any test-specific database modifications
  // This may involve deleting test users, sessions, etc.
  await pool.end();
});