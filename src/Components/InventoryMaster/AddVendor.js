import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, X } from "lucide-react";
import { toast } from "react-toastify";
import apiRequest from "../apiRequest";
import{
    Container,PrimaryButton,SecondaryButton,Title,ActionSection,TextArea,FormGroup,Select,Label,Input,Required,MaxWidthContainer,Card,FormGrid,
    Header
}from "../StyledComponents";


const AddVendor = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    supplierType: "",
    name: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    contactPerson: "",
    phone: "",
    email: "",
    // url: "",
    kgstTinNumber: "",
    gstin: "",
    payment: "",
    terms: "",
    // creditPeriod: "",
    // exportDataCode: "",
    // tdsPercent: "",
  });

  const StoreTrustbaseurl = process.env.REACT_APP_BACKEND_STORETRUST_BASE_URL;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      const requiredFields = {
        supplierType: "Supplier / Manufacturer",
        name: "Name",
        addressLine1: "Address Line 1",
        gstin: "GSTIN",
      };

      const missingFields = [];
      for (const [field, label] of Object.entries(requiredFields)) {
        if (!formData[field] || formData[field].trim() === "") {
          missingFields.push(label);
        }
      }

      if (missingFields.length > 0) {
        toast.error(
          `Please fill in the following required fields: ${missingFields.join(
            ", "
          )}`
        );
        return;
      }

      const submitData = {
        ...formData,
      };

      console.log("Submitting vendor data:", submitData);

      const result = await apiRequest(
        `${StoreTrustbaseurl}vendors/`,
        "POST",
        submitData
      );

      if (result.success) {
        toast.success("Vendor added successfully!");
        navigate(-1); // Go back to previous page
      } else {
        if (result.data?.errors) {
          const errorMessages = [];
          for (const [field, messages] of Object.entries(result.data.errors)) {
            errorMessages.push(`${field}: ${messages.join(", ")}`);
          }
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

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <Container>
      <MaxWidthContainer>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <SecondaryButton
            onClick={handleCancel}
            style={{ marginRight: "16px", width: "auto" }}
          >
            <ArrowLeft size={16} />
            Back
          </SecondaryButton>
        </div>
           <Header>
          <Title>Add New Vendor</Title>
          </Header>

        <Card>
          <FormGrid>
            <FormGroup>
              <Label>
                Supplier / Manufacturer <Required>*</Required>
              </Label>
              <Select
                name="supplierType"
                value={formData.supplierType}
                onChange={handleInputChange}
                
              >
                <option value="">Select Type</option>
                <option value="Supplier">Supplier</option>
                <option value="Manufacturer">Manufacturer</option>
                <option value="Both">Both</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>
                Name <Required>*</Required>
              </Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter vendor name"
              />
            </FormGroup>

            <FormGroup>
              <Label>
                Address Line 1 <Required>*</Required>
              </Label>
              <Input
                type="text"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleInputChange}
                placeholder="Enter address line 1"
              />
            </FormGroup>

            <FormGroup>
              <Label>Address Line 2</Label>
              <Input
                type="text"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleInputChange}
                placeholder="Enter address line 2"
              />
            </FormGroup>

            <FormGroup>
              <Label>City</Label>
              <Input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Enter city"
              />
            </FormGroup>

            <FormGroup>
              <Label>State</Label>
              <Input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="Enter state"
              />
            </FormGroup>

            <FormGroup>
              <Label>Pincode</Label>
              <Input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                placeholder="Enter pincode"
              />
            </FormGroup>

            <FormGroup>
              <Label>Contact Person</Label>
              <Input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleInputChange}
                placeholder="Enter contact person name"
              />
            </FormGroup>

            <FormGroup>
              <Label>Phone</Label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
              />
            </FormGroup>

            <FormGroup>
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
              />
            </FormGroup>

            <FormGroup>
              <Label>KGST / TIN Number</Label>
              <Input
                type="text"
                name="kgstTinNumber"
                value={formData.kgstTinNumber}
                onChange={handleInputChange}
                placeholder="Enter KGST/TIN number"
              />
            </FormGroup>

            <FormGroup>
              <Label>
                GSTIN <Required>*</Required>
              </Label>
              <Input
                type="text"
                name="gstin"
                value={formData.gstin}
                onChange={handleInputChange}
                placeholder="Enter GSTIN"
              />
            </FormGroup>

            <FormGroup>
              <Label>Payment</Label>
              <Select
                name="payment"
                value={formData.payment}
                onChange={handleInputChange}
              >
                <option value="">Select Payment Mode</option>
                <option value="CASH">CASH</option>
                <option value="CHEQUE">CHEQUE</option>
                <option value="UPI">UPI</option>
                <option value="NEFT">NEFT</option>
                <option value="RTGS">RTGS</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Terms</Label>
              <TextArea
                name="terms"
                value={formData.terms}
                onChange={handleInputChange}
                placeholder="Enter payment terms"
                rows="3"
              />
            </FormGroup>

            {/* <FormGroup>
              <Label>Credit Period (in days)</Label>
              <Input
                type="number"
                name="creditPeriod"
                value={formData.creditPeriod}
                onChange={handleInputChange}
                placeholder="Enter credit period in days"
              />
            </FormGroup> */}

            {/* <FormGroup>
              <Label>Export Data Code</Label>
              <Input
                type="text"
                name="exportDataCode"
                value={formData.exportDataCode}
                onChange={handleInputChange}
                placeholder="Enter export data code"
              />
            </FormGroup>

            <FormGroup>
              <Label>TDS %</Label>
              <Input
                type="number"
                step="0.01"
                name="tdsPercent"
                value={formData.tdsPercent}
                onChange={handleInputChange}
                placeholder="Enter TDS percentage"
              />
            </FormGroup> */}
          </FormGrid>
        </Card>

        <ActionSection>
          <SecondaryButton onClick={handleCancel}>
            <X size={16} />
            Cancel
          </SecondaryButton>
          <PrimaryButton onClick={handleSubmit}>
            <Save size={16} />
            Save Vendor
          </PrimaryButton>
        </ActionSection>
      </MaxWidthContainer>
    </Container>
  );
};

export default AddVendor;
