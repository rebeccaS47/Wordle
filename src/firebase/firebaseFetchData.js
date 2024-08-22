import { collection, query, getDocs } from 'firebase/firestore';

async function getRandomDocument(collectionName) {
  const collectionRef = collection(db, 'answers');
  const q = query(collectionRef);
  const querySnapshot = await getDocs(q);

  const docs = querySnapshot.docs;
  const randomIndex = Math.floor(Math.random() * docs.length);
  return docs[randomIndex].data();
}

export { getRandomDocument };
