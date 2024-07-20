import { useParams } from "react-router-dom";
import { users } from "../../db";

const User = () => {
  const { userId } = useParams();
  return (
    <h1>
      Yout id is {userId} and ur name is {users[Number(userId) - 1].name}
    </h1>
  );
};

export default User;
