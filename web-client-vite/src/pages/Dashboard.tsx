import { Helmet } from 'react-helmet-async'
import { useQuery } from '@tanstack/react-query'; 

import { getListUsers } from "../apis";

import ListUsersTable from "../components/ListUsersTable";
import LogoutButton from '../components/LogoutButton';
import UserListFilters from '../components/UserListFilters';

const Dashboard = () => {
  const { data, isFetching } = useQuery({
    queryKey: ['users'],
    queryFn: getListUsers
  })
  return (
    <div className="p-4">
      <Helmet>
        <title>Admin Page</title>
        <meta name="description" content="Admin Dashboard" />
      </Helmet>
      <div className="flex items-center justify-between mb-3">
        <UserListFilters />
        <LogoutButton />
      </div>
      {data && <ListUsersTable data={data} />}
      {isFetching && <p>Loading...</p>}
    </div>
  );
};

export default Dashboard;