// import {
//   collection,
//   doc,
//   getDoc,
//   onSnapshot,
//   query,
//   where,
// } from "firebase/firestore";
// import { useContext, useEffect, useState } from "react";
// import { db } from "../firebase/config";
// import { AuthContext } from "../auth/AuthProvider";

const useFirestore = () => {
  //   const { currentUser } = useContext(AuthContext);
  //   const [docs, setDocs] = useState({
  //     user: {},
  //     users: [],
  //     account: {},
  //     accounts: [],
  //     contacts: [],
  //     contact: {},
  //   });
  //   const collectionList = ["users", "accounts", "contacts"];
  //   useEffect(() => {
  //     //get user data
  //     if (!currentUser) {
  //       return;
  //     }
  //     //get contact data
  //     if (contactId) {
  //       const contactDocRef = doc(db, "contacts", contactId);
  //       getDoc(contactDocRef).then((contact) => {
  //         setDocs({
  //           ...docs,
  //           contact: { ...contact.data(), id: contact.id },
  //         });
  //       });
  //     }
  //     const userDocRef = doc(db, "users", currentUser?.uid);
  //     getDoc(userDocRef)
  //       .then((user) => {
  //         setDocs({ ...docs, user: { ...user.data(), id: user.id } });
  //       })
  //       .then(() => {
  //         //get account data
  //         const accountDocRef = doc(db, "accounts", docs.user?.accountId);
  //         getDoc(accountDocRef)
  //           .then((account) => {
  //             setDocs({
  //               ...docs,
  //               account: { ...account.data(), id: account.id },
  //             });
  //           })
  //           .catch((err) => {
  //             console.log(err);
  //           });
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //     const unSub = async (quer, c) => {
  //       await onSnapshot(
  //         quer,
  //         (querySnapShot) => {
  //           const documents = [];
  //           querySnapShot.forEach((doc) => {
  //             documents.push({ ...doc.data(), id: doc.id });
  //           });
  //           setDocs({ ...docs, [c]: documents });
  //         },
  //         (error) => {
  //           console.log(error);
  //         }
  //       );
  //     };
  //     if (docs.user?.id) {
  //       collectionList.forEach((collect) => {
  //         console.log(collect);
  //         let q;
  //         if (collect === "users" && docs?.user?.accountId) {
  //           q = query(
  //             collection(db, collect),
  //             where("accountId", "==", docs?.user?.accountId)
  //           );
  //           return unSub(q, collect);
  //         }
  //         if (collect === "accounts") {
  //           q = query(collection(db, collect));
  //           return unSub(q, collect);
  //         }
  //         if (collect === "contacts" && docs.user?.isAdmin) {
  //           q = query(
  //             collection(db, collect),
  //             where("account", "==", docs.user?.accountId)
  //           );
  //           return unSub(q, collect);
  //         }
  //         if (collect === "contacts" && !docs.user?.isAdmin) {
  //           q = query(
  //             collection(db, collect),
  //             where("user", "==", docs.user?.id)
  //           );
  //           return unSub(q, collect);
  //         }
  //       });
  //     }
  //   }, []);
  //   return { docs };
};
export default useFirestore;
