import React from "react";

const DataList = ({ refresh }) => {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    import("axios").then(({ default: axios }) => {
      axios
        .get("get-users")
        .then((res) => setUsers(res.data))
        .finally(() => setLoading(false));
    });
  }, [refresh]);

  return (
    <div className="overflow-x-auto mt-10">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
              ID
            </th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
              Name
            </th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
              Email
            </th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
              Phone
            </th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
              Industry
            </th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
              Job Title
            </th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
              Company
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan={3} className="px-4 py-4 text-center">
                Loading...
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-4 py-4 text-center">
                No users found.
              </td>
            </tr>
          ) : (
            users.map((user, idx) => (
              <tr key={user.id}>
                <td className="px-4 py-2">{idx + 1}</td>
                <td className="px-4 py-2">{user.full_name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.phone}</td>
                <td className="px-4 py-2">{user.industry_option.label}</td>
                <td className="px-4 py-2">{user.job_title_option.label}</td>
                <td className="px-4 py-2">{user.company_option.label}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataList;
