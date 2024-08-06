import { users } from "../ts/db";
import { Link, useSearchParams } from "react-router-dom";

const Home = () => {
  const [readSearchParams, setSearchParams] = useSearchParams();
  console.log(readSearchParams.has("geo"));
  setTimeout(() => {
    setSearchParams({
      day: "today",
      tomorrow: "123",
      /**
       * 3초 뒤 결과
       * http://localhost:3000/?day=today&tomorrow=123
       * */
    });
  }, 3000);
  return (
    <div>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <Link to={`/users/${user.id}`}>{user.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
