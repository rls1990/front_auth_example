import { useEffect } from "react";
import { getUsers } from "../../api/auth";

export default function Users() {
  useEffect(() => {
    const users = async () => {
      const res = await getUsers();

      console.log(res.data);
    };

    users();
  }, []);

  return (
    <>
      <h4 className="center">Users</h4>
    </>
  );
}
