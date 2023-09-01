import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { REQRES_API_URL } from '../constants';
import './usertable.css'; 
interface User {
  id: number;
  avatar: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface UserDataApiResponse {
  data: User[];
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

const UserTable: React.FC = () => {
  const [userPageData, setUserPageData] = useState<UserDataApiResponse | null>(null);

  useEffect(() => {
    fetchUsers(0);
  }, []);

  const fetchUsers = async (pageNumber: number) => {
    try {
      const response = await axios.get(`${REQRES_API_URL}?page=${pageNumber + 1}`);
      if (response.status === 200) {
        setUserPageData(response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const pageCount: number = userPageData ? userPageData.total_pages : 0;

  const handlePageChange = ({ selected }: { selected: number }) => {
    fetchUsers(selected);
  };

  return (
    <div className="user-table-container">
      <h1>Users</h1>
      <table className="user-table">
        <thead>
          <tr>
            <th>Avatar</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {userPageData?.data.map((user: User) => (
            <tr key={user.id}>
              <td>
                <img src={user.avatar} alt={`Avatar for ${user.first_name}`} />
              </td>
              <td>{user.first_name} {user.last_name}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ReactPaginate
        previousLabel={'Previous'}
        nextLabel={'Next'}
        pageCount={pageCount}
        onPageChange={handlePageChange}
        containerClassName={'pagination'}
        activeClassName={'active'}
      />
    </div>
  );
};

export default UserTable;
