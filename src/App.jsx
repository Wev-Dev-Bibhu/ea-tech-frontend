import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import Form from "./components/Form";
import DataList from "./components/DataList";

function App() {
  useEffect(() => {
    const fetchCSRFToken = async () => {
      try {
        const response = await axios.get("http://localhost:8000/csrf-token", {
          withCredentials: true,
        });

        // Set token in Axios default header
        axios.defaults.headers.common["X-CSRF-TOKEN"] = response.data.token;
        console.log("✅ CSRF Token set:", response.data.token);
      } catch (error) {
        console.error("❌ Failed to fetch CSRF token", error);
      }
    };

    fetchCSRFToken();
  }, []);

  const [refresh, setRefresh] = useState(false);

  return (
    <div>
      <Form setRefresh={setRefresh} />
      <DataList refresh={refresh} />
    </div>
  );
}

export default App;
