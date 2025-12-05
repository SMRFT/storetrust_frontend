import  { useState, useEffect } from "react";
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
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [loadingStates, setLoadingStates] = useState(true)
  const [loadingCities, setLoadingCities] = useState(false)
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
    useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await fetch("https://countriesnow.space/api/v0.1/countries/states", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: "India" }),
        })

        const data = await res.json()

        setStates(data.data.states)  // states = [{name: "..."}]
        setLoadingStates(false)
      } catch (error) {
        toast.error("Failed to load states")
        setLoadingStates(false)
      }
    }
    fetchStates()
  }, [])

  // -----------------------------
  // GENERIC INPUT CHANGE
  // -----------------------------
 
   const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // -----------------------------
  // ✅ STATE CHANGE → LOAD CITIES
  // -----------------------------
  const handleStateChange = async (e) => {
    const stateName = e.target.value

    setFormData((prev) => ({ ...prev, state: stateName, city: "" }))
    setCities([])

    if (!stateName) return

    setLoadingCities(true)

    try {
      const res = await fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: "India",
          state: stateName,
        }),
      })

      const data = await res.json()
      setCities(data.data || [])
    } catch (error) {
      toast.error("Failed to load cities")
    }

    setLoadingCities(false)
  }

  const handleCityChange = (e) => {
    setFormData((prev) => ({ ...prev, city: e.target.value }))
  }


 

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
        `Please fill in the following required fields: ${missingFields.join(", ")}`
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
    
    console.log("Full API Response:", result); // Debug log
    
    // ✅ CHECK FOR ERRORS FIRST (before checking success)
    // For 400 Bad Request - Django serializer validation errors
    if (result.status === 400) {
      console.log("Validation errors:", result.data);
      
      if (result.data) {
        const errorMessages = [];
        
        // Django serializer.errors format: { field_name: ["error message"] }
        for (const [field, messages] of Object.entries(result.data)) {
          if (Array.isArray(messages)) {
            // ✅ FIXED: Added parentheses around template literal
            errorMessages.push(`${field}: ${messages.join(", ")}`);
          } else if (typeof messages === 'string') {
            // ✅ FIXED: Added parentheses around template literal
            errorMessages.push(`${field}: ${messages}`);
          }
        }
        
        if (errorMessages.length > 0) {
          const combinedError = errorMessages.join("\n");
          toast.error(combinedError);
        } else {
          toast.error("Validation failed. Please check your input.");
        }
      } else {
        toast.error("Validation failed. Please check your input.");
      }
      return;
    }
    
    // For 500 errors or other errors with 'error' field
    if (result.error || !result.success) {
      toast.error(result.error || "Failed to add vendor. Please try again.");
      return;
    }
    
    // ✅ SUCCESS CASE - Only reached if no errors above
    if (result.success && (result.status === 201 || result.status === 200)) {
      toast.success("Vendor added successfully!");
      setTimeout(() => {
        navigate(-1);
      }, 1000);
      return;
    }
    
    // Generic fallback error
    toast.error("Failed to add vendor. Please try again.");
    
  } catch (error) {
    console.error("Unexpected submit error:", error);
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
              <Label>State</Label>
              <Select
                name="state"
                value={formData.state}
                onChange={handleStateChange}
                disabled={loadingStates}
              >
                <option value="">Select State</option>

                {states.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </Select>
            </FormGroup>

            {/* CITY DROPDOWN */}
            <FormGroup>
              <Label>City</Label>
              <Select
                name="city"
                value={formData.city}
                onChange={handleCityChange}
                disabled={!formData.state || loadingCities}
              >
                <option value="">
                  {loadingCities ? "Loading cities..." : "Select City"}
                </option>

                {cities.map((c, i) => (
                  <option key={i} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
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
