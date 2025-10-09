import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, X } from "lucide-react";
import { toast } from "react-toastify";
import apiRequest from "../apiRequest";
import {
  Container,
  MaxWidthContainer,
  SecondaryButton,
  PrimaryButton,
  ActionSection,
  Required,
  Input,
  Label,
  FormGroup,
  FormGrid,
  Card,
  Title,
  Select,
  Header
} from "../StyledComponents";

const AddItems = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    itemName: "",
    group: "",
    group_type: "",
    category: "",
    classification: "",
    hsn: "",
    stockReorderLevel: "",
  });

  const [dropdownOptions, setDropdownOptions] = useState({
    groups: [],
    categories: [],
    classifications: [],
  });

  const StoreTrustbaseurl = process.env.REACT_APP_BACKEND_STORETRUST_BASE_URL;

  // Fetch initial groups
  useEffect(() => {
    fetchGroups();
  }, []);

  // Fetch categories when group changes
  useEffect(() => {
    if (formData.group) {
      fetchCategories(formData.group);
      setFormData((prev) => ({ ...prev, classification: "" }));
    } else {
      setDropdownOptions((prev) => ({ ...prev, categories: [], classifications: [] }));
    }
  }, [formData.group]);

  // Fetch classifications when group or category changes
  useEffect(() => {
    if (formData.group && formData.category) {
      fetchClassifications(formData.group, formData.category);
    } else if (formData.group) {
      fetchClassifications(formData.group);
    } else {
      setDropdownOptions((prev) => ({ ...prev, classifications: [] }));
    }
  }, [formData.group, formData.category]);

  const fetchGroups = async () => {
    try {
      const result = await apiRequest(`${StoreTrustbaseurl}items/groups/`, "GET");
      if (result.success) setDropdownOptions((prev) => ({ ...prev, groups: result.data }));
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const fetchCategories = async (group) => {
    try {
      const result = await apiRequest(`${StoreTrustbaseurl}items/categories/?group=${group}`, "GET");
      if (result.success) setDropdownOptions((prev) => ({ ...prev, categories: result.data }));
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchClassifications = async (group, category = "") => {
    try {
      let url = `${StoreTrustbaseurl}items/classifications/?group=${group}`;
      if (category) url += `&category=${category}`;
      const result = await apiRequest(url, "GET");
      if (result.success) setDropdownOptions((prev) => ({ ...prev, classifications: result.data }));
    } catch (error) {
      console.error("Error fetching classifications:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      // Only these fields are required; HSN is optional
      const requiredFields = {
        itemName: "Item Name",
        group: "Group",
        group_type: "Group Type",
        category: "Category",
        classification: "Classification",
        stockReorderLevel: "Stock Reorder Level",
      };

      const missingFields = Object.entries(requiredFields)
        .filter(([field, _]) => !formData[field] || formData[field].trim() === "")
        .map(([_, label]) => label);

      if (missingFields.length > 0) {
        toast.error(`Please fill in the following required fields: ${missingFields.join(", ")}`);
        return;
      }

      const result = await apiRequest(`${StoreTrustbaseurl}items/`, "POST", formData);

      if (result.success) {
        toast.success("Item added successfully!");
        navigate(-1);
      } else {
        if (result.data?.errors) {
          const errorMessages = Object.entries(result.data.errors)
            .map(([field, messages]) => `${field}: ${messages.join(", ")}`);
          toast.error(`Validation errors:\n${errorMessages.join("\n")}`);
        } else {
          toast.error(result.error || "Unknown error occurred");
        }
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const handleCancel = () => navigate(-1);

  return (
    <Container>
      <MaxWidthContainer>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "24px" }}>
          <SecondaryButton onClick={handleCancel} style={{ marginRight: "16px", width: "auto" }}>
            <ArrowLeft size={16} /> Back
          </SecondaryButton>
        </div>

        <Header>
          <Title>Add New Item</Title>
        </Header>

        <Card>
          <FormGrid>
            <FormGroup>
              <Label>Item Name <Required>*</Required></Label>
              <Input type="text" name="itemName" value={formData.itemName} onChange={handleInputChange} placeholder="Enter item name" />
            </FormGroup>

            <FormGroup>
              <Label>Group Type <Required>*</Required></Label>
              <Select name="group_type" value={formData.group_type} onChange={handleInputChange}>
                <option value="">Select Group Type</option>
                <option value="Service">Service</option>
                <option value="Product">Product</option>
                <option value="Asset">Asset</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Group <Required>*</Required></Label>
              <Input type="text" name="group" value={formData.group} onChange={handleInputChange} placeholder="Type or select group" list="groups-list" />
              <datalist id="groups-list">
                {dropdownOptions.groups.map((group, idx) => <option key={idx} value={group} />)}
              </datalist>
            </FormGroup>

            <FormGroup>
              <Label>Category <Required>*</Required></Label>
              <Input type="text" name="category" value={formData.category} onChange={handleInputChange} placeholder="Type or select category" list="categories-list" />
              <datalist id="categories-list">
                {dropdownOptions.categories.map((category, idx) => <option key={idx} value={category} />)}
              </datalist>
            </FormGroup>

            <FormGroup>
              <Label>Classification <Required>*</Required></Label>
              <Input type="text" name="classification" value={formData.classification} onChange={handleInputChange} placeholder="Type or select classification" list="classifications-list" />
              <datalist id="classifications-list">
                {dropdownOptions.classifications.map((classification, idx) => <option key={idx} value={classification} />)}
              </datalist>
            </FormGroup>

            <FormGroup>
              <Label>HSN</Label>
              <Input type="text" name="hsn" value={formData.hsn} onChange={handleInputChange} placeholder="Enter HSN code" />
            </FormGroup>

            <FormGroup>
              <Label>Stock Reorder Level <Required>*</Required></Label>
              <Input type="text" name="stockReorderLevel" value={formData.stockReorderLevel} onChange={handleInputChange} placeholder="Enter Stock Reorder Level" />
            </FormGroup>
          </FormGrid>
        </Card>

        <ActionSection>
          <SecondaryButton onClick={handleCancel}><X size={16} /> Cancel</SecondaryButton>
          <PrimaryButton onClick={handleSubmit}><Save size={16} /> Save Item</PrimaryButton>
        </ActionSection>
      </MaxWidthContainer>
    </Container>
  );
};

export default AddItems;
