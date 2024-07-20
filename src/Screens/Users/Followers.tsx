import { useOutletContext } from "react-router-dom";

interface IFollowersContext {
  nameOfMyUser: string;
}

const Followers = () => {
  const { nameOfMyUser } = useOutletContext<IFollowersContext>();
  return <h1>List of {nameOfMyUser}'s followers</h1>;
};

export default Followers;
