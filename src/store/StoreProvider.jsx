/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useContacts, useUser } from "../firebase/fs";
import { AuthContext } from "../auth/AuthProvider";

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const { data: user } = useUser(currentUser?.uid);
  const {
    data: contacts,
    isSuccess,
    isPending,
    isFetching,
  } = useContacts(user?.id, user?.accountId);

  const getContactLength = (condition) => {
    const contactList = contacts?.filter((val) => val.status === condition);
    if (isSuccess) {
      return contactList?.length;
    }
  };

  const countRef = useRef({});
  const [tabCount, setTabCount] = useState({});

  useEffect(() => {
    if (isSuccess) {
      countRef.current = {
        pending: getContactLength("Pending"),
        showingHomes: getContactLength("Showing Homes"),
        writingOffers: getContactLength("Writing Offers"),
        underContract: getContactLength("Under Contract"),
        closed: getContactLength("Closed"),
        lost: getContactLength("Lost"),
      };

      setTabCount({ ...countRef.current });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isPending, isFetching]);

  const value = { tabCount, setTabCount };
  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};
