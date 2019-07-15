// const db = require("../db");
const _intersectionBy = require("lodash.intersectionby");
module.exports = {
  createList: function({ db, name, list }) {
    if (!name) throw new Error("must supply a name to create a list");
    db.collection("lists").insertOne({
      name,
      list
    });
    return list;
  },
  getLists: function({ db }) {
    // console.log(db);
    return db.lists.find().exec();
  },
  getListsByNames: async function({ db, names }) {
    console.log("lol");
    const results = await db.collection("lists").find({
      $expr: {
        $in: ["$name", names]
      }
    });
    return results.toArray();
    // var results = db
    //   .collection("lists")

    //   .then(data => {
    //     result = data.toArray();
    //     return result;
    //   });
    //   $match: {
    //     $expr: {
    //       $in: ["$name", names]
    //     }
    //   }
    // })
    // .exec((err, results) => {
    //   if (err) return next(err);
    //   else {
    //     return results;
    //   }
    // });
    // return names.reduce((arr, name) => {
    //   const data = db.data[name];
    //   arr.push({
    //     name,
    //     list: data
    //   });
    //   return arr;
    // }, []);
  }
};
