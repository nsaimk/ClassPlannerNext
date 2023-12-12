const { pool } = require("../dbConfig");
const {
  cancelSignUp,
  getSignUpDetailsFromDatabase,
  insertSignUp,
  updateUser,
  createUser,
  updateTitle,
} = require("../helpers"); 

beforeAll(() => {
});

afterAll(async () => {
  await pool.end();
});

describe("cancelSignUp", () => {
  it("should cancel sign-up for a user and session", async () => {
    const userId = 5;
    const sessionId = 1;

    await cancelSignUp(sessionId, userId);

    const checkResult = await pool.query(
      "SELECT * FROM attendance WHERE person_id = $1 AND session_id = $2",
      [userId, sessionId]
    );

    expect(checkResult.rows.length).toBe(0);
  });
});

describe("getSignUpDetailsFromDatabase", () => {
  it("should retrieve sign-up details for a user", async () => {
    const userId = 4;
    const sessionId = 1;

    const result = await getSignUpDetailsFromDatabase(userId, sessionId);

    expect(Array.isArray(result.rows)).toBe(true);
    expect(result.rows.length).toBeGreaterThan(0);
    expect(result.rows[0].slack_firstname).toBeDefined();
    expect(result.rows[0].slack_lastname).toBeDefined();
    expect(result.rows[0].name).toBeDefined();
    expect(result.rows[0].meeting_link).toBeDefined();
    expect(result.rows[0].session_id).toBeDefined();
  });
});

describe("insertSignUp", () => {
  it("should insert sign-up for a user and session", async () => {
    const userId = 5;
    const sessionId = 1;
    const role = 1;

    // insertSignUp fonksiyonunu çağırarak işlemi gerçekleştirin.
    await insertSignUp(sessionId, role, userId);

    // Eklenen kaydın gerçekten eklenip eklenmediğini kontrol etmek için bir sorgu yapabilirsiniz.
    const checkResult = await pool.query(
      "SELECT * FROM attendance WHERE person_id = $1 AND session_id = $2 AND role_id = $3",
      [userId, sessionId, role]
    );

    // Eğer eklenen kayıt varsa, checkResult.rows.length 1 olmalıdır.
    expect(checkResult.rows.length).toBe(1);
  });

describe("updateUser", () => {
  it("should update user information", async () => {
    // Önceden eklenmiş bir test kullanıcısı olması gerekmektedir.
    const userId = 5;

    // updateUser fonksiyonunu çağırarak işlemi gerçekleştirin.
    const updatedFirstName = "UpdatedFirstName";
    const updatedLastName = "UpdatedLastName";
    const updatedImg = "https://example.com/updated-avatar.jpg";

    await updateUser(userId, updatedFirstName, updatedLastName, updatedImg);

    // Kullanıcının gerçekten güncellenip güncellenmediğini kontrol etmek için bir sorgu yapabilirsiniz.
    const checkResult = await pool.query("SELECT * FROM person WHERE id = $1", [
      userId,
    ]);

    // Eğer güncellenen kullanıcı varsa, kontrol ettiğiniz alanlar güncellenmiş olmalıdır.
    expect(checkResult.rows.length).toBe(1);
    expect(checkResult.rows[0].slack_firstname).toBe(updatedFirstName);
    expect(checkResult.rows[0].slack_lastname).toBe(updatedLastName);
    expect(checkResult.rows[0].slack_photo_link).toBe(updatedImg);
  });
});

describe("createUser", () => {
  it("should create a new user", async () => {
    // Yeni bir kullanıcı eklemek için createUser fonksiyonunu çağırın.
    const newUserImg = "https://example.com/new-avatar.jpg";
    const newUserFirstName = "NewUserFirstName";
    const newUserLastName = "NewUserLastName";
    const newUserRole = "user";
    const newUserEmail = "newuser6@example.com";

    const insertResult = await createUser(
      newUserImg,
      newUserFirstName,
      newUserLastName,
      newUserRole,
      newUserEmail
    );

    // Kullanıcının gerçekten eklenip eklenmediğini kontrol etmek için bir sorgu yapabilirsiniz.
    const checkResult = await pool.query("SELECT * FROM person WHERE id = $1", [
      insertResult.rows[0].id,
    ]);

    // Eğer yeni eklenen kullanıcı varsa, kontrol ettiğiniz alanlar doğru değerlere sahip olmalıdır.
    expect(checkResult.rows.length).toBe(1);
    expect(checkResult.rows[0].slack_firstname).toBe(newUserFirstName);
    expect(checkResult.rows[0].slack_lastname).toBe(newUserLastName);
    expect(checkResult.rows[0].slack_photo_link).toBe(newUserImg);
    expect(checkResult.rows[0].slack_title).toBe(newUserRole);
    expect(checkResult.rows[0].slack_email).toBe(newUserEmail);
  });
});

describe("updateTitle", () => {
  it("should update user's title", async () => {
    // Önceden eklenmiş bir test kullanıcısı olması gerekmektedir.
    const userId = 4;

    // updateTitle fonksiyonunu çağırarak işlemi gerçekleştirin.
    const updatedTitle = "updatedTitle";

    await updateTitle(userId, updatedTitle);

    // Kullanıcının unvanının gerçekten güncellenip güncellenmediğini kontrol etmek için bir sorgu yapabilirsiniz.
    const checkResult = await pool.query("SELECT * FROM person WHERE id = $1", [
      userId,
    ]);

    // Eğer güncellenen kullanıcı varsa, kontrol ettiğiniz alan doğru değere sahip olmalıdır.
    expect(checkResult.rows.length).toBe(1);
    expect(checkResult.rows[0].slack_title).toBe(updatedTitle);
  });
});
});
