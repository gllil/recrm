import { useContext } from "react";
import { AuthContext } from "../auth/AuthProvider";
import {
  useAccount,
  useAccounts,
  useContact,
  useContacts,
  useUser,
  useUsers,
} from "../firebase/fs";

const useReactQuery = (contactId) => {
  const { currentUser } = useContext(AuthContext);
  const { data: user, isSuccess: userSuccess } = useUser(currentUser.uid);
  const { data: account, isSuccess: acctSuccess } = useAccount(user?.accountId);
  const { data: accounts, isSuccess: acctsSuccess } = useAccounts();
  const { data: contacts, isSuccess: cntctsSuccess } = useContacts(
    user?.id,
    user?.accountId,
    user?.isAdmin
  );
  const { data: contact } = useContact(contactId);
  const { data: users, isSuccess: usersSuccess } = useUsers(
    user?.accountId,
    user?.id
  );

  if (
    userSuccess &&
    acctSuccess &&
    acctsSuccess &&
    cntctsSuccess &&
    usersSuccess
  ) {
    return { user, account, accounts, contacts, users, contact };
  } else {
    return "Loading...";
  }
};
export default useReactQuery;
