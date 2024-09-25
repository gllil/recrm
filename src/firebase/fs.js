import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  // onSnapshot,
  // query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "./config";
import { useQuery } from "@tanstack/react-query";

//list of collection references
const userCollectionRef = collection(db, "users");
const accountRef = collection(db, "accounts");
const contactsRef = collection(db, "contacts");

const checkForDuplicateAccounts = async (company) => {
  const qsnap = await getDocs(accountRef, where("companyName", "==", company));
  return qsnap.empty;
};

//add new documents
const newUser = async (values, id) => {
  return await setDoc(doc(userCollectionRef, id), values, { merge: true });
};

const newAccount = async (values) => {
  return await addDoc(accountRef, values);
};

const newContact = async (values) => {
  return await addDoc(contactsRef, values);
};

//Update Documents
const updateContact = async (values) => {
  return await setDoc(doc(contactsRef, values.id), values, { merge: true });
};

const updateAccount = async (values) => {
  return await setDoc(doc(accountRef, values.id), values, { merge: true });
};

//get documents
const getAccounts = async () => {
  const qsnap = await getDocs(accountRef);
  const accounts = [];
  qsnap.forEach((acct) => {
    accounts.push({ ...acct.data(), id: acct.id });
  });
  return accounts;
};

const getAccount = async (id) => {
  const docSnap = await getDoc(doc(db, "accounts", id));
  return { ...docSnap.data(), id: docSnap.id };
};

//get contacts
const queryContacts = async (user, account, isAdmin) => {
  // const u = user;
  // const a = account;

  let q;

  if (isAdmin) {
    q = query(contactsRef, where("account", "==", account));
  } else {
    q = query(contactsRef, where("user", "==", user));
  }

  const querySnapshot = await getDocs(q);
  const contacts = [];
  querySnapshot.forEach((doc) => {
    contacts.push({ ...doc.data(), id: doc.id });
  });

  return contacts;
};

const getUser = async (userId) => {
  const docSnap = await getDoc(doc(db, "users", userId));
  return { ...docSnap.data(), id: docSnap.id };
};

const getUsers = async (accountId) => {
  const q = query(userCollectionRef, where("accountId", "==", accountId));
  const querySnapshot = await getDocs(q);
  const users = [];
  querySnapshot.forEach((doc) => {
    users.push({ ...doc.data(), id: doc.id });
  });
  return users;
};

const getContact = async (contactId) => {
  const docSnap = await getDoc(doc(db, "contacts", contactId));
  return docSnap.data();
};

//React Query Calls
const useContacts = (userId, accountId, isAdmin) => {
  return useQuery({
    queryKey: ["contacts", userId, accountId],
    queryFn: () => {
      return queryContacts(userId, accountId, isAdmin);
    },
  });
};
// get contacts
const useContact = (contactId) => {
  return useQuery({
    queryKey: ["contact", contactId],
    queryFn: () => {
      return getContact(contactId);
    },
  });
};

const useUser = (userId) => {
  return useQuery({
    queryKey: ["users", userId],
    queryFn: () => {
      return getUser(userId);
    },
  });
};

const useUsers = (accountId, userId) => {
  return useQuery({
    queryKey: ["users", accountId],
    queryFn: () => {
      return getUsers(accountId, userId);
    },
  });
};

const useAccounts = () => {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: () => {
      return getAccounts();
    },
  });
};

const useAccount = (accountId) => {
  return useQuery({
    queryKey: ["accounts", accountId],
    queryFn: () => {
      return getAccount(accountId);
    },
  });
};

// const getUsers = async () => {
//   await getDocs(userRef);
// };

export {
  newUser,
  newContact,
  newAccount,
  useContacts,
  useContact,
  updateContact,
  useUser,
  checkForDuplicateAccounts,
  useAccounts,
  useAccount,
  updateAccount,
  useUsers,
};
