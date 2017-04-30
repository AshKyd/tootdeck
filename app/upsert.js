module.exports = function(db, originalDoc, callback = () => {}){
  // No id, just insert it
  if(!originalDoc._id) return db.put(originalDoc).then(() => callback());

  const clonedDoc = Object.assign({}, originalDoc);
  delete clonedDoc._rev;

  return db.get(originalDoc._id)
    .then(function(doc){
      const updatedDoc = Object.assign({}, doc, clonedDoc);
      db.put(updatedDoc).then(() => callback());
    })
    .catch(error => db.put(clonedDoc).then(()=>callback));
}
