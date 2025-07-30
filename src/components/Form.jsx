import { useEffect, useState } from "react";
import FormDropdown from "./FormDropdown";
import axios from "../utils/axiosConfig";

const Form = (props) => {
  const [industryOptions, setIndustryOptions] = useState([]);
  const [jobTitleOptions, setJobTitleOptions] = useState([]);
  const [companyOptions, setCompanyOptions] = useState([]);

  // For tracking which option is currently being edited and its type
  const [editingOption, setEditingOption] = useState(null); // { option, type } or null

  const fetchAllDropdownOptions = async () => {
    axios
      .get("http://localhost:8000/get-options?type=industry")
      .then((res) => setIndustryOptions(res.data))
      .catch((err) => console.error(err));

    axios
      .get("http://localhost:8000/get-options?type=job_title")
      .then((res) => setJobTitleOptions(res.data))
      .catch((err) => console.error(err));

    axios
      .get("http://localhost:8000/get-options?type=company_name")
      .then((res) => setCompanyOptions(res.data))
      .catch((err) => console.error(err));
  };
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        await fetchAllDropdownOptions();
      } catch (error) {
        console.error(error);
      }
    };

    fetchOptions();
  }, []);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    industry: "",
    jobTitle: "",
    companyName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDropdownChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Generic function to add new option
  const addNewOption = async (type, label, setOptions, currentOptions) => {
    const trimmedLabel = label;
    if (!trimmedLabel) return;

    // Avoid duplicates by value
    if (currentOptions.some((opt) => opt.value === trimmedLabel.value)) return;

    try {
      await axios.post("/add-options", {
        industry: type,
        value: trimmedLabel.value,
        label: trimmedLabel.label,
      });
      console.log("✅ Option saved:", trimmedLabel);
      fetchAllDropdownOptions();
      setOptions((prev) => [...prev, trimmedLabel]);
    } catch (err) {
      console.error(
        "❌ Error saving option:",
        err.response?.data || err.message
      );
    }
  };

  // Generic function to update existing option
  const updateOption = async (
    type,
    updatedOption,
    setOptions,
    currentOptions
  ) => {
    if (!updatedOption) return;

    // Prevent duplicates except the updating option itself
    const duplicate = currentOptions.find(
      (opt) =>
        opt.value === updatedOption.value &&
        opt.value !== updatedOption.oldValue
    );
    if (duplicate) {
      alert("This option value already exists.");
      return;
    }

    try {
      await axios.post("/update-options", {
        industry: type,
        oldValue: updatedOption.oldValue,
        newValue: updatedOption.updated.value,
        newLabel: updatedOption.updated.label,
      });
      console.log("✅ Option updated:", updatedOption);
      fetchAllDropdownOptions();
    } catch (err) {
      console.error(
        "❌ Error updating option:",
        err.response?.data || err.message
      );
    }
  };

  // Specific handlers for Add
  const handleAddIndustry = (label) => {
    addNewOption("industry", label, setIndustryOptions, industryOptions);
  };
  const handleAddJobTitle = (label) => {
    addNewOption("job_title", label, setJobTitleOptions, jobTitleOptions);
  };
  const handleAddCompany = (label) => {
    addNewOption("company_name", label, setCompanyOptions, companyOptions);
  };

  // Specific handlers for Update
  const handleUpdateIndustry = (updatedOption) => {
    updateOption(
      "industry",
      updatedOption,
      setIndustryOptions,
      industryOptions
    );
    setEditingOption(null);
  };
  const handleUpdateJobTitle = (updatedOption) => {
    updateOption(
      "job_title",
      updatedOption,
      setJobTitleOptions,
      jobTitleOptions
    );
    setEditingOption(null);
  };
  const handleUpdateCompany = (updatedOption) => {
    updateOption(
      "company_name",
      updatedOption,
      setCompanyOptions,
      companyOptions
    );
    setEditingOption(null);
  };

  // Handlers for edit button clicks from FormDropdown - set editing option with type context
  const handleEditIndustry = (option) => {
    setEditingOption({ option, type: "industry" });
  };
  const handleEditJobTitle = (option) => {
    setEditingOption({ option, type: "job_title" });
  };
  const handleEditCompany = (option) => {
    setEditingOption({ option, type: "company_name" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(form);
    try {
      await axios.post("/save-user", form);
      alert("✅ Form submitted successfully");
      setForm({
        fullName: "",
        email: "",
        phone: "",
        industry: "",
        jobTitle: "",
        companyName: "",
      });
      props.setRefresh((prev) => !prev);
    } catch (error) {
      console.error("❌ Error submitting form:", error);
    }
  };

  // Helper to determine current editing option value for dropdowns:
  // if editingOption matches type, use editingOption.option.value, else use form value
  const getDropdownValue = (type, formValue) => {
    if (editingOption && editingOption.type === type && editingOption.option) {
      return editingOption.option.value;
    }
    return formValue;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto p-4 sm:p-8 bg-white rounded-xl shadow space-y-6"
    >
      <h2 className="text-2xl font-semibold mb-2 text-gray-800">Register</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Render other fields */}
        {[
          {
            label: "Full Name",
            type: "text",
            name: "fullName",
            placeholder: "Enter your name",
          },
          {
            label: "Email",
            type: "email",
            name: "email",
            placeholder: "Enter your email",
          },
          {
            label: "Phone",
            type: "number",
            name: "phone",
            placeholder: "Enter your phone number",
          },
        ].map(({ label, type, name, placeholder }) => (
          <div key={name} className="col-span-1">
            <label className="block mb-1 font-medium text-gray-700">
              {label}
            </label>
            <input
              type={type}
              name={name}
              value={form[name]}
              placeholder={placeholder}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition"
            />
          </div>
        ))}

        {/* Industry Dropdown */}
        <div className="col-span-1">
          <label className="block mb-1 font-medium text-gray-700">
            Industry
          </label>
          <FormDropdown
            dataList={industryOptions}
            value={getDropdownValue("industry", form.industry)}
            onChange={(value) => {
              handleDropdownChange("industry", value);
              // Clear editing when user manually changes selection
              if (editingOption?.type === "industry") setEditingOption(null);
            }}
            onAdd={handleAddIndustry}
            onEdit={handleEditIndustry}
            onUpdate={handleUpdateIndustry}
            placeholder="Select or add industry"
          />
        </div>

        {/* Job Title Dropdown */}
        <div className="col-span-1">
          <label className="block mb-1 font-medium text-gray-700">
            Job Title
          </label>
          <FormDropdown
            dataList={jobTitleOptions}
            value={getDropdownValue("job_title", form.jobTitle)}
            onChange={(value) => {
              handleDropdownChange("jobTitle", value);
              if (editingOption?.type === "job_title") setEditingOption(null);
            }}
            onAdd={handleAddJobTitle}
            onEdit={handleEditJobTitle}
            onUpdate={handleUpdateJobTitle}
            placeholder="Select or add job title"
          />
        </div>

        {/* Company Name Dropdown */}
        <div className="col-span-1">
          <label className="block mb-1 font-medium text-gray-700">
            Company Name
          </label>
          <FormDropdown
            dataList={companyOptions}
            value={getDropdownValue("company_name", form.companyName)}
            onChange={(value) => {
              handleDropdownChange("companyName", value);
              if (editingOption?.type === "company_name")
                setEditingOption(null);
            }}
            onAdd={handleAddCompany}
            onEdit={handleEditCompany}
            onUpdate={handleUpdateCompany}
            placeholder="Select or add company"
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition cursor-pointer"
      >
        Submit
      </button>
    </form>
  );
};

export default Form;
