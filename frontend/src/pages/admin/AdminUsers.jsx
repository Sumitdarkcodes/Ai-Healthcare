import { useEffect, useState } from "react";
import api from "../../services/api";

function AdminUsers() {

    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);


    useEffect(function () {

        async function fetchUsers() {

            try {

                setLoading(true);

                const response = await api.get(
                    "/admin/users"
                );

                console.log(
                    "ADMIN USERS:",
                    response.data
                );

                setUsers(
                    response.data.users || []
                );

            } catch (error) {

                console.error(
                    "ADMIN USERS ERROR:",
                    error.response?.data || error.message
                );

                alert(
                    error.response?.data?.message ||
                    "Failed to fetch users."
                );

            } finally {

                setLoading(false);

            }

        }

        fetchUsers();

    }, []);


    const viewUser = (user) => {

        alert(
            `Name: ${user.name}\n` +
            `Email: ${user.email}\n` +
            `Role: ${user.role}`
        );

    };


    return (
        <div>

            <h1>
                Manage Users
            </h1>

            <p>
                View all users in the healthcare system.
            </p>


            <h2>
                Total Users: {users.length}
            </h2>


            {loading ? (

                <p>
                    Loading users...
                </p>

            ) : users.length === 0 ? (

                <p>
                    No users found.
                </p>

            ) : (

                <table>

                    <thead>

                        <tr>

                            <th>
                                Name
                            </th>

                            <th>
                                Email
                            </th>

                            <th>
                                Role
                            </th>

                            <th>
                                Actions
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {users.map(function (user) {

                            return (

                                <tr key={user._id}>

                                    <td>
                                        {user.name}
                                    </td>

                                    <td>
                                        {user.email}
                                    </td>

                                    <td>
                                        {user.role}
                                    </td>

                                    <td>

                                        <button
                                            onClick={function () {
                                                viewUser(user);
                                            }}
                                        >
                                            View
                                        </button>

                                    </td>

                                </tr>

                            );

                        })}

                    </tbody>

                </table>

            )}

        </div>
    );
}

export default AdminUsers;