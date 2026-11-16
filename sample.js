// ------------------------------------------------------------
// Lab 01 - From the terminal to Node.js
// ------------------------------------------------------------
// In session 1 you typed MongoDB commands directly in mongosh:
//
//   db.books.insertOne({ title: "Dune", author: "Frank Herbert" })
//   db.books.find()
//
// Here you will write the exact same operations, but as a Node.js
// script. The MongoDB driver translates your JavaScript calls into
// the same commands mongosh sends to the database.
// ------------------------------------------------------------

const { MongoClient } = require("mongodb");

// The connection string tells the driver where MongoDB is running.
// "mongodb://localhost:27017" is the default for a local installation.
const URI = "mongodb://localhost:27017";

// MongoClient is the entry point to the driver.
// You create one client per application.
const client = new MongoClient(URI);

// ------------------------------------------------------------
// Everything that talks to the database must happen inside an
// async function, because network calls take time.
// "await" pauses execution until the operation completes.
// ------------------------------------------------------------
async function main() {
  // Open the connection to MongoDB.
  await client.connect();

  // Select the database and collection to work with.
  // If they do not exist yet, MongoDB creates them on first write.
  const books = client.db("book_db").collection("books");

  // Start fresh on every run.
  await books.deleteMany({});

  // ----------------------------------------------------------
  // TODO 1 - insertOne with an embedded object
  // ----------------------------------------------------------
  // In mongosh you would write:
  //   db.books.insertOne({ title: "...", publisher: { name: "...", country: "..." } })
  await books.insertOne({ title: "Dune", publisher: { name: "Chilton", country: "USA" } });
  // Do the same here. Insert one book that has a publisher field
  // containing an embedded object with at least a name and a country.

  // ----------------------------------------------------------
  // TODO 2 - insertOne with an array
  await books.insertOne({
    title: "Brave New World",
    tags: ["dystopian", "science fiction", "classic"],
  });

  // ----------------------------------------------------------
  // TODO 3 - insertMany
  await books.insertMany([
    { title: "The Hobbit", tags: ["fantasy", "adventure"] },
    { title: "The Alchemist", tags: ["fiction", "adventure"] },
    { title: "1984", publisher: { name: "Secker & Warburg", country: "UK" } },
    { title: "The Stranger", publisher: { name: "Gallimard", country: "France" } },
    {
      title: "The Little Prince",
      publisher: { name: "Reynal & Hitchcock", country: "USA" },
      tags: ["fantasy", "classic"],
    },
  ]);

  // ----------------------------------------------------------
  // TODO 4 - find all documents
    const allBooks = await books.find({}).toArray();

  for (const book of allBooks) {
    console.log(book.title);
  }

  // ----------------------------------------------------------
  // TODO 5 - findOne with dot notation
    const firstFrenchBook = await books.findOne({
    "publisher.country": "France",
  });

  if (firstFrenchBook) {
    console.log(firstFrenchBook.title);
  }

  // ----------------------------------------------------------
  // TODO 6 - find with a filter
    const frenchBooks = await books.find({
    "publisher.country": "France",
  }).toArray();

  console.log(`Books with a publisher in France: ${frenchBooks.length}`);

  for (const book of frenchBooks) {
    console.log(book.title);
  }

  // ----------------------------------------------------------
  // TODO 7 - find with $exists
    const taggedBooks = await books.find({
    tags: { $exists: true },
  }).toArray();

  for (const book of taggedBooks) {
    console.log(book.title, book.tags);
  }
  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
