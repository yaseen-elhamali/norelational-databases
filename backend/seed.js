const { MongoClient } = require("mongodb");

const URI = "mongodb://localhost:27017";
const client = new MongoClient(URI);

// You will understand this boilerplate in session 6.
// For now, your job is to fill in the seven TODOs below.

async function main() {
  await client.connect();
  const users = client.db("blog_db").collection("users");

  await users.deleteMany({});

  // TODO 1: insert a user with an embedded address object.
  await users.insertOne({
    name: "Yaseen",
    age: 20,
    address: {
      city: "Paris",
      country: "France"
    }
  });

  // TODO 2: insert a user with a skills array containing at least 3 items.
  await users.insertOne({
    name: "Adam",
    age: 21,
    skills: ["JavaScript", "Python", "MongoDB"]
  });
  // TODO 3: use insertMany to insert at least 5 users in a single call.
  // Requirements:
  //   - At least 2 users must have address.country set to "France"
  //   - At least 2 users must have a skills array with at least 1 item
  await users.insertMany([
    {
      name: "Sara",
      age: 22,
      address: { city: "Paris", country: "France" },
      skills: ["Python", "HTML"]
    },
    {
      name: "Omar",
      age: 20,
      address: { city: "Lyon", country: "France" },
      skills: ["JavaScript"]
    },
    {
      name: "Ali",
      age: 23,
      address: { city: "Madrid", country: "Spain" }
    },
    {
      name: "Emma",
      age: 21,
      address: { city: "London", country: "UK" }
    },
    {
      name: "Lina",
      age: 22,
      address: { city: "Berlin", country: "Germany" }
    }
  ]);

  // TODO 4: retrieve all documents and log each user's name.
  const allUsers = await users.find({}).toArray();

  for (const user of allUsers) {
    console.log(user.name);
  }

  // TODO 5: use dot notation to find the user whose address.city is "Paris" and log the result.
  const parisUser = await users.findOne({
    "address.city": "Paris"
  });

  console.log(parisUser);
  // TODO 6: find all users whose address.country is "France" and log their names.
  const franceUsers = await users.find({
    "address.country": "France"
  }).toArray();

  for (const user of franceUsers) {
    console.log(user.name);
  }
  // TODO 7: find all users who have a skills field and log their names.
  const skilledUsers = await users.find({
    skills: { $exists: true }
  }).toArray();

  for (const user of skilledUsers) {
    console.log(user.name);
  }

  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
